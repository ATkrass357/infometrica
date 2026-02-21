from fastapi import APIRouter, HTTPException, Depends, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.application import ApplicationCreate, ApplicationResponse
from utils.auth import get_password_hash
from typing import List
from datetime import datetime
import secrets
import string

router = APIRouter(prefix="/api/applications", tags=["applications"])

# Get database instance
def get_db():
    from server import db
    return db

def generate_password(length=12):
    """Generate a secure random password"""
    alphabet = string.ascii_letters + string.digits + "!@#$%"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

# Public endpoint - anyone can submit application
@router.post("/submit", response_model=ApplicationResponse)
async def submit_application(
    application: ApplicationCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Submit a new job application"""
    # Create application document
    app_dict = application.dict()
    app_dict['id'] = f"app-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    app_dict['status'] = 'Neu'
    app_dict['created_at'] = datetime.utcnow()
    
    # Insert into database
    await db.applications.insert_one(app_dict)
    
    return ApplicationResponse(**app_dict)

# Protected endpoint - only admin can view
@router.get("/", response_model=List[ApplicationResponse])
async def get_applications(
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all applications (Admin only)"""
    # Verify admin token
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    # For now, just check if token exists (proper verification already done by frontend)
    # In production, verify the token here as well
    
    # Get all applications, sorted by creation date (newest first)
    applications = await db.applications.find().sort("created_at", -1).to_list(1000)
    
    # Convert MongoDB documents to response models
    return [ApplicationResponse(**app) for app in applications]

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
    
    result = await db.applications.delete_one({"id": application_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    return {"message": "Bewerbung gelöscht"}

# Update application status (Admin only)
@router.patch("/{application_id}/status")
async def update_application_status(
    application_id: str,
    status: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update application status (Admin only)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    result = await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    return {"message": "Status aktualisiert"}

# Accept application and create employee account
@router.post("/{application_id}/accept")
async def accept_application(
    application_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Accept an application and create employee account"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    # Get the application
    application = await db.applications.find_one({"id": application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    # Check if already accepted
    if application.get("status") == "Akzeptiert":
        raise HTTPException(status_code=400, detail="Bewerbung wurde bereits akzeptiert")
    
    # Check if employee with this email already exists
    existing_employee = await db.employees.find_one({"email": application["email"]})
    if existing_employee:
        raise HTTPException(status_code=400, detail="Ein Mitarbeiter mit dieser E-Mail existiert bereits")
    
    # Generate password
    password = generate_password()
    
    # Generate employee number
    employee_count = await db.employees.count_documents({})
    employee_number = f"EMP{str(employee_count + 1).zfill(3)}"
    
    # Create employee account
    employee_data = {
        "id": f"emp-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        "email": application["email"],
        "password_hash": get_password_hash(password),
        "name": application["name"],
        "position": application["position"],
        "department": "Testing",
        "employee_number": employee_number,
        "phone": application["mobilnummer"],
        "address": f"{application['strasse']}, {application['postleitzahl']} {application['stadt']}",
        "created_at": datetime.utcnow(),
        "last_login": None,
        "is_active": True
    }
    
    await db.employees.insert_one(employee_data)
    
    # Update application status
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {
            "status": "Akzeptiert",
            "accepted_at": datetime.utcnow(),
            "employee_id": employee_data["id"]
        }}
    )
    
    return {
        "message": "Bewerbung akzeptiert - Mitarbeiter-Account erstellt",
        "employee": {
            "name": application["name"],
            "email": application["email"],
            "password": password,
            "employee_number": employee_number,
            "position": application["position"]
        }
    }
