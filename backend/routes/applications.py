from fastapi import APIRouter, HTTPException, Depends, Header, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.application import ApplicationCreate, ApplicationResponse, ApplicantLoginResponse
from utils.auth import get_password_hash, verify_password, create_access_token, decode_token
from typing import List
from datetime import datetime, timedelta
import os
import uuid
import base64

# Import email service
from services.email_service import (
    send_application_confirmation,
    send_application_accepted,
    send_account_unlocked
)

router = APIRouter(prefix="/api/applications", tags=["applications"])

# Directory for storing verification images
UPLOAD_DIR = "/app/backend/uploads/verifications"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Get database instance
def get_db():
    from server import db
    return db


# Public endpoint - anyone can submit application with their chosen password
@router.post("/submit", response_model=ApplicationResponse)
async def submit_application(
    application: ApplicationCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Submit a new job application with password"""
    # Check if email already exists
    existing = await db.applications.find_one({"email": application.email})
    if existing:
        raise HTTPException(status_code=400, detail="Eine Bewerbung mit dieser E-Mail existiert bereits")
    
    # Create application document
    app_dict = application.model_dump()
    app_dict['id'] = f"app-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:4]}"
    app_dict['password_hash'] = get_password_hash(application.password)
    del app_dict['password']  # Don't store plain password
    app_dict['status'] = 'Neu'
    app_dict['created_at'] = datetime.utcnow()
    app_dict['verification_front'] = None
    app_dict['verification_back'] = None
    app_dict['verified_at'] = None
    
    # Insert into database
    await db.applications.insert_one(app_dict)
    
    return ApplicationResponse(**app_dict)


# Applicant login endpoint
@router.post("/login")
async def applicant_login(
    credentials: dict,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Login for applicants/employees"""
    email = credentials.get("email")
    password = credentials.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="E-Mail und Passwort erforderlich")
    
    # Find application by email
    application = await db.applications.find_one({"email": email})
    
    if not application:
        raise HTTPException(status_code=401, detail="Ungültige Anmeldedaten")
    
    # Verify password
    if not verify_password(password, application.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Ungültige Anmeldedaten")
    
    # Create access token
    access_token = create_access_token(
        data={
            "sub": application["email"],
            "id": application["id"],
            "role": "applicant",
            "status": application["status"]
        },
        expires_delta=timedelta(minutes=60)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "applicant": {
            "id": application["id"],
            "name": application["name"],
            "email": application["email"],
            "position": application["position"],
            "status": application["status"]
        }
    }


# Get applicant status
@router.get("/status")
async def get_applicant_status(
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get current applicant status and info"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Ungültiger Token")
    
    applicant_id = payload.get("id")
    application = await db.applications.find_one({"id": applicant_id}, {"_id": 0, "password_hash": 0})
    
    if not application:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    return application


# Upload verification documents
@router.post("/verification/upload")
async def upload_verification(
    front: UploadFile = File(...),
    back: UploadFile = File(...),
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Upload ID verification documents"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Ungültiger Token")
    
    applicant_id = payload.get("id")
    application = await db.applications.find_one({"id": applicant_id})
    
    if not application:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    if application["status"] != "Akzeptiert":
        raise HTTPException(status_code=400, detail="Verifizierung nicht möglich in diesem Status")
    
    # Validate file types
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if front.content_type not in allowed_types or back.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Nur JPEG, PNG oder WebP Bilder erlaubt")
    
    # Save files
    front_filename = f"{applicant_id}_front_{uuid.uuid4().hex[:8]}.{front.filename.split('.')[-1]}"
    back_filename = f"{applicant_id}_back_{uuid.uuid4().hex[:8]}.{back.filename.split('.')[-1]}"
    
    front_path = os.path.join(UPLOAD_DIR, front_filename)
    back_path = os.path.join(UPLOAD_DIR, back_filename)
    
    # Save front image
    front_content = await front.read()
    with open(front_path, "wb") as f:
        f.write(front_content)
    
    # Save back image
    back_content = await back.read()
    with open(back_path, "wb") as f:
        f.write(back_content)
    
    # Update application status
    await db.applications.update_one(
        {"id": applicant_id},
        {"$set": {
            "verification_front": front_filename,
            "verification_back": back_filename,
            "status": "Verifiziert",
            "verified_at": datetime.utcnow()
        }}
    )
    
    return {"message": "Dokumente erfolgreich hochgeladen", "status": "Verifiziert"}


# Protected endpoint - only admin can view
@router.get("/", response_model=List[ApplicationResponse])
async def get_applications(
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all applications (Admin only)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    # Get all applications, sorted by creation date (newest first)
    applications = await db.applications.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(1000)
    
    return applications


# Accept application (Admin only) - just changes status, no password generation
@router.post("/{application_id}/accept")
async def accept_application(
    application_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Accept an application - allows user to upload verification"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    application = await db.applications.find_one({"id": application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    if application.get("status") != "Neu":
        raise HTTPException(status_code=400, detail="Bewerbung kann in diesem Status nicht akzeptiert werden")
    
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": "Akzeptiert", "accepted_at": datetime.utcnow()}}
    )
    
    return {"message": "Bewerbung akzeptiert", "status": "Akzeptiert"}


# Verify/Unlock applicant (Admin only) - final step
@router.post("/{application_id}/unlock")
async def unlock_applicant(
    application_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Unlock applicant after verification review - gives full access"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    application = await db.applications.find_one({"id": application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    if application.get("status") != "Verifiziert":
        raise HTTPException(status_code=400, detail="Nur verifizierte Bewerbungen können freigeschaltet werden")
    
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": "Freigeschaltet", "unlocked_at": datetime.utcnow()}}
    )
    
    return {"message": "Mitarbeiter freigeschaltet", "status": "Freigeschaltet"}


# Get verification image (Admin only) - returns base64 for display
@router.get("/verification/{application_id}/{side}")
async def get_verification_image(
    application_id: str,
    side: str,  # "front" or "back"
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get verification image as base64 (Admin only - no download)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    if side not in ["front", "back"]:
        raise HTTPException(status_code=400, detail="Seite muss 'front' oder 'back' sein")
    
    application = await db.applications.find_one({"id": application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    filename = application.get(f"verification_{side}")
    if not filename:
        raise HTTPException(status_code=404, detail="Dokument nicht gefunden")
    
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")
    
    # Read and encode as base64
    with open(filepath, "rb") as f:
        image_data = f.read()
    
    # Determine content type
    ext = filename.split(".")[-1].lower()
    content_type = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}.get(ext, "image/jpeg")
    
    base64_data = base64.b64encode(image_data).decode("utf-8")
    
    return {
        "image": f"data:{content_type};base64,{base64_data}",
        "filename": filename
    }


# Delete verification documents (Admin only)
@router.delete("/verification/{application_id}")
async def delete_verification(
    application_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete verification documents (Admin only)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    application = await db.applications.find_one({"id": application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    # Delete files
    for side in ["front", "back"]:
        filename = application.get(f"verification_{side}")
        if filename:
            filepath = os.path.join(UPLOAD_DIR, filename)
            if os.path.exists(filepath):
                os.remove(filepath)
    
    # Update database
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {
            "verification_front": None,
            "verification_back": None
        }}
    )
    
    return {"message": "Dokumente gelöscht"}


# Delete application (Admin only)
@router.delete("/{application_id}")
async def delete_application(
    application_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete an application (Admin only)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    # First delete any verification files
    application = await db.applications.find_one({"id": application_id})
    if application:
        for side in ["front", "back"]:
            filename = application.get(f"verification_{side}")
            if filename:
                filepath = os.path.join(UPLOAD_DIR, filename)
                if os.path.exists(filepath):
                    os.remove(filepath)
    
    result = await db.applications.delete_one({"id": application_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    return {"message": "Bewerbung gelöscht"}
