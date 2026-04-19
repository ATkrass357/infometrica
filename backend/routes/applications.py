from fastapi import APIRouter, HTTPException, Depends, Header, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.application import ApplicationCreate, ApplicationResponse, ApplicantLoginResponse
from utils.auth import get_password_hash, verify_password, create_access_token, decode_token
from typing import List
from datetime import datetime, timedelta
import os
import uuid
import base64

# Import SMS service
from services.sms_service import (
    send_application_accepted_sms,
    send_contract_signed_sms,
    send_verification_complete_sms,
    send_account_unlocked_sms,
    send_task_assigned_sms
)

router = APIRouter(prefix="/api/applications", tags=["applications"])

# Directory for storing verification images
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads", "verifications")
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
    
    if application["status"] not in ["Akzeptiert", "Vertrag unterschrieben"]:
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
    
    # Send SMS notification
    phone = application.get("mobilnummer", "")
    if phone:
        await send_verification_complete_sms(phone, application["name"])
    
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
    
    # Send SMS notification
    phone = application.get("mobilnummer", "")
    if phone:
        await send_application_accepted_sms(phone, application["name"])
    
    return {"message": "Bewerbung akzeptiert", "status": "Akzeptiert"}


# Bulk accept applications (Admin only)
@router.post("/bulk-accept")
async def bulk_accept_applications(
    data: dict,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Accept multiple applications at once"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    # Validate the JWT token
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Ungültiger Token")
    
    application_ids = data.get("application_ids", [])
    
    if not application_ids:
        raise HTTPException(status_code=400, detail="Keine Bewerbungs-IDs angegeben")
    
    accepted = 0
    failed = 0
    
    for app_id in application_ids:
        application = await db.applications.find_one({"id": app_id})
        
        if not application:
            failed += 1
            continue
        
        if application.get("status") != "Neu":
            failed += 1
            continue
        
        # Update status
        await db.applications.update_one(
            {"id": app_id},
            {"$set": {"status": "Akzeptiert", "accepted_at": datetime.utcnow()}}
        )
        
        accepted += 1
    
    return {
        "message": f"{accepted} Bewerbung(en) akzeptiert",
        "accepted": accepted,
        "failed": failed
    }


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
    
    # Send SMS notification
    phone = application.get("mobilnummer", "")
    if phone:
        await send_account_unlocked_sms(phone, application["name"])
    
    return {"message": "Mitarbeiter freigeschaltet", "status": "Freigeschaltet"}


# Sign contract (Applicant - after acceptance)
@router.post("/sign-contract")
async def sign_contract(
    data: dict,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Sign employment contract - changes status to 'Vertrag unterschrieben'"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Ungültiger Token")
    
    email = payload.get("sub")
    application = await db.applications.find_one({"email": email})
    
    if not application:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    if application.get("status") != "Akzeptiert":
        raise HTTPException(status_code=400, detail="Vertrag kann nur nach Akzeptanz unterschrieben werden")
    
    signature_data = data.get("signature_data")
    iban = data.get("iban")
    
    if not signature_data:
        raise HTTPException(status_code=400, detail="Unterschrift fehlt")
    if not iban or len(iban) < 15:
        raise HTTPException(status_code=400, detail="Gültige IBAN erforderlich")
    
    # Save signature (optional - store as file or base64 in DB)
    signature_filename = f"sig_{application['id']}_{uuid.uuid4().hex[:6]}.png"
    signature_path = os.path.join(UPLOAD_DIR.replace("verifications", "signatures"), signature_filename)
    os.makedirs(os.path.dirname(signature_path), exist_ok=True)
    
    # Decode and save signature
    if signature_data.startswith("data:image"):
        signature_data = signature_data.split(",")[1]
    
    with open(signature_path, "wb") as f:
        f.write(base64.b64decode(signature_data))
    
    await db.applications.update_one(
        {"id": application["id"]},
        {"$set": {
            "status": "Vertrag unterschrieben",
            "contract_signed_at": datetime.utcnow(),
            "iban": iban,
            "signature_file": signature_filename
        }}
    )
    
    # Send SMS notification
    phone = application.get("mobilnummer", "")
    if phone:
        await send_contract_signed_sms(phone, application["name"])
    
    return {"message": "Vertrag erfolgreich unterschrieben", "status": "Vertrag unterschrieben"}



# Download signed contract as HTML (for print/save as PDF)
@router.get("/download-contract")
async def download_contract(
    token: str = None,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Accept token from query param or header
    jwt_token = None
    if token:
        jwt_token = token
    elif authorization and authorization.startswith("Bearer "):
        jwt_token = authorization.split(" ")[1]
    
    if not jwt_token:
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    payload = decode_token(jwt_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Ungültiger Token")
    
    applicant_id = payload.get("id")
    application = await db.applications.find_one({"id": applicant_id}, {"_id": 0})
    
    if not application:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    if not application.get("contract_signed_at"):
        raise HTTPException(status_code=400, detail="Vertrag wurde noch nicht unterschrieben")
    
    name = application.get("name", "")
    address = f"{application.get('strasse', '')} · {application.get('postleitzahl', '')} {application.get('stadt', '')}"
    signed_date = ""
    if application.get("contract_signed_at"):
        try:
            dt = application["contract_signed_at"]
            if isinstance(dt, str):
                dt = datetime.fromisoformat(dt)
            signed_date = dt.strftime("%d.%m.%Y")
        except:
            signed_date = "Datum unbekannt"
    
    # Load signature as base64
    sig_base64 = ""
    sig_file = application.get("signature_file", "")
    if sig_file:
        # Try multiple possible paths
        possible_paths = [
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads", "signatures", sig_file),
            os.path.join("uploads", "signatures", sig_file),
            os.path.join(os.getcwd(), "uploads", "signatures", sig_file),
            f"/root/infometrica/backend/uploads/signatures/{sig_file}",
        ]
        for sig_path in possible_paths:
            if os.path.exists(sig_path):
                with open(sig_path, "rb") as f:
                    sig_base64 = base64.b64encode(f.read()).decode()
                break
    
    sig_img_html = f'<img src="data:image/png;base64,{sig_base64}" style="width:100%;height:auto;max-height:120px;object-fit:contain;" />' if sig_base64 else ""
    
    from fastapi.responses import HTMLResponse
    
    html = f"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Arbeitsvertrag - {name}</title>
<style>
  @page {{ margin: 2cm; }}
  body {{ font-family: 'Segoe UI', Arial, sans-serif; color: #222; font-size: 11pt; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px; }}
  h1 {{ text-align: center; font-size: 20pt; margin-bottom: 4px; }}
  .subtitle {{ text-align: center; color: #666; margin-bottom: 30px; }}
  .parties {{ display: flex; gap: 40px; padding-bottom: 16px; border-bottom: 1px solid #ccc; margin-bottom: 20px; }}
  .parties div {{ flex: 1; }}
  .parties p {{ margin: 2px 0; }}
  .label {{ font-weight: bold; margin-bottom: 4px; }}
  h3 {{ margin-top: 24px; margin-bottom: 6px; }}
  ul {{ margin-top: 6px; padding-left: 24px; }}
  li {{ margin-bottom: 4px; }}
  .signatures {{ display: flex; gap: 60px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; }}
  .sig-block {{ flex: 1; }}
  .sig-line {{ margin-bottom: 4px; min-height: 80px; border-bottom: 1px solid #888; }}
  .sig-line img {{ width: 100%; height: auto; max-height: 120px; object-fit: contain; }}
  .sig-name {{ font-size: 9pt; color: #666; }}
  .print-btn {{ text-align: center; margin: 30px 0; }}
  .print-btn button {{ padding: 12px 32px; background: #00C853; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer; }}
  .print-btn button:hover {{ background: #00a844; }}
  @media print {{ .print-btn {{ display: none; }} }}
</style>
</head>
<body>
<div class="print-btn"><button onclick="window.print()">Als PDF speichern / Drucken</button></div>

<h1>ARBEITSVERTRAG</h1>
<p class="subtitle">für Angestellte und Mitarbeiter</p>

<div class="parties">
  <div>
    <p class="label">Arbeitgeber:</p>
    <p>Precision Labs</p>
    <p>Römerstraße 90</p>
    <p>79618 Rheinfelden (Baden)</p>
    <p style="color:#666;margin-top:4px;">vertreten durch Daniel Bärtschi</p>
  </div>
  <div>
    <p class="label">Arbeitnehmer:</p>
    <p>{name}</p>
    <p>{address}</p>
  </div>
</div>

<p><em>Dieser Vertrag wird zwischen den oben genannten Parteien geschlossen und beinhaltet die nachfolgenden Vereinbarungen:</em></p>

<h3>§1 Beginn des Arbeitsverhältnisses</h3>
<p>Dieses Arbeitsverhältnis beginnt nach der Unterschrift beider Seiten.</p>

<h3>§2 Tätigkeit</h3>
<p>Der Arbeitnehmer wird bei Precision Labs im Homeoffice eingestellt und vor allem mit folgenden Aufgaben beschäftigt:</p>
<ul>
  <li>Überprüfung von Apps und Softwares auf Benutzerfreundlichkeit und Mängel</li>
  <li>Video-Identifikationen zur Durchführung von Evaluierungen</li>
  <li>Erstellung und Einreichung der dazugehörigen Abschlussberichte innerhalb des vorgegebenen Zeitrahmens</li>
</ul>

<h3>§3 Arbeitszeit</h3>
<p>Die regelmäßige Arbeitszeit beträgt ungefähr 10 Wochenstunden an 2 - 4 Tagen der Woche.</p>

<h3>§4 Vergütung</h3>
<p>(1) Der Arbeitnehmer erhält eine Vergütung in Höhe von 25 - 70 € pro abgeschlossenem Auftrag, insgesamt maximal 603 EUR monatlich.</p>
<p>(2) Die Vergütung ist jeweils am Monatsende des Folgemonats fällig und wird per Überweisung an das vom Arbeitnehmer benannte Konto überwiesen.</p>

<h3>§5 Sonderzuwendungen</h3>
<p>(1) Der Arbeitgeber zahlt Sonderzuwendungen (Urlaubsgeld, Weihnachtsgeld) in den Monaten Juni und Dezember in Höhe von jeweils 603€.</p>

<h3>§6 Urlaubsanspruch</h3>
<p>(1) Der Arbeitnehmer hat grundsätzlich einen Anspruch auf einen jährlichen Erholungsurlaub von 28 Arbeitstagen.</p>

<h3>§7 Arbeitsverhinderung</h3>
<p>(1) Der Arbeitnehmer verpflichtet sich, jede Arbeitsverhinderung unverzüglich dem Arbeitgeber mitzuteilen.</p>

<h3>§8 Weitere Beschäftigungen</h3>
<p>Der Arbeitnehmer verpflichtet sich, jede Aufnahme einer weiteren Beschäftigung dem Arbeitgeber unverzüglich schriftlich mitzuteilen.</p>

<h3>§9 Kündigungsfristen</h3>
<p>(1) Das Arbeitsverhältnis wird auf unbestimmte Zeit eingegangen. Die ersten 6 Wochen gelten als Probezeit.</p>
<p>(2) Nach Ablauf der Probezeit gelten die gesetzlichen Kündigungsfristen.</p>

<div class="signatures">
  <div class="sig-block">
    <p style="color:#666;margin-bottom:8px;">Rheinfelden (Baden), {signed_date}</p>
    <div class="sig-line"><span style="font-family:'Brush Script MT',cursive,'Segoe Script','Comic Sans MS',sans-serif;font-size:22pt;color:#222;">Daniel Bärtschi</span></div>
    <p class="sig-name">Daniel Bärtschi · Arbeitgeber</p>
  </div>
  <div class="sig-block">
    <p style="color:#666;margin-bottom:8px;">Unterschrieben am {signed_date}</p>
    <div class="sig-line">
      {sig_img_html}
    </div>
    <p class="sig-name">{name} · Arbeitnehmer</p>
  </div>
</div>

</body>
</html>"""
    
    return HTMLResponse(content=html)



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
