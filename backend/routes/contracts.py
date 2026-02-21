from fastapi import APIRouter, HTTPException, Depends, Header, UploadFile, File
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from utils.auth import decode_token
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
import os
import uuid
import base64
import io

# PDF Generation
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY

router = APIRouter(prefix="/api/contracts", tags=["contracts"])

# Directory for storing contracts
CONTRACT_DIR = "/app/backend/uploads/contracts"
SIGNATURE_DIR = "/app/backend/uploads/signatures"
os.makedirs(CONTRACT_DIR, exist_ok=True)
os.makedirs(SIGNATURE_DIR, exist_ok=True)

def get_db():
    from server import db
    return db


class ContractCreate(BaseModel):
    employee_id: str
    employee_name: str
    employee_email: str
    position: str
    start_date: str
    salary: str
    working_hours: str = "40"


class SignatureSubmit(BaseModel):
    signature_data: str  # Base64 encoded signature image
    iban: str  # Employee's IBAN for payment


# Create employment contract for an employee
@router.post("/create")
async def create_contract(
    contract_data: ContractCreate,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Admin creates a contract for an employee to sign"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    # Generate contract ID
    contract_id = f"contract-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6]}"
    
    # Create contract document
    contract = {
        "id": contract_id,
        "employee_id": contract_data.employee_id,
        "employee_name": contract_data.employee_name,
        "employee_email": contract_data.employee_email,
        "position": contract_data.position,
        "start_date": contract_data.start_date,
        "salary": contract_data.salary,
        "working_hours": contract_data.working_hours,
        "status": "pending",  # pending, signed
        "created_at": datetime.utcnow(),
        "signed_at": None,
        "signature_file": None,
        "signed_pdf": None
    }
    
    await db.contracts.insert_one(contract)
    
    return {
        "message": "Vertrag erstellt",
        "contract_id": contract_id,
        "status": "pending"
    }


# Get contracts for employee
@router.get("/my-contracts")
async def get_my_contracts(
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get contracts assigned to the logged-in employee"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Ungültiger Token")
    
    employee_email = payload.get("sub")
    
    contracts = await db.contracts.find(
        {"employee_email": employee_email},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return contracts


# Get specific contract details
@router.get("/{contract_id}")
async def get_contract(
    contract_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get contract details"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    contract = await db.contracts.find_one({"id": contract_id}, {"_id": 0})
    
    if not contract:
        raise HTTPException(status_code=404, detail="Vertrag nicht gefunden")
    
    return contract


# Get all contracts (Admin)
@router.get("/")
async def get_all_contracts(
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all contracts (Admin only)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    contracts = await db.contracts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    return contracts


# Sign contract
@router.post("/{contract_id}/sign")
async def sign_contract(
    contract_id: str,
    signature: SignatureSubmit,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Employee signs a contract"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Ungültiger Token")
    
    # Get contract
    contract = await db.contracts.find_one({"id": contract_id})
    
    if not contract:
        raise HTTPException(status_code=404, detail="Vertrag nicht gefunden")
    
    if contract["status"] == "signed":
        raise HTTPException(status_code=400, detail="Vertrag bereits unterschrieben")
    
    # Validate IBAN
    iban = signature.iban.replace(" ", "").strip()
    if len(iban) < 15 or len(iban) > 34:
        raise HTTPException(status_code=400, detail="Ungültige IBAN")
    
    # Save signature image
    try:
        # Remove data URL prefix if present
        sig_data = signature.signature_data
        if "base64," in sig_data:
            sig_data = sig_data.split("base64,")[1]
        
        sig_bytes = base64.b64decode(sig_data)
        sig_filename = f"{contract_id}_signature.png"
        sig_path = os.path.join(SIGNATURE_DIR, sig_filename)
        
        with open(sig_path, "wb") as f:
            f.write(sig_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Fehler beim Speichern der Signatur: {str(e)}")
    
    # Add IBAN to contract for PDF generation
    contract["iban"] = iban
    
    # Generate signed PDF
    try:
        pdf_filename = f"{contract_id}_signed.pdf"
        pdf_path = os.path.join(CONTRACT_DIR, pdf_filename)
        
        generate_signed_contract_pdf(contract, sig_path, pdf_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler beim Erstellen des PDFs: {str(e)}")
    
    # Update contract in database with IBAN
    await db.contracts.update_one(
        {"id": contract_id},
        {"$set": {
            "status": "signed",
            "signed_at": datetime.utcnow(),
            "signature_file": sig_filename,
            "signed_pdf": pdf_filename,
            "iban": iban
        }}
    )
    
    return {
        "message": "Vertrag erfolgreich unterschrieben",
        "status": "signed",
        "pdf_file": pdf_filename
    }


# Download signed contract PDF
@router.get("/{contract_id}/download")
async def download_contract(
    contract_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Download signed contract as PDF"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    contract = await db.contracts.find_one({"id": contract_id})
    
    if not contract:
        raise HTTPException(status_code=404, detail="Vertrag nicht gefunden")
    
    if contract["status"] != "signed":
        raise HTTPException(status_code=400, detail="Vertrag noch nicht unterschrieben")
    
    pdf_path = os.path.join(CONTRACT_DIR, contract["signed_pdf"])
    
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF nicht gefunden")
    
    def iter_file():
        with open(pdf_path, "rb") as f:
            yield from f
    
    return StreamingResponse(
        iter_file(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Arbeitsvertrag_{contract['employee_name'].replace(' ', '_')}.pdf"
        }
    )


def generate_signed_contract_pdf(contract: dict, signature_path: str, output_path: str):
    """Generate a professional employment contract PDF with signature"""
    
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4
    
    # Header
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width/2, height - 2*cm, "ARBEITSVERTRAG")
    
    c.setFont("Helvetica", 10)
    c.drawCentredString(width/2, height - 2.7*cm, "Infometrica GmbH - App Testing Agency")
    
    # Line
    c.setLineWidth(1)
    c.line(2*cm, height - 3.2*cm, width - 2*cm, height - 3.2*cm)
    
    # Contract details
    y_pos = height - 4.5*cm
    c.setFont("Helvetica", 11)
    
    # Parties
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2*cm, y_pos, "Zwischen")
    y_pos -= 0.7*cm
    
    c.setFont("Helvetica", 11)
    c.drawString(2*cm, y_pos, "Infometrica GmbH")
    y_pos -= 0.5*cm
    c.drawString(2*cm, y_pos, "Teststraße 123, 10115 Berlin")
    y_pos -= 0.5*cm
    c.drawString(2*cm, y_pos, "- nachfolgend 'Arbeitgeber' genannt -")
    y_pos -= 1*cm
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2*cm, y_pos, "und")
    y_pos -= 0.7*cm
    
    c.setFont("Helvetica", 11)
    c.drawString(2*cm, y_pos, contract["employee_name"])
    y_pos -= 0.5*cm
    c.drawString(2*cm, y_pos, f"E-Mail: {contract['employee_email']}")
    y_pos -= 0.5*cm
    c.drawString(2*cm, y_pos, "- nachfolgend 'Arbeitnehmer' genannt -")
    y_pos -= 1.2*cm
    
    c.drawString(2*cm, y_pos, "wird folgender Arbeitsvertrag geschlossen:")
    y_pos -= 1.2*cm
    
    # Contract terms
    terms = [
        ("§1 Beginn und Tätigkeit", [
            f"Das Arbeitsverhältnis beginnt am {contract['start_date']}.",
            f"Der Arbeitnehmer wird als {contract['position']} eingestellt.",
            "Der Arbeitsort ist Berlin mit Möglichkeit zum Home-Office."
        ]),
        ("§2 Arbeitszeit", [
            f"Die regelmäßige wöchentliche Arbeitszeit beträgt {contract['working_hours']} Stunden.",
            "Die Verteilung der Arbeitszeit erfolgt nach betrieblichen Erfordernissen."
        ]),
        ("§3 Vergütung", [
            f"Der Arbeitnehmer erhält ein monatliches Bruttogehalt von {contract['salary']} EUR.",
            "Die Zahlung erfolgt jeweils zum Monatsende."
        ]),
        ("§4 Urlaub", [
            "Der Arbeitnehmer hat Anspruch auf 30 Arbeitstage bezahlten Urlaub pro Jahr."
        ]),
        ("§5 Kündigung", [
            "Die Kündigungsfrist beträgt während der Probezeit 2 Wochen.",
            "Nach der Probezeit gelten die gesetzlichen Kündigungsfristen."
        ]),
        ("§6 Probezeit", [
            "Die ersten 6 Monate gelten als Probezeit."
        ])
    ]
    
    c.setFont("Helvetica", 10)
    
    for title, paragraphs in terms:
        if y_pos < 6*cm:  # New page if needed
            c.showPage()
            y_pos = height - 2*cm
            c.setFont("Helvetica", 10)
        
        c.setFont("Helvetica-Bold", 10)
        c.drawString(2*cm, y_pos, title)
        y_pos -= 0.5*cm
        c.setFont("Helvetica", 10)
        
        for para in paragraphs:
            # Simple text wrapping
            words = para.split()
            line = ""
            for word in words:
                test_line = line + word + " "
                if c.stringWidth(test_line, "Helvetica", 10) < width - 4*cm:
                    line = test_line
                else:
                    c.drawString(2*cm, y_pos, line.strip())
                    y_pos -= 0.4*cm
                    line = word + " "
            if line:
                c.drawString(2*cm, y_pos, line.strip())
                y_pos -= 0.4*cm
        y_pos -= 0.5*cm
    
    # Signature section
    if y_pos < 8*cm:
        c.showPage()
        y_pos = height - 2*cm
    
    y_pos -= 1*cm
    c.setLineWidth(0.5)
    c.line(2*cm, y_pos, width - 2*cm, y_pos)
    y_pos -= 1*cm
    
    c.setFont("Helvetica-Bold", 11)
    c.drawString(2*cm, y_pos, "Unterschriften")
    y_pos -= 1.5*cm
    
    # Date and place
    c.setFont("Helvetica", 10)
    sign_date = contract.get("signed_at", datetime.utcnow())
    if isinstance(sign_date, datetime):
        sign_date_str = sign_date.strftime("%d.%m.%Y")
    else:
        sign_date_str = datetime.utcnow().strftime("%d.%m.%Y")
    
    c.drawString(2*cm, y_pos, f"Berlin, den {sign_date_str}")
    y_pos -= 1.5*cm
    
    # Employee signature
    c.drawString(2*cm, y_pos + 3*cm, "Unterschrift Arbeitnehmer:")
    
    # Add signature image
    try:
        from PIL import Image as PILImage
        sig_img = PILImage.open(signature_path)
        
        # Calculate dimensions
        max_width = 6*cm
        max_height = 2.5*cm
        
        img_width, img_height = sig_img.size
        aspect = img_width / img_height
        
        if img_width > img_height:
            display_width = min(max_width, img_width * 0.5)
            display_height = display_width / aspect
        else:
            display_height = min(max_height, img_height * 0.5)
            display_width = display_height * aspect
        
        c.drawImage(signature_path, 2*cm, y_pos, width=display_width, height=display_height)
    except Exception as e:
        print(f"Error adding signature: {e}")
        c.drawString(2*cm, y_pos + 1*cm, "[Digitale Signatur]")
    
    y_pos -= 0.5*cm
    c.line(2*cm, y_pos, 8*cm, y_pos)
    y_pos -= 0.4*cm
    c.setFont("Helvetica", 9)
    c.drawString(2*cm, y_pos, contract["employee_name"])
    
    # Employer signature area
    c.drawString(11*cm, y_pos + 3.9*cm, "Unterschrift Arbeitgeber:")
    y_pos_employer = y_pos + 0.5*cm
    c.line(11*cm, y_pos_employer, 17*cm, y_pos_employer)
    c.drawString(11*cm, y_pos, "Infometrica GmbH")
    
    # Footer
    c.setFont("Helvetica", 8)
    c.drawCentredString(width/2, 1.5*cm, f"Vertragsnummer: {contract['id']} | Erstellt am: {contract.get('created_at', datetime.utcnow()).strftime('%d.%m.%Y')}")
    c.drawCentredString(width/2, 1*cm, "Dieses Dokument wurde digital signiert und ist rechtsgültig.")
    
    c.save()
