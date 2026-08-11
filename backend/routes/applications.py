from fastapi import APIRouter, HTTPException, Depends, Header, UploadFile, File, Body
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

    # Normalize and validate referral_slug
    ref_slug = (app_dict.get('referral_slug') or '').strip().lower() or None
    if ref_slug:
        ref = await db.referrals.find_one({"slug": ref_slug, "active": True})
        if ref:
            app_dict['referral_slug'] = ref_slug
            await db.referrals.update_one({"slug": ref_slug}, {"$inc": {"applications": 1}})
        else:
            app_dict['referral_slug'] = None
    else:
        app_dict['referral_slug'] = None
    
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
    
    # Create access token (long-lived; user logs out manually)
    access_token = create_access_token(
        data={
            "sub": application["email"],
            "id": application["id"],
            "role": "applicant",
            "status": application["status"]
        },
        expires_delta=timedelta(days=365)
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
    data: dict = Body(default={}),
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Accept an application with a chosen contract type - allows user to upload verification"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    application = await db.applications.find_one({"id": application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    if application.get("status") != "Neu":
        raise HTTPException(status_code=400, detail="Bewerbung kann in diesem Status nicht akzeptiert werden")
    
    contract_type = (data or {}).get("contract_type", "vollzeit")
    if contract_type not in ("vollzeit", "teilzeit", "minijob", "minijob_at", "vollzeit_at", "teilzeit_at", "freiberufler_at"):
        contract_type = "vollzeit"
    
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": "Akzeptiert", "contract_type": contract_type, "accepted_at": datetime.utcnow()}}
    )
    
    # Send SMS notification
    phone = application.get("mobilnummer", "")
    if phone:
        await send_application_accepted_sms(phone, application["name"])
    
    return {"message": "Bewerbung akzeptiert", "status": "Akzeptiert", "contract_type": contract_type}


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



def _build_contract_html_parts(contract_type: str, signed_date: str):
    """Return (subtitle, sections_html) for the given contract type."""
    if contract_type == "teilzeit":
        subtitle = "Teilzeitbeschäftigung (mit Provision)"
        sections_html = f"""
<h3>§1 Beginn und Dauer</h3>
<p>Das Arbeitsverhältnis beginnt am {signed_date} (Tag der Unterzeichnung durch beide Parteien). Es wird auf unbestimmte Zeit geschlossen. Die Probezeit beträgt drei Monate. Während der Probezeit kann das Arbeitsverhältnis mit einer Frist von zwei Wochen gekündigt werden.</p>

<h3>§2 Tätigkeit</h3>
<p>Der Arbeitnehmer wird bei Webora als <strong>Mitarbeiter/in in der Daten- und Produktprüfung</strong> eingestellt. Die Tätigkeit umfasst insbesondere:</p>
<ul>
  <li>Durchführung von Softwaretests, Produkttests und Testläufen unter realen Bedingungen</li>
  <li>Dokumentation und Auswertung der Testergebnisse</li>
  <li>Analyse von Schwachstellen und Erstellung von Verbesserungsvorschlägen</li>
  <li>Zusammenarbeit mit dem Team zur Optimierung von Qualität und Performance</li>
  <li>Unterstützung bei der Weiterentwicklung der Testmethoden</li>
</ul>
<p>Die Tätigkeit erfolgt 100 % im Homeoffice (mobiles Arbeiten). Der Arbeitnehmer stellt einen geeigneten Arbeitsplatz mit Internetzugang zur Verfügung. Der Arbeitgeber stellt die erforderlichen Testzugänge und Softwarelizenzen bereit.</p>

<h3>§3 Arbeitszeit</h3>
<p>Die regelmäßige wöchentliche Arbeitszeit beträgt 20 Stunden.</p>
<p>Die Lage der Arbeitszeit wird in Abstimmung mit dem Arbeitgeber flexibel festgelegt. Kernarbeitszeiten bestehen nicht, der Arbeitnehmer muss jedoch für Absprachen mit dem Team an Werktagen zwischen 9:00 und 17:00 Uhr grundsätzlich erreichbar sein.</p>

<h3>§4 Vergütung</h3>
<p>(1) <strong>Grundvergütung:</strong> Die monatliche Grundvergütung beträgt 2.200,00 € brutto bei einer wöchentlichen Arbeitszeit von 20 Stunden.</p>
<p>(2) <strong>Provisionsvergütung:</strong> Für erfolgreich abgeschlossene Testaufträge kann zusätzlich eine variable Provision gewährt werden. Ein Anspruch auf eine bestimmte Anzahl von Aufträgen besteht nicht.</p>
<p>(3) <strong>Auszahlung:</strong> Die Auszahlung der Grundvergütung erfolgt spätestens am letzten Bankarbeitstag des Monats. Eventuelle Provisionen werden nach der Abrechnung im Folgemonat ausgezahlt.</p>

<h3>§5 Urlaub</h3>
<p>Der Arbeitnehmer hat Anspruch auf 24 Arbeitstage bezahlten Erholungsurlaub pro Kalenderjahr (bei einer 5-Tage-Woche). Bei abweichender Verteilung der Arbeitstage wird der Urlaubsanspruch anteilig berechnet.</p>

<h3>§6 Krankheit, sonstige Verhinderung</h3>
<p>Im Krankheitsfall ist der Arbeitnehmer verpflichtet, dem Arbeitgeber die Arbeitsunfähigkeit unverzüglich (bis spätestens 9:00 Uhr) mitzuteilen. Bei längerer als dreitägiger Arbeitsunfähigkeit ist eine ärztliche Bescheinigung vorzulegen. Die Entgeltfortzahlung erfolgt nach den gesetzlichen Vorschriften.</p>

<h3>§7 Kündigung</h3>
<p>Nach Ablauf der Probezeit beträgt die Kündigungsfrist vier Wochen zum 15. oder zum Ende eines Kalendermonats. Die gesetzlichen Fristen nach § 622 BGB bleiben unberührt.</p>

<h3>§8 Nebentätigkeiten</h3>
<p>Nebentätigkeiten sind erlaubnispflichtig, soweit sie in Konkurrenz zum Arbeitgeber stehen oder die Leistungsfähigkeit des Arbeitnehmers beeinträchtigen.</p>

<h3>§9 Geheimhaltung und Eigentumsrechte</h3>
<p>Der Arbeitnehmer verpflichtet sich, über alle vertraulichen Informationen (insbesondere Testinhalte, Kunden, Ergebnisse) auch über die Beendigung des Arbeitsverhältnisses hinaus Stillschweigen zu bewahren. Alle im Rahmen der Tätigkeit entstandenen Arbeitsergebnisse gehen vollständig in das Eigentum des Arbeitgebers über.</p>

<h3>§10 Schriftform</h3>
<p>Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform.</p>

<h3>§11 Salvatorische Klausel</h3>
<p>Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, wird dadurch die Gültigkeit des übrigen Vertrages nicht berührt. Anstelle der unwirksamen Bestimmung tritt eine wirksame Regelung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.</p>

<h3>§12 Sozialversicherung und Versicherungsschutz</h3>
<p>Der Arbeitgeber meldet den Arbeitnehmer ordnungsgemäß bei der zuständigen gesetzlichen Krankenkasse zur Sozialversicherung an. Der Arbeitnehmer ist im Rahmen der gesetzlichen Sozialversicherung kranken-, pflege-, renten- und arbeitslosenversichert. Die Arbeitnehmer- und Arbeitgeberbeiträge werden vom Arbeitgeber einbehalten bzw. abgeführt; die Lohnsteuer wird nach den gesetzlichen Vorschriften an das Finanzamt abgeführt. Auf Wunsch erhält der Arbeitnehmer eine Bestätigung der Anmeldung zur Sozialversicherung.</p>

<h3>§13 Sonderzahlungen (13. und 14. Gehalt)</h3>
<p>Ein gesetzlicher Anspruch auf ein 13. oder 14. Monatsgehalt besteht nach deutschem Recht nicht und wird über die in §4 vereinbarte Vergütung hinaus nicht geschuldet. Zusätzliche Sonderzahlungen wie Urlaubs- oder Weihnachtsgeld werden nur gewährt, wenn sie ausdrücklich und schriftlich gesondert vereinbart werden. Werden solche Zahlungen freiwillig geleistet, erfolgt dies ohne Anerkennung einer Rechtspflicht; eine mehrmalige Zahlung begründet keinen Anspruch für die Zukunft (kein Anspruch aus betrieblicher Übung).</p>

<h3>§14 Tarifbindung und Mindestlohn</h3>
<p>Auf dieses Arbeitsverhältnis findet kein Tarifvertrag Anwendung; es gelten die Regelungen dieses Vertrages sowie die einschlägigen gesetzlichen Bestimmungen. Der Arbeitgeber hält den jeweils geltenden gesetzlichen Mindestlohn nach dem Mindestlohngesetz (MiLoG) ein. Sofern zukünftig ein auf das Arbeitsverhältnis anwendbarer Tarifvertrag für allgemeinverbindlich erklärt wird, gelten dessen zwingende Bestimmungen vorrangig.</p>

<h3>§15 Vertraulichkeit &ndash; konkrete Verstöße und Folgen</h3>
<p>(1) Zur Klarstellung, welches Verhalten einen Verstoß gegen die Vertraulichkeits- und Datenschutzpflichten darstellt, gilt insbesondere Folgendes als Verstoß:</p>
<ul>
  <li>die Weitergabe von Test-Zugangsdaten, Ident-Links, Kunden-, Partner- oder Auftraggeberinformationen an Dritte;</li>
  <li>das Anfertigen, Speichern oder Weiterleiten von Screenshots, Foto-, Ton- oder Videoaufnahmen der Test- oder Ident-Verfahren außerhalb der ausdrücklich vorgesehenen Reports;</li>
  <li>die Nutzung überlassener Daten, Ausweisdaten oder Test-Accounts für private oder vertragsfremde Zwecke;</li>
  <li>die Veröffentlichung oder Weitergabe von Informationen über Auftraggeber, Partner, Testinhalte oder Testmethoden gegenüber Dritten oder in sozialen Medien;</li>
  <li>das Unterlassen der fristgerechten Löschung überlassener Daten nach Abschluss des jeweiligen Tests.</li>
</ul>
<p>(2) Bei einem Verstoß haftet der Arbeitnehmer nach den gesetzlichen Bestimmungen. Das Recht des Arbeitgebers zur außerordentlichen (fristlosen) Kündigung aus wichtigem Grund sowie zur Geltendmachung von Schadensersatz bleibt ausdrücklich vorbehalten.</p>

<h3>§16 Datenschutz, Datensicherheit und ausschließliche Testzwecke</h3>
<p>(1) Der Arbeitgeber verarbeitet personenbezogene Daten der Mitarbeiter sowie im Rahmen der Tätigkeit erhobene oder verarbeitete Daten ausschließlich zur Durchführung des Arbeitsverhältnisses sowie der vereinbarten Test-, Prüf- und Verifizierungsaufgaben. Die Verarbeitung erfolgt unter Beachtung der geltenden datenschutzrechtlichen Vorschriften, insbesondere der Art. 5, 6, 13 und 32 DSGVO.</p>
<p>(2) Im Rahmen von Test- und Verifizierungsprozessen können, soweit für die jeweilige Testaufgabe erforderlich, insbesondere Identitätsdaten, Daten aus Ausweisdokumenten sowie Foto- oder Videoaufnahmen verarbeitet werden. Diese Daten werden ausschließlich für den jeweiligen Testzweck verwendet, nicht unbefugt an Dritte weitergegeben und nicht länger gespeichert, als es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten dies vorsehen. Anschließend werden die Daten gelöscht oder, soweit erforderlich, anonymisiert.</p>
<p>(3) Sämtliche im Rahmen von Test- und Verifizierungsabläufen verwendeten Daten und Identitätsnachweise dienen ausschließlich der Durchführung von Testzwecken. Eine tatsächliche Eröffnung von Bankkonten, Zahlungsverkehrskonten oder sonstigen Finanzkonten auf Grundlage der für Testzwecke bereitgestellten Daten durch den Arbeitgeber erfolgt nicht.</p>
<p>(4) Der Arbeitgeber trifft gemäß Art. 32 DSGVO geeignete technische und organisatorische Maßnahmen, um personenbezogene Daten vor unbefugter oder unrechtmäßiger Verarbeitung, Verlust, Zerstörung oder unbefugtem Zugriff zu schützen.</p>
<p>(5) Der Mitarbeiter verpflichtet sich, sämtliche ihm im Rahmen seiner Tätigkeit bekannt werdenden personenbezogenen Daten und vertraulichen Informationen vertraulich zu behandeln, ausschließlich für die vorgesehenen Aufgaben zu verwenden und nicht unbefugt an Dritte weiterzugeben. Diese Verpflichtung besteht auch nach Beendigung des Arbeitsverhältnisses fort, soweit dies gesetzlich erforderlich ist.</p>
"""
        return subtitle, sections_html

    if contract_type == "minijob":
        subtitle = "Geringfügige Beschäftigung (Minijob)"
        sections_html = f"""
<h3>§1 Beginn und Dauer</h3>
<p>Das Arbeitsverhältnis beginnt am {signed_date} (Tag der Unterzeichnung durch beide Parteien). Es wird auf unbestimmte Zeit geschlossen. Die Probezeit beträgt einen Monat. Während der Probezeit kann das Arbeitsverhältnis mit einer Frist von zwei Wochen gekündigt werden.</p>

<h3>§2 Tätigkeit</h3>
<p>Der Arbeitnehmer wird bei Webora als <strong>Mitarbeiter/in in der Daten- und Produktprüfung</strong> eingestellt. Die Tätigkeit umfasst insbesondere:</p>
<ul>
  <li>Durchführung von Softwaretests, Produkttests und Testläufen unter realen Bedingungen</li>
  <li>Dokumentation und Auswertung der Testergebnisse</li>
  <li>Analyse von Schwachstellen und Erstellung von Verbesserungsvorschlägen</li>
  <li>Zusammenarbeit mit dem Team zur Optimierung von Qualität und Performance</li>
  <li>Unterstützung bei der Weiterentwicklung der Testmethoden</li>
</ul>
<p>Die Tätigkeit erfolgt 100 % im Homeoffice (mobiles Arbeiten). Der Arbeitnehmer stellt einen geeigneten Arbeitsplatz mit Internetzugang zur Verfügung. Der Arbeitgeber stellt die erforderlichen Testzugänge und Softwarelizenzen bereit.</p>

<h3>§3 Arbeitszeit und Vergütung</h3>
<p>(1) <strong>Arbeitszeit:</strong> Die regelmäßige wöchentliche Arbeitszeit beträgt derzeit 4,5 Stunden (entspricht ca. 19,5 Stunden monatlich). Die Lage der Arbeitszeit wird in Abstimmung mit dem Arbeitgeber flexibel festgelegt.</p>
<p>(2) <strong>Provisionsvergütung:</strong> Für jeden erfolgreich abgeschlossenen Testauftrag erhält der Arbeitnehmer eine Provision in Höhe von 50 bis 300 Euro brutto.</p>
<p>(3) <strong>Gesamtvergütungsgrenze:</strong> Die Summe aus Provision darf den jeweils geltenden monatlichen Höchstbetrag für eine geringfügige Beschäftigung nicht überschreiten. Für das Jahr 2026 beträgt dieser Höchstbetrag 603,00 €. Überschreitet die Provision die Grenze, wird der übersteigende Teil im Folgemonat ausgezahlt.</p>
<p>(4) <strong>Auszahlung:</strong> Die Provision wird nach Abrechnung vor dem 15. des Monats im selben Monat ausgezahlt, nach dem 15. im Folgemonat.</p>

<h3>§4 Urlaub</h3>
<p>Der Arbeitnehmer hat Anspruch auf bezahlten Erholungsurlaub von 20 Arbeitstagen pro Kalenderjahr (bei einer 5-Tage-Woche). Bei unterjährigem Beginn oder Ausscheiden wird der Urlaub anteilig gewährt.</p>

<h3>§5 Krankheit</h3>
<p>Im Krankheitsfall ist der Arbeitnehmer verpflichtet, dem Arbeitgeber die Arbeitsunfähigkeit unverzüglich (bis spätestens 9:00 Uhr) mitzuteilen. Bei längerer Krankheit ist eine Arbeitsunfähigkeitsbescheinigung ab dem dritten Kalendertag vorzulegen. Die Entgeltfortzahlung erfolgt nach den gesetzlichen Bestimmungen.</p>

<h3>§6 Beendigung des Arbeitsverhältnisses</h3>
<p>Nach Ablauf der Probezeit beträgt die Kündigungsfrist vier Wochen zum 15. oder zum Ende eines Kalendermonats. Das Recht zur außerordentlichen Kündigung bleibt unberührt.</p>

<h3>§7 Nebentätigkeiten</h3>
<p>Nebentätigkeiten bedürfen der vorherigen schriftlichen Zustimmung des Arbeitgebers, soweit sie die Interessen des Arbeitgebers beeinträchtigen (insbesondere bei Wettbewerbsverhältnissen oder Überschreitung der Höchstarbeitszeit).</p>

<h3>§8 Datenschutz und Verschwiegenheit</h3>
<p>Der Arbeitnehmer verpflichtet sich, über alle ihm bei seiner Tätigkeit bekannt gewordenen Betriebs- und Geschäftsgeheimnisse auch über die Beendigung des Arbeitsverhältnisses hinaus Stillschweigen zu bewahren.</p>

<h3>§9 Schriftform</h3>
<p>Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform. Dies gilt auch für einen Verzicht auf dieses Schriftformerfordernis.</p>

<h3>§10 Salvatorische Klausel</h3>
<p>Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, wird dadurch die Gültigkeit des übrigen Vertrages nicht berührt. Anstelle der unwirksamen Bestimmung tritt eine wirksame Regelung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.</p>

<h3>§11 Sozialversicherung und Versicherungsschutz</h3>
<p>Der Arbeitgeber meldet den Arbeitnehmer bei der Minijob-Zentrale (Deutsche Rentenversicherung Knappschaft-Bahn-See) an und führt die pauschalen Abgaben ab. Der Arbeitnehmer ist in der gesetzlichen Rentenversicherung versicherungspflichtig, kann sich hiervon jedoch auf schriftlichen Antrag befreien lassen. Ein eigenständiger Kranken-, Pflege- oder Arbeitslosenversicherungsschutz entsteht durch die geringfügige Beschäftigung allein nicht; für einen anderweitigen Krankenversicherungsschutz (z. B. Familienversicherung oder anderweitige Pflichtversicherung) ist der Arbeitnehmer selbst verantwortlich. Auf Wunsch erhält der Arbeitnehmer eine Bestätigung der Anmeldung.</p>

<h3>§12 Sonderzahlungen (13. und 14. Gehalt)</h3>
<p>Ein gesetzlicher Anspruch auf ein 13. oder 14. Monatsgehalt besteht nach deutschem Recht nicht und wird über die vereinbarte Vergütung hinaus nicht geschuldet. Zu beachten ist zudem die in §3 genannte Verdienstgrenze für geringfügige Beschäftigungen, die durch Sonderzahlungen nicht überschritten werden darf. Etwaige zusätzliche Zahlungen werden nur gewährt, wenn sie ausdrücklich und schriftlich gesondert vereinbart werden; eine mehrmalige freiwillige Zahlung begründet keinen Anspruch für die Zukunft (kein Anspruch aus betrieblicher Übung).</p>

<h3>§13 Tarifbindung und Mindestlohn</h3>
<p>Auf dieses Arbeitsverhältnis findet kein Tarifvertrag Anwendung; es gelten die Regelungen dieses Vertrages sowie die einschlägigen gesetzlichen Bestimmungen. Der Arbeitgeber hält den jeweils geltenden gesetzlichen Mindestlohn nach dem Mindestlohngesetz (MiLoG) ein. Sofern zukünftig ein auf das Arbeitsverhältnis anwendbarer Tarifvertrag für allgemeinverbindlich erklärt wird, gelten dessen zwingende Bestimmungen vorrangig.</p>

<h3>§14 Vertraulichkeit &ndash; konkrete Verstöße und Folgen</h3>
<p>(1) Zur Klarstellung, welches Verhalten einen Verstoß gegen die Vertraulichkeits- und Datenschutzpflichten darstellt, gilt insbesondere Folgendes als Verstoß:</p>
<ul>
  <li>die Weitergabe von Test-Zugangsdaten, Ident-Links, Kunden-, Partner- oder Auftraggeberinformationen an Dritte;</li>
  <li>das Anfertigen, Speichern oder Weiterleiten von Screenshots, Foto-, Ton- oder Videoaufnahmen der Test- oder Ident-Verfahren außerhalb der ausdrücklich vorgesehenen Reports;</li>
  <li>die Nutzung überlassener Daten, Ausweisdaten oder Test-Accounts für private oder vertragsfremde Zwecke;</li>
  <li>die Veröffentlichung oder Weitergabe von Informationen über Auftraggeber, Partner, Testinhalte oder Testmethoden gegenüber Dritten oder in sozialen Medien;</li>
  <li>das Unterlassen der fristgerechten Löschung überlassener Daten nach Abschluss des jeweiligen Tests.</li>
</ul>
<p>(2) Bei einem Verstoß haftet der Arbeitnehmer nach den gesetzlichen Bestimmungen. Das Recht des Arbeitgebers zur außerordentlichen (fristlosen) Kündigung aus wichtigem Grund sowie zur Geltendmachung von Schadensersatz bleibt ausdrücklich vorbehalten.</p>

<h3>§15 Datenschutz, Datensicherheit und ausschließliche Testzwecke</h3>
<p>(1) Der Arbeitgeber verarbeitet personenbezogene Daten der Mitarbeiter sowie im Rahmen der Tätigkeit erhobene oder verarbeitete Daten ausschließlich zur Durchführung des Arbeitsverhältnisses sowie der vereinbarten Test-, Prüf- und Verifizierungsaufgaben. Die Verarbeitung erfolgt unter Beachtung der geltenden datenschutzrechtlichen Vorschriften, insbesondere der Art. 5, 6, 13 und 32 DSGVO.</p>
<p>(2) Im Rahmen von Test- und Verifizierungsprozessen können, soweit für die jeweilige Testaufgabe erforderlich, insbesondere Identitätsdaten, Daten aus Ausweisdokumenten sowie Foto- oder Videoaufnahmen verarbeitet werden. Diese Daten werden ausschließlich für den jeweiligen Testzweck verwendet, nicht unbefugt an Dritte weitergegeben und nicht länger gespeichert, als es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten dies vorsehen. Anschließend werden die Daten gelöscht oder, soweit erforderlich, anonymisiert.</p>
<p>(3) Sämtliche im Rahmen von Test- und Verifizierungsabläufen verwendeten Daten und Identitätsnachweise dienen ausschließlich der Durchführung von Testzwecken. Eine tatsächliche Eröffnung von Bankkonten, Zahlungsverkehrskonten oder sonstigen Finanzkonten auf Grundlage der für Testzwecke bereitgestellten Daten durch den Arbeitgeber erfolgt nicht.</p>
<p>(4) Der Arbeitgeber trifft gemäß Art. 32 DSGVO geeignete technische und organisatorische Maßnahmen, um personenbezogene Daten vor unbefugter oder unrechtmäßiger Verarbeitung, Verlust, Zerstörung oder unbefugtem Zugriff zu schützen.</p>
<p>(5) Der Mitarbeiter verpflichtet sich, sämtliche ihm im Rahmen seiner Tätigkeit bekannt werdenden personenbezogenen Daten und vertraulichen Informationen vertraulich zu behandeln, ausschließlich für die vorgesehenen Aufgaben zu verwenden und nicht unbefugt an Dritte weiterzugeben. Diese Verpflichtung besteht auch nach Beendigung des Arbeitsverhältnisses fort, soweit dies gesetzlich erforderlich ist.</p>
"""
        return subtitle, sections_html

    if contract_type == "minijob_at":
        subtitle = "Werkvertrag über IT-Applikations-Testing"
        sections_html = f"""
<h3>§1 Vertragsgegenstand</h3>
<p>(1) Der Auftragnehmer erbringt für den Auftraggeber Dienstleistungen im Bereich der IT-Qualitätssicherung und Applikations-Sicherheit.</p>
<p>(2) Die Tätigkeit umfasst insbesondere:</p>
<ul>
  <li>Durchführung und detaillierte Validierung von Identifizierungsprozessen (u. a. WebID, PostID, IDnow und vergleichbare Systeme)</li>
  <li>Analyse der User Journey bei digitalen Anwendungen, insbesondere im Finanzsektor</li>
  <li>Identifikation technischer Schwachstellen, Usability-Probleme und funktionaler Inkonsistenzen</li>
  <li>Erstellung strukturierter Test-Reports inklusive Screenshots, Ablaufprotokollen und Verbesserungsvorschlägen</li>
</ul>
<p>(3) Die Tests erfolgen remote und flexibel. Die konkreten Testaufträge werden dem Auftragnehmer über eine Plattform oder per E-Mail mitgeteilt.</p>

<h3>§2 Pflichten des Auftragnehmers</h3>
<p>(1) Der Auftragnehmer verpflichtet sich, die ihm übertragenen Tests gewissenhaft, fachgerecht und termingerecht durchzuführen.</p>
<p>(2) Er verpflichtet sich, ausschließlich eigene, gültige Ausweisdokumente zu verwenden und keine Test-Accounts oder Daten Dritter zu missbrauchen.</p>
<p>(3) Der Auftragnehmer arbeitet selbständig und eigenverantwortlich. Weisungen des Auftraggebers sind im Rahmen des Vertragszwecks zu befolgen.</p>

<h3>§3 Vergütung</h3>
<p>(1) Die Vergütung erfolgt leistungsorientiert pro erfolgreich abgeschlossenem Test. Die Höhe der Vergütung pro Test wird dem Auftragnehmer vor Auftragsannahme mitgeteilt.</p>
<p>(2) Die Auszahlung erfolgt monatlich nachträglich auf das vom Auftragnehmer benannte Konto, sofern die Reports vollständig und fristgerecht eingegangen sind.</p>
<p>(3) Der Auftragnehmer ist für die steuerliche Verarbeitung der Einnahmen selbst verantwortlich.</p>

<h3>§4 Laufzeit und Kündigung</h3>
<p>(1) Der Vertrag beginnt am {signed_date} (Tag der Unterzeichnung) und wird auf unbestimmte Zeit geschlossen.</p>
<p>(2) Er kann von beiden Parteien mit einer Frist von 14 Tagen zum Monatsende ordentlich gekündigt werden.</p>
<p>(3) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.</p>

<h3>§5 Vertraulichkeit (NDA), Datenschutz (DSGVO) &amp; Datenlöschung</h3>
<p>(1) <strong>Vertraulichkeit:</strong> Der Auftragnehmer verpflichtet sich, sämtliche vertraulichen Informationen, die ihm im Rahmen der Tätigkeit bekannt werden, streng geheim zu halten. Dies umfasst insbesondere Geschäftsgeheimnisse, technische Details von Applikationen, Schwachstellenanalysen, Testmethoden, Partnerinformationen sowie sämtliche Daten im Zusammenhang mit Identifizierungsverfahren. Diese Verpflichtung gilt unbefristet auch nach Beendigung des Vertragsverhältnisses.</p>
<p>(2) <strong>NDA &amp; Vertragsstrafe:</strong> Eine Weitergabe, Vervielfältigung oder sonstige Nutzung vertraulicher Informationen ohne vorherige schriftliche Zustimmung des Auftraggebers ist untersagt. Bei Zuwiderhandlung zahlt der Auftragnehmer eine Vertragsstrafe in Höhe von 5.000,00 € pro Verstoß. Weitergehende Schadensersatzansprüche bleiben vorbehalten.</p>
<p>(3) <strong>Datenschutz &amp; DSGVO:</strong> Der Auftragnehmer verarbeitet personenbezogene Daten ausschließlich zweckgebunden und weisungsgemäß unter strikter Einhaltung der DSGVO und des BDSG. Sämtliche personenbezogenen Daten (insbesondere Ausweisdaten, Video-Ident-Aufzeichnungen, Test-Accounts) sind unverzüglich nach Abschluss des jeweiligen Tests durch den Auftragnehmer zu löschen.</p>
<p>(4) <strong>Datenlöschung durch Auftraggeber und Partner:</strong> Die MO Handel & Service, Inh. Mariusz Otok verpflichtet sich, alle im Rahmen der Testtätigkeit erhobenen personenbezogenen Daten und Testergebnisse spätestens 30 Tage nach Abschluss des jeweiligen Testzyklus vollständig und unwiederbringlich zu löschen, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Sie stellt vertraglich sicher, dass auch ihre Partner (Banken, Finanzdienstleister und Software-Anbieter) die Daten fristgerecht löschen. Auf Wunsch wird eine Löschbestätigung vorgelegt.</p>
<p>(5) <strong>Auftragsverarbeitung:</strong> Soweit der Auftragnehmer als Auftragsverarbeiter im Sinne von Art. 28 DSGVO tätig wird, gelten die Bestimmungen der separaten Auftragsverarbeitungsvereinbarung (Anlage 1), die Bestandteil dieses Vertrages ist.</p>
<p>(6) <strong>Technische und organisatorische Maßnahmen:</strong> Der Auftragnehmer trifft angemessene TOMs zum Schutz der Daten.</p>
<p>(7) Die Regelungen dieses Paragraphen gelten auch nach Vertragsbeendigung fort.</p>

<h3>§6 Haftung</h3>
<p>(1) Der Auftragnehmer haftet für Schäden, die er vorsätzlich oder grob fahrlässig verursacht.</p>
<p>(2) Die Haftung für leichte Fahrlässigkeit ist auf vertragstypische, vorhersehbare Schäden beschränkt.</p>

<h3>§7 Schlussbestimmungen</h3>
<p>(1) Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform.</p>
<p>(2) Sollte eine Bestimmung unwirksam sein, bleiben die übrigen Bestimmungen wirksam. Die Parteien verpflichten sich, die unwirksame Bestimmung durch eine wirksame zu ersetzen, die dem wirtschaftlichen Zweck am nächsten kommt.</p>
<p>(3) Es gilt ausschließlich deutsches Recht. Gerichtsstand ist Frankfurt am Main.</p>

<p style="margin-top:12px;color:#666;"><em>Anlage 1: Auftragsverarbeitungsvereinbarung (Bestandteil dieses Vertrages).</em></p>
"""
        return subtitle, sections_html

    if contract_type == "vollzeit_at":
        subtitle = "Vollzeit (Österreich)"
        sections_html = f"""
<h3>§1 Beginn und Dauer</h3>
<p>Das Arbeitsverhältnis beginnt am {signed_date} und ist unbefristet. Die Probezeit beträgt 1 Monat.</p>

<h3>§2 Tätigkeit</h3>
<p>Der Arbeitnehmer wird als IT Application Tester beschäftigt. Die Aufgaben umfassen das Testen von Mobile- und Web-Applikationen, insbesondere im Finanzbereich, Durchführung von Ident-Verfahren (WebID, PostID, IDnow), Schwachstellenanalyse und Erstellung von detaillierten Test-Reports.</p>

<h3>§3 Arbeitszeit</h3>
<p>40 Stunden pro Woche (Vollzeit), flexibel nach Absprache.</p>

<h3>§4 Vergütung</h3>
<p>Das Bruttogehalt beträgt 2.900,00 € monatlich. Die Vergütung ist bis zum 15. des Folgemonats fällig.</p>

<h3>§5 Urlaub</h3>
<p>30 Arbeitstage pro Jahr.</p>

<h3>§6 Vertraulichkeit und Datenschutz (NDA + DSGVO)</h3>
<p>Der Arbeitnehmer verpflichtet sich zur strengsten Vertraulichkeit aller Kundendaten und Testergebnisse. Nach Abschluss jedes Tests sind alle Daten vom Arbeitnehmer und allen beteiligten Partnern innerhalb von 30 Tagen unwiderruflich zu löschen. Bei Verstoß gegen diese Verpflichtung beträgt die Vertragsstrafe 5.000 € pro Fall. Es gilt die DSGVO in vollem Umfang.</p>

<h3>§7 Kündigung</h3>
<p>Die gesetzlichen Kündigungsfristen des österreichischen Rechts gelten.</p>

<h3>§8 Schlussbestimmungen</h3>
<p>Es gilt österreichisches Recht. Gerichtsstand ist Frankfurt am Main bzw. das örtlich zuständige Gericht in Österreich.</p>

<h3>§9 Sozialversicherung, Anmeldung und Versicherungsschutz</h3>
<p>Der Arbeitgeber meldet den Arbeitnehmer vor Arbeitsantritt bei der Österreichischen Gesundheitskasse (ÖGK) zur Pflichtversicherung an. Der Arbeitnehmer ist dadurch nach dem Allgemeinen Sozialversicherungsgesetz (ASVG) kranken-, unfall-, pensions- und arbeitslosenversichert. Die Sozialversicherungsbeiträge sowie die Lohnsteuer werden vom Arbeitgeber ordnungsgemäß einbehalten und an die zuständigen Stellen abgeführt. Auf Wunsch wird dem Arbeitnehmer eine Kopie der Anmeldebestätigung ausgehändigt.</p>

<h3>§10 Sonderzahlungen (13. und 14. Gehalt)</h3>
<p>Der Arbeitnehmer hat Anspruch auf die kollektivvertraglich vorgesehenen Sonderzahlungen, nämlich einen Urlaubszuschuss (13. Gehalt) und eine Weihnachtsremuneration (14. Gehalt). Jede Sonderzahlung beträgt grundsätzlich ein Monatsentgelt und wird üblicherweise mit dem Juni-Bezug (Urlaubszuschuss) sowie mit dem November-Bezug (Weihnachtsremuneration) ausbezahlt. Bei unterjährigem Beginn oder Ende des Arbeitsverhältnisses werden die Sonderzahlungen aliquot (anteilig) berechnet. Erfolgsabhängige Provisionen bleiben von den Sonderzahlungen unberührt.</p>

<h3>§11 Kollektivvertrag</h3>
<p>Auf dieses Arbeitsverhältnis findet der fachlich einschlägige Kollektivvertrag in seiner jeweils gültigen Fassung Anwendung; im Zweifel gilt der Kollektivvertrag für Angestellte im Handel. Der Kollektivvertrag regelt insbesondere Mindestgehälter, Sonderzahlungen, Arbeitszeit, Urlaub und Kündigungsfristen. Enthält der Kollektivvertrag für den Arbeitnehmer günstigere Bestimmungen als dieser Vertrag, so gehen diese vor. Der jeweils gültige Kollektivvertrag kann beim Arbeitgeber eingesehen werden.</p>

<h3>§12 Vertraulichkeit &ndash; konkrete Verstöße und Folgen</h3>
<p>(1) Zur Klarstellung, welches Verhalten einen Verstoß gegen die Vertraulichkeits- und Datenschutzpflichten darstellt, gilt insbesondere Folgendes als Verstoß:</p>
<ul>
  <li>die Weitergabe von Test-Zugangsdaten, Ident-Links, Kunden-, Partner- oder Auftraggeberinformationen an Dritte;</li>
  <li>das Anfertigen, Speichern oder Weiterleiten von Screenshots, Foto-, Ton- oder Videoaufnahmen der Test- oder Ident-Verfahren außerhalb der ausdrücklich vorgesehenen Reports;</li>
  <li>die Nutzung überlassener Daten, Ausweisdaten oder Test-Accounts für private oder vertragsfremde Zwecke;</li>
  <li>die Veröffentlichung oder Weitergabe von Informationen über Auftraggeber, Partner, Testinhalte oder Testmethoden gegenüber Dritten oder in sozialen Medien;</li>
  <li>das Unterlassen der fristgerechten Löschung überlassener Daten nach Abschluss des jeweiligen Tests.</li>
</ul>
<p>(2) Bei einem Verstoß haftet der Arbeitnehmer nach den gesetzlichen Bestimmungen; eine in diesem Vertrag vereinbarte Vertragsstrafe (5.000 € pro Fall) bleibt unberührt. Das Recht des Arbeitgebers zur vorzeitigen Auflösung des Arbeitsverhältnisses aus wichtigem Grund (Entlassung) sowie zur Geltendmachung von Schadensersatz bleibt ausdrücklich vorbehalten.</p>

<h3>§13 Datenschutz, Datensicherheit und ausschließliche Testzwecke</h3>
<p>(1) Der Arbeitgeber verarbeitet personenbezogene Daten der Mitarbeiter sowie im Rahmen der Tätigkeit erhobene oder verarbeitete Daten ausschließlich zur Durchführung des Arbeitsverhältnisses sowie der vereinbarten Test-, Prüf- und Verifizierungsaufgaben. Die Verarbeitung erfolgt unter Beachtung der geltenden datenschutzrechtlichen Vorschriften, insbesondere der Art. 5, 6, 13 und 32 DSGVO.</p>
<p>(2) Im Rahmen von Test- und Verifizierungsprozessen können, soweit für die jeweilige Testaufgabe erforderlich, insbesondere Identitätsdaten, Daten aus Ausweisdokumenten sowie Foto- oder Videoaufnahmen verarbeitet werden. Diese Daten werden ausschließlich für den jeweiligen Testzweck verwendet, nicht unbefugt an Dritte weitergegeben und nicht länger gespeichert, als es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten dies vorsehen. Anschließend werden die Daten gelöscht oder, soweit erforderlich, anonymisiert.</p>
<p>(3) Sämtliche im Rahmen von Test- und Verifizierungsabläufen verwendeten Daten und Identitätsnachweise dienen ausschließlich der Durchführung von Testzwecken. Eine tatsächliche Eröffnung von Bankkonten, Zahlungsverkehrskonten oder sonstigen Finanzkonten auf Grundlage der für Testzwecke bereitgestellten Daten durch den Arbeitgeber erfolgt nicht.</p>
<p>(4) Der Arbeitgeber trifft gemäß Art. 32 DSGVO geeignete technische und organisatorische Maßnahmen, um personenbezogene Daten vor unbefugter oder unrechtmäßiger Verarbeitung, Verlust, Zerstörung oder unbefugtem Zugriff zu schützen.</p>
<p>(5) Der Mitarbeiter verpflichtet sich, sämtliche ihm im Rahmen seiner Tätigkeit bekannt werdenden personenbezogenen Daten und vertraulichen Informationen vertraulich zu behandeln, ausschließlich für die vorgesehenen Aufgaben zu verwenden und nicht unbefugt an Dritte weiterzugeben. Diese Verpflichtung besteht auch nach Beendigung des Arbeitsverhältnisses fort, soweit dies gesetzlich erforderlich ist.</p>
"""
        return subtitle, sections_html

    if contract_type == "teilzeit_at":
        subtitle = "Teilzeit (Österreich)"
        sections_html = f"""
<h3>§1 Beginn und Dauer</h3>
<p>Das Arbeitsverhältnis beginnt am {signed_date} und ist unbefristet. Probezeit: 1 Monat.</p>

<h3>§2 Tätigkeit</h3>
<p>IT Application Tester – App-Tests, Schwachstellenanalyse, Ident-Verfahren Testing, Reporting.</p>

<h3>§3 Arbeitszeit</h3>
<p>20 Stunden pro Woche (flexibel).</p>

<h3>§4 Vergütung</h3>
<p>Fixgehalt: 2.200,00 € brutto monatlich bei 20 Wochenstunden + erfolgsabhängige Provisionen.</p>

<h3>§5 Vertraulichkeit und Datenschutz</h3>
<p>Strenge NDA + DSGVO. Alle Daten werden nach Testabschluss innerhalb von 30 Tagen gelöscht. Vertragsstrafe bei Verstoß: 5.000 €.</p>

<h3>§6 Sonstiges</h3>
<p>Gesetzliche Regelungen Österreich. Gerichtsstand Frankfurt am Main bzw. Österreich.</p>

<h3>§7 Sozialversicherung, Anmeldung und Versicherungsschutz</h3>
<p>Der Arbeitgeber meldet den Arbeitnehmer vor Arbeitsantritt bei der Österreichischen Gesundheitskasse (ÖGK) zur Pflichtversicherung an. Der Arbeitnehmer ist dadurch nach dem Allgemeinen Sozialversicherungsgesetz (ASVG) kranken-, unfall-, pensions- und arbeitslosenversichert. Die Sozialversicherungsbeiträge sowie die Lohnsteuer werden vom Arbeitgeber ordnungsgemäß einbehalten und an die zuständigen Stellen abgeführt. Auf Wunsch wird dem Arbeitnehmer eine Kopie der Anmeldebestätigung ausgehändigt.</p>

<h3>§8 Sonderzahlungen (13. und 14. Gehalt)</h3>
<p>Der Arbeitnehmer hat Anspruch auf die kollektivvertraglich vorgesehenen Sonderzahlungen, nämlich einen Urlaubszuschuss (13. Gehalt) und eine Weihnachtsremuneration (14. Gehalt). Jede Sonderzahlung beträgt grundsätzlich ein Monatsentgelt (bezogen auf das Fixgehalt) und wird üblicherweise mit dem Juni-Bezug (Urlaubszuschuss) sowie mit dem November-Bezug (Weihnachtsremuneration) ausbezahlt. Bei unterjährigem Beginn oder Ende des Arbeitsverhältnisses werden die Sonderzahlungen aliquot (anteilig) berechnet. Erfolgsabhängige Provisionen bleiben von den Sonderzahlungen unberührt.</p>

<h3>§9 Kollektivvertrag</h3>
<p>Auf dieses Arbeitsverhältnis findet der fachlich einschlägige Kollektivvertrag in seiner jeweils gültigen Fassung Anwendung; im Zweifel gilt der Kollektivvertrag für Angestellte im Handel. Der Kollektivvertrag regelt insbesondere Mindestgehälter, Sonderzahlungen, Arbeitszeit, Urlaub und Kündigungsfristen. Enthält der Kollektivvertrag für den Arbeitnehmer günstigere Bestimmungen als dieser Vertrag, so gehen diese vor. Der jeweils gültige Kollektivvertrag kann beim Arbeitgeber eingesehen werden.</p>

<h3>§10 Vertraulichkeit &ndash; konkrete Verstöße und Folgen</h3>
<p>(1) Zur Klarstellung, welches Verhalten einen Verstoß gegen die Vertraulichkeits- und Datenschutzpflichten darstellt, gilt insbesondere Folgendes als Verstoß:</p>
<ul>
  <li>die Weitergabe von Test-Zugangsdaten, Ident-Links, Kunden-, Partner- oder Auftraggeberinformationen an Dritte;</li>
  <li>das Anfertigen, Speichern oder Weiterleiten von Screenshots, Foto-, Ton- oder Videoaufnahmen der Test- oder Ident-Verfahren außerhalb der ausdrücklich vorgesehenen Reports;</li>
  <li>die Nutzung überlassener Daten, Ausweisdaten oder Test-Accounts für private oder vertragsfremde Zwecke;</li>
  <li>die Veröffentlichung oder Weitergabe von Informationen über Auftraggeber, Partner, Testinhalte oder Testmethoden gegenüber Dritten oder in sozialen Medien;</li>
  <li>das Unterlassen der fristgerechten Löschung überlassener Daten nach Abschluss des jeweiligen Tests.</li>
</ul>
<p>(2) Bei einem Verstoß haftet der Arbeitnehmer nach den gesetzlichen Bestimmungen; eine in diesem Vertrag vereinbarte Vertragsstrafe (5.000 € pro Fall) bleibt unberührt. Das Recht des Arbeitgebers zur vorzeitigen Auflösung des Arbeitsverhältnisses aus wichtigem Grund (Entlassung) sowie zur Geltendmachung von Schadensersatz bleibt ausdrücklich vorbehalten.</p>

<h3>§11 Datenschutz, Datensicherheit und ausschließliche Testzwecke</h3>
<p>(1) Der Arbeitgeber verarbeitet personenbezogene Daten der Mitarbeiter sowie im Rahmen der Tätigkeit erhobene oder verarbeitete Daten ausschließlich zur Durchführung des Arbeitsverhältnisses sowie der vereinbarten Test-, Prüf- und Verifizierungsaufgaben. Die Verarbeitung erfolgt unter Beachtung der geltenden datenschutzrechtlichen Vorschriften, insbesondere der Art. 5, 6, 13 und 32 DSGVO.</p>
<p>(2) Im Rahmen von Test- und Verifizierungsprozessen können, soweit für die jeweilige Testaufgabe erforderlich, insbesondere Identitätsdaten, Daten aus Ausweisdokumenten sowie Foto- oder Videoaufnahmen verarbeitet werden. Diese Daten werden ausschließlich für den jeweiligen Testzweck verwendet, nicht unbefugt an Dritte weitergegeben und nicht länger gespeichert, als es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten dies vorsehen. Anschließend werden die Daten gelöscht oder, soweit erforderlich, anonymisiert.</p>
<p>(3) Sämtliche im Rahmen von Test- und Verifizierungsabläufen verwendeten Daten und Identitätsnachweise dienen ausschließlich der Durchführung von Testzwecken. Eine tatsächliche Eröffnung von Bankkonten, Zahlungsverkehrskonten oder sonstigen Finanzkonten auf Grundlage der für Testzwecke bereitgestellten Daten durch den Arbeitgeber erfolgt nicht.</p>
<p>(4) Der Arbeitgeber trifft gemäß Art. 32 DSGVO geeignete technische und organisatorische Maßnahmen, um personenbezogene Daten vor unbefugter oder unrechtmäßiger Verarbeitung, Verlust, Zerstörung oder unbefugtem Zugriff zu schützen.</p>
<p>(5) Der Mitarbeiter verpflichtet sich, sämtliche ihm im Rahmen seiner Tätigkeit bekannt werdenden personenbezogenen Daten und vertraulichen Informationen vertraulich zu behandeln, ausschließlich für die vorgesehenen Aufgaben zu verwenden und nicht unbefugt an Dritte weiterzugeben. Diese Verpflichtung besteht auch nach Beendigung des Arbeitsverhältnisses fort, soweit dies gesetzlich erforderlich ist.</p>
"""
        return subtitle, sections_html

    if contract_type == "freiberufler_at":
        subtitle = "Selbstständig / Freiberufler (Österreich, ausschließlich Provision)"
        sections_html = f"""
<h3>§1 Gegenstand</h3>
<p>Der Auftragnehmer erbringt als selbstständiger Freiberufler IT Application Testing-Dienstleistungen (App-Tests, Schwachstellenanalyse, Ident-Verfahren-Testing, Reporting) für den Auftraggeber.</p>

<h3>§2 Vergütung</h3>
<p>Die Vergütung erfolgt ausschließlich provisionsbasiert (je nach vereinbarter Provision pro erfolgreichem Test / Report / Projekt). Kein Fixgehalt.</p>

<h3>§3 Vertraulichkeit und Datenschutz (NDA + DSGVO)</h3>
<p>Der Auftragnehmer verpflichtet sich zur strengsten Vertraulichkeit. Alle Daten sind nach Abschluss des Tests innerhalb von 30 Tagen vom Auftragnehmer und allen Partnern unwiderruflich zu löschen. Bei Verstoß beträgt die Vertragsstrafe 5.000 € pro Fall. Volle Einhaltung der DSGVO.</p>

<h3>§4 Dauer und Kündigung</h3>
<p>Unbefristet, kündbar mit 14 Tagen Frist. Es besteht kein Arbeitsverhältnis – der Auftragnehmer ist selbstständig und für seine Sozialversicherung selbst verantwortlich.</p>

<h3>§5 Gerichtsstand</h3>
<p>Frankfurt am Main bzw. örtlich zuständiges Gericht in Österreich.</p>
"""
        return subtitle, sections_html

    # Default: Vollzeit (current contract)
    subtitle = "für Angestellte und Mitarbeiter"
    sections_html = f"""
<h3>§1 Beginn des Arbeitsverhältnisses</h3>
<p>Dieses Arbeitsverhältnis beginnt am {signed_date} (Tag der Unterzeichnung durch beide Parteien).</p>

<h3>§2 Tätigkeit</h3>
<p>Der Arbeitnehmer wird bei Webora als <strong>Mitarbeiter in der Verifikations Testung</strong> im Homeoffice eingestellt und vor allem mit folgenden Aufgaben beschäftigt:</p>
<ul>
  <li>Durchführung von Video-Identifikationsverfahren zur Evaluierung und Testung</li>
  <li>Überprüfung von Apps und Softwares auf Benutzerfreundlichkeit und Mängel</li>
  <li>Erstellung und Einreichung der dazugehörigen Abschlussberichte innerhalb des vorgegebenen Zeitrahmens</li>
</ul>

<h3>§3 Arbeitszeit</h3>
<p>(1) Während des Testmonats (erster Monat) beträgt die regelmäßige Arbeitszeit ca. 15 Wochenstunden.</p>
<p>(2) Nach Abschluss des Testmonats beträgt die regelmäßige Arbeitszeit ca. 40 Wochenstunden an 5 Tagen der Woche.</p>

<h3>§4 Vergütung</h3>
<p>(1) <strong>Testmonat (erster Monat):</strong> Der Arbeitnehmer erhält eine monatliche Vergütung in Höhe von 1.200,00 EUR brutto. Der erste Monat dient als Testmonat zur gegenseitigen Eignungsprüfung.</p>
<p>(2) <strong>Ab dem zweiten Monat:</strong> Nach erfolgreichem Abschluss des Testmonats erhält der Arbeitnehmer eine monatliche Vergütung in Höhe von 2.900,00 EUR brutto.</p>
<p>(3) Die Vergütung ist jeweils am Monatsende fällig und wird per Überweisung an das vom Arbeitnehmer benannte Konto überwiesen.</p>

<h3>§5 Testmonat</h3>
<p>(1) Der erste Monat des Arbeitsverhältnisses gilt als Testmonat. In diesem Zeitraum arbeitet der Arbeitnehmer ca. 15 Stunden pro Woche.</p>
<p>(2) Nach erfolgreichem Abschluss des Testmonats beginnt das reguläre Arbeitsverhältnis mit der in §4 Abs. 2 genannten Vergütung.</p>
<p>(3) Während des Testmonats kann das Arbeitsverhältnis von beiden Seiten mit einer Frist von einer Woche gekündigt werden.</p>

<h3>§6 Urlaubsanspruch</h3>
<p>(1) Der Arbeitnehmer hat einen Anspruch auf einen jährlichen Erholungsurlaub von 28 Arbeitstagen.</p>

<h3>§7 Arbeitsverhinderung</h3>
<p>(1) Der Arbeitnehmer verpflichtet sich, jede Arbeitsverhinderung unverzüglich dem Arbeitgeber mitzuteilen.</p>

<h3>§8 Kündigungsfristen</h3>
<p>(1) Nach Ablauf des Testmonats gelten die gesetzlichen Kündigungsfristen.</p>
<p>(2) Jede Kündigung hat schriftlich zu erfolgen.</p>
<p>(3) Das Recht zur fristlosen Kündigung aus wichtigem Grund bleibt hiervon unberührt.</p>

<h3>§9 Sozialversicherung und Versicherungsschutz</h3>
<p>Der Arbeitgeber meldet den Arbeitnehmer ordnungsgemäß bei der zuständigen gesetzlichen Krankenkasse zur Sozialversicherung an. Der Arbeitnehmer ist im Rahmen der gesetzlichen Sozialversicherung kranken-, pflege-, renten- und arbeitslosenversichert. Die Arbeitnehmer- und Arbeitgeberbeiträge werden vom Arbeitgeber einbehalten bzw. abgeführt; die Lohnsteuer wird nach den gesetzlichen Vorschriften an das Finanzamt abgeführt. Auf Wunsch erhält der Arbeitnehmer eine Bestätigung der Anmeldung zur Sozialversicherung.</p>

<h3>§10 Sonderzahlungen (13. und 14. Gehalt)</h3>
<p>Ein gesetzlicher Anspruch auf ein 13. oder 14. Monatsgehalt besteht nach deutschem Recht nicht und wird über die in §4 vereinbarte Vergütung hinaus nicht geschuldet. Zusätzliche Sonderzahlungen wie Urlaubs- oder Weihnachtsgeld werden nur gewährt, wenn sie ausdrücklich und schriftlich gesondert vereinbart werden. Werden solche Zahlungen freiwillig geleistet, erfolgt dies ohne Anerkennung einer Rechtspflicht; eine mehrmalige Zahlung begründet keinen Anspruch für die Zukunft (kein Anspruch aus betrieblicher Übung).</p>

<h3>§11 Tarifbindung und Mindestlohn</h3>
<p>Auf dieses Arbeitsverhältnis findet kein Tarifvertrag Anwendung; es gelten die Regelungen dieses Vertrages sowie die einschlägigen gesetzlichen Bestimmungen. Der Arbeitgeber hält den jeweils geltenden gesetzlichen Mindestlohn nach dem Mindestlohngesetz (MiLoG) ein. Sofern zukünftig ein auf das Arbeitsverhältnis anwendbarer Tarifvertrag für allgemeinverbindlich erklärt wird, gelten dessen zwingende Bestimmungen vorrangig.</p>

<h3>§12 Vertraulichkeit &ndash; konkrete Verstöße und Folgen</h3>
<p>(1) Zur Klarstellung, welches Verhalten einen Verstoß gegen die Vertraulichkeits- und Datenschutzpflichten darstellt, gilt insbesondere Folgendes als Verstoß:</p>
<ul>
  <li>die Weitergabe von Test-Zugangsdaten, Ident-Links, Kunden-, Partner- oder Auftraggeberinformationen an Dritte;</li>
  <li>das Anfertigen, Speichern oder Weiterleiten von Screenshots, Foto-, Ton- oder Videoaufnahmen der Test- oder Ident-Verfahren außerhalb der ausdrücklich vorgesehenen Reports;</li>
  <li>die Nutzung überlassener Daten, Ausweisdaten oder Test-Accounts für private oder vertragsfremde Zwecke;</li>
  <li>die Veröffentlichung oder Weitergabe von Informationen über Auftraggeber, Partner, Testinhalte oder Testmethoden gegenüber Dritten oder in sozialen Medien;</li>
  <li>das Unterlassen der fristgerechten Löschung überlassener Daten nach Abschluss des jeweiligen Tests.</li>
</ul>
<p>(2) Bei einem Verstoß haftet der Arbeitnehmer nach den gesetzlichen Bestimmungen. Das Recht des Arbeitgebers zur außerordentlichen (fristlosen) Kündigung aus wichtigem Grund sowie zur Geltendmachung von Schadensersatz bleibt ausdrücklich vorbehalten.</p>

<h3>§13 Datenschutz, Datensicherheit und ausschließliche Testzwecke</h3>
<p>(1) Der Arbeitgeber verarbeitet personenbezogene Daten der Mitarbeiter sowie im Rahmen der Tätigkeit erhobene oder verarbeitete Daten ausschließlich zur Durchführung des Arbeitsverhältnisses sowie der vereinbarten Test-, Prüf- und Verifizierungsaufgaben. Die Verarbeitung erfolgt unter Beachtung der geltenden datenschutzrechtlichen Vorschriften, insbesondere der Art. 5, 6, 13 und 32 DSGVO.</p>
<p>(2) Im Rahmen von Test- und Verifizierungsprozessen können, soweit für die jeweilige Testaufgabe erforderlich, insbesondere Identitätsdaten, Daten aus Ausweisdokumenten sowie Foto- oder Videoaufnahmen verarbeitet werden. Diese Daten werden ausschließlich für den jeweiligen Testzweck verwendet, nicht unbefugt an Dritte weitergegeben und nicht länger gespeichert, als es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten dies vorsehen. Anschließend werden die Daten gelöscht oder, soweit erforderlich, anonymisiert.</p>
<p>(3) Sämtliche im Rahmen von Test- und Verifizierungsabläufen verwendeten Daten und Identitätsnachweise dienen ausschließlich der Durchführung von Testzwecken. Eine tatsächliche Eröffnung von Bankkonten, Zahlungsverkehrskonten oder sonstigen Finanzkonten auf Grundlage der für Testzwecke bereitgestellten Daten durch den Arbeitgeber erfolgt nicht.</p>
<p>(4) Der Arbeitgeber trifft gemäß Art. 32 DSGVO geeignete technische und organisatorische Maßnahmen, um personenbezogene Daten vor unbefugter oder unrechtmäßiger Verarbeitung, Verlust, Zerstörung oder unbefugtem Zugriff zu schützen.</p>
<p>(5) Der Mitarbeiter verpflichtet sich, sämtliche ihm im Rahmen seiner Tätigkeit bekannt werdenden personenbezogenen Daten und vertraulichen Informationen vertraulich zu behandeln, ausschließlich für die vorgesehenen Aufgaben zu verwenden und nicht unbefugt an Dritte weiterzugeben. Diese Verpflichtung besteht auch nach Beendigung des Arbeitsverhältnisses fort, soweit dies gesetzlich erforderlich ist.</p>
"""
    return subtitle, sections_html


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
        except Exception:
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

    contract_type = application.get("contract_type", "vollzeit")
    subtitle, sections_html = _build_contract_html_parts(contract_type, signed_date)
    contract_title = {
        "minijob_at": "WERKVERTRAG",
        "freiberufler_at": "DIENSTLEISTUNGSVERTRAG",
    }.get(contract_type, "ARBEITSVERTRAG")

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

<h1>{contract_title}</h1>
<p class="subtitle">{subtitle}</p>

<div class="parties">
  <div>
    <p class="label">Arbeitgeber:</p>
    <p>MO Handel & Service, Inh. Mariusz Otok</p>
    <p>Darmstädter Landstraße 60</p>
    <p>65462 Ginsheim-Gustavsburg</p>
    <p style="color:#666;margin-top:4px;">vertreten durch Mariusz Otok</p>
  </div>
  <div>
    <p class="label">Arbeitnehmer:</p>
    <p>{name}</p>
    <p>{address}</p>
  </div>
</div>

<p><em>Dieser Vertrag wird zwischen den oben genannten Parteien geschlossen und beinhaltet die nachfolgenden Vereinbarungen:</em></p>

{sections_html}

<div class="signatures">
  <div class="sig-block">
    <p style="color:#666;margin-bottom:8px;">Ginsheim-Gustavsburg, {signed_date}</p>
    <div class="sig-line"><span style="font-family:'Brush Script MT',cursive,'Segoe Script','Comic Sans MS',sans-serif;font-size:22pt;color:#222;">Mariusz Otok</span></div>
    <p class="sig-name">Mariusz Otok · Arbeitgeber</p>
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
