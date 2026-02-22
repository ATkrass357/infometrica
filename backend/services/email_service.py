"""
Email service using Resend for sending professional business emails
Beautiful letter-style HTML templates
"""
import os
import resend
from typing import Optional
from datetime import datetime

# Initialize Resend
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
FROM_EMAIL = os.environ.get("FROM_EMAIL", "onboarding@resend.dev")

def init_resend():
    """Initialize Resend with API key"""
    if RESEND_API_KEY:
        resend.api_key = RESEND_API_KEY
        return True
    return False


def get_letter_template(content: str, footer_note: str = "") -> str:
    """Generate a professional letter-style email template"""
    current_date = datetime.now().strftime("%d. %B %Y").replace(
        "January", "Januar").replace("February", "Februar").replace(
        "March", "März").replace("April", "April").replace(
        "May", "Mai").replace("June", "Juni").replace(
        "July", "Juli").replace("August", "August").replace(
        "September", "September").replace("October", "Oktober").replace(
        "November", "November").replace("December", "Dezember")
    
    return f"""
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Georgia', 'Times New Roman', serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        <!-- Letterhead -->
                        <tr>
                            <td style="padding: 40px 50px 30px 50px; border-bottom: 2px solid #f97316;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td>
                                            <h1 style="margin: 0; font-size: 28px; font-weight: normal; color: #1a1a1a; letter-spacing: 2px;">
                                                <span style="color: #1a1a1a;">Info</span><span style="color: #f97316;">metrica</span>
                                            </h1>
                                            <p style="margin: 5px 0 0 0; font-size: 11px; color: #666; letter-spacing: 1px; text-transform: uppercase;">
                                                App Testing Agency
                                            </p>
                                        </td>
                                        <td align="right" style="font-size: 12px; color: #666; line-height: 1.6;">
                                            Tauentzienstraße 9-12<br>
                                            10789 Berlin<br>
                                            Deutschland
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Date -->
                        <tr>
                            <td style="padding: 30px 50px 0 50px;">
                                <p style="margin: 0; font-size: 13px; color: #666; text-align: right;">
                                    Berlin, {current_date}
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Letter Content -->
                        <tr>
                            <td style="padding: 30px 50px 40px 50px;">
                                {content}
                            </td>
                        </tr>
                        
                        <!-- Signature -->
                        <tr>
                            <td style="padding: 0 50px 40px 50px;">
                                <p style="margin: 0 0 25px 0; font-size: 15px; color: #333; line-height: 1.6;">
                                    Mit freundlichen Grüßen
                                </p>
                                <p style="margin: 0; font-size: 15px; color: #333; font-style: italic;">
                                    Das Infometrica Team
                                </p>
                                <div style="margin-top: 15px; width: 150px; height: 2px; background: linear-gradient(to right, #f97316, transparent);"></div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 25px 50px; background-color: #fafafa; border-top: 1px solid #eee;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="font-size: 11px; color: #999; line-height: 1.6;">
                                            <strong style="color: #666;">Infometrica GmbH</strong><br>
                                            Tauentzienstraße 9-12 · 10789 Berlin<br>
                                            E-Mail: info@infometrica.de
                                        </td>
                                        <td align="right" style="font-size: 11px; color: #999;">
                                            {footer_note}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


async def send_application_confirmation(
    to_email: str,
    applicant_name: str,
    position: str
) -> bool:
    """Send confirmation email when application is submitted"""
    if not init_resend():
        print("Resend not configured - skipping email")
        return False
    
    content = f"""
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333;">
            <strong>Betreff: Eingangsbestätigung Ihrer Bewerbung</strong>
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Sehr geehrte/r {applicant_name},
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            wir freuen uns, Ihnen den Eingang Ihrer Bewerbung als <strong>{position}</strong> 
            bei der Infometrica GmbH bestätigen zu können.
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Ihre Unterlagen werden nun von unserem Team sorgfältig geprüft. 
            Dieser Vorgang kann einige Werktage in Anspruch nehmen.
        </p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #fff8f3; border-left: 3px solid #f97316;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #333; font-weight: bold;">
                Die nächsten Schritte:
            </p>
            <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #555; line-height: 1.8;">
                <li>Prüfung Ihrer Bewerbungsunterlagen</li>
                <li>Benachrichtigung über das Ergebnis per E-Mail</li>
                <li>Bei positiver Prüfung: Identitätsverifizierung</li>
            </ol>
        </div>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Sie können den aktuellen Status Ihrer Bewerbung jederzeit in Ihrem 
            persönlichen Bewerberportal einsehen.
        </p>
        
        <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.8;">
            Für Rückfragen stehen wir Ihnen gerne zur Verfügung.
        </p>
    """
    
    try:
        params = {
            "from": f"Infometrica <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": "Eingangsbestätigung Ihrer Bewerbung - Infometrica",
            "html": get_letter_template(content, "Ref: Bewerbung")
        }
        
        resend.Emails.send(params)
        print(f"Application confirmation email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


async def send_application_accepted(
    to_email: str,
    applicant_name: str
) -> bool:
    """Send email when application is accepted"""
    if not init_resend():
        print("Resend not configured - skipping email")
        return False
    
    content = f"""
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333;">
            <strong>Betreff: Positive Rückmeldung zu Ihrer Bewerbung</strong>
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Sehr geehrte/r {applicant_name},
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            wir freuen uns, Ihnen mitteilen zu können, dass Ihre Bewerbung bei uns 
            <strong style="color: #16a34a;">positiv bewertet</strong> wurde.
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Um den Bewerbungsprozess abzuschließen, benötigen wir noch Ihre 
            Identitätsverifizierung gemäß den Anforderungen des Geldwäschegesetzes (GwG).
        </p>
        
        <div style="margin: 30px 0; padding: 25px; background-color: #fffbeb; border: 1px solid #fbbf24; border-radius: 4px;">
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #92400e; font-weight: bold;">
                Bitte laden Sie folgende Dokumente hoch:
            </p>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #78350f; line-height: 2;">
                <li>Vorderseite Ihres Personalausweises oder Reisepasses</li>
                <li>Rückseite Ihres Personalausweises oder Reisepasses</li>
            </ul>
        </div>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Bitte melden Sie sich in Ihrem Bewerberportal an, um die Dokumente hochzuladen. 
            Ihre Daten werden selbstverständlich vertraulich behandelt und ausschließlich 
            zur Identitätsprüfung verwendet.
        </p>
        
        <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.8;">
            Wir freuen uns darauf, Sie bald in unserem Team begrüßen zu dürfen.
        </p>
    """
    
    try:
        params = {
            "from": f"Infometrica <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": "Ihre Bewerbung wurde angenommen - Nächster Schritt erforderlich",
            "html": get_letter_template(content, "Ref: ID-Verifizierung")
        }
        
        resend.Emails.send(params)
        print(f"Application accepted email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


async def send_account_unlocked(
    to_email: str,
    employee_name: str
) -> bool:
    """Send email when account is fully unlocked"""
    if not init_resend():
        print("Resend not configured - skipping email")
        return False
    
    content = f"""
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333;">
            <strong>Betreff: Herzlich Willkommen bei Infometrica</strong>
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Sehr geehrte/r {employee_name},
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            wir freuen uns, Ihnen mitteilen zu können, dass Ihre Identitätsverifizierung 
            erfolgreich abgeschlossen wurde. Ihr Konto ist nun 
            <strong style="color: #16a34a;">vollständig freigeschaltet</strong>.
        </p>
        
        <div style="margin: 30px 0; padding: 25px; background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 4px;">
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #166534; font-weight: bold;">
                Sie haben nun Zugang zu folgenden Funktionen:
            </p>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #15803d; line-height: 2;">
                <li>Einsehen und Unterschreiben Ihres Arbeitsvertrages</li>
                <li>Bearbeitung zugewiesener Aufträge</li>
                <li>Verwaltung Ihrer persönlichen Dokumente</li>
                <li>Anpassung Ihrer Kontoeinstellungen</li>
            </ul>
        </div>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Bitte melden Sie sich zeitnah in Ihrem Mitarbeiter-Dashboard an, um Ihren 
            Arbeitsvertrag zu prüfen und digital zu unterzeichnen.
        </p>
        
        <table cellpadding="0" cellspacing="0" style="margin: 25px 0;">
            <tr>
                <td style="background-color: #f97316; border-radius: 4px;">
                    <a href="https://infometrica.de/mitarbeiter/login" 
                       style="display: inline-block; padding: 14px 28px; color: #ffffff; 
                              text-decoration: none; font-size: 14px; font-weight: bold;">
                        Zum Mitarbeiter-Dashboard →
                    </a>
                </td>
            </tr>
        </table>
        
        <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.8;">
            Wir heißen Sie herzlich willkommen im Team und freuen uns auf die Zusammenarbeit.
        </p>
    """
    
    try:
        params = {
            "from": f"Infometrica <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": "Willkommen im Team - Ihr Konto ist freigeschaltet",
            "html": get_letter_template(content, "Ref: Onboarding")
        }
        
        resend.Emails.send(params)
        print(f"Account unlocked email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


async def send_new_task_notification(
    to_email: str,
    employee_name: str,
    task_title: str,
    due_date: Optional[str] = None
) -> bool:
    """Send email when a new task is assigned"""
    if not init_resend():
        print("Resend not configured - skipping email")
        return False
    
    due_info = f"<p style='margin: 10px 0 0 0; font-size: 13px; color: #dc2626;'><strong>Fällig bis:</strong> {due_date}</p>" if due_date else ""
    
    content = f"""
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333;">
            <strong>Betreff: Neuer Auftrag zugewiesen</strong>
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Sehr geehrte/r {employee_name},
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Ihnen wurde ein neuer Auftrag zugewiesen. Bitte nehmen Sie diesen zeitnah 
            in Bearbeitung.
        </p>
        
        <div style="margin: 30px 0; padding: 25px; background-color: #fafafa; border-left: 4px solid #f97316; border-radius: 0 4px 4px 0;">
            <p style="margin: 0; font-size: 18px; color: #1a1a1a; font-weight: bold;">
                {task_title}
            </p>
            {due_info}
        </div>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Die vollständigen Auftragsdetails sowie alle erforderlichen Informationen 
            finden Sie in Ihrem Mitarbeiter-Dashboard unter dem Menüpunkt "Aufträge".
        </p>
        
        <table cellpadding="0" cellspacing="0" style="margin: 25px 0;">
            <tr>
                <td style="background-color: #f97316; border-radius: 4px;">
                    <a href="https://infometrica.de/mitarbeiter/auftrage" 
                       style="display: inline-block; padding: 14px 28px; color: #ffffff; 
                              text-decoration: none; font-size: 14px; font-weight: bold;">
                        Auftrag ansehen →
                    </a>
                </td>
            </tr>
        </table>
        
        <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.8;">
            Bei Fragen zum Auftrag wenden Sie sich bitte an Ihren Vorgesetzten.
        </p>
    """
    
    try:
        params = {
            "from": f"Infometrica <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": f"Neuer Auftrag: {task_title}",
            "html": get_letter_template(content, "Ref: Auftrag")
        }
        
        resend.Emails.send(params)
        print(f"New task notification sent to {to_email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


async def send_contract_ready(
    to_email: str,
    employee_name: str,
    position: str
) -> bool:
    """Send email when a contract is ready to sign"""
    if not init_resend():
        print("Resend not configured - skipping email")
        return False
    
    content = f"""
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333;">
            <strong>Betreff: Ihr Arbeitsvertrag liegt zur Unterschrift bereit</strong>
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Sehr geehrte/r {employee_name},
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Ihr Arbeitsvertrag für die Position <strong>{position}</strong> wurde erstellt 
            und steht zur digitalen Unterzeichnung bereit.
        </p>
        
        <div style="margin: 30px 0; padding: 25px; background-color: #eff6ff; border: 1px solid #93c5fd; border-radius: 4px;">
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #1e40af; font-weight: bold;">
                Bitte beachten Sie:
            </p>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #1e3a8a; line-height: 2;">
                <li>Lesen Sie den Vertrag sorgfältig durch</li>
                <li>Halten Sie Ihre IBAN für die Gehaltszahlung bereit</li>
                <li>Ihre digitale Unterschrift ist rechtlich bindend</li>
            </ul>
        </div>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #333; line-height: 1.8;">
            Bitte melden Sie sich in Ihrem Dashboard an und navigieren Sie zum Bereich 
            "Vertrag", um den Arbeitsvertrag einzusehen und zu unterzeichnen.
        </p>
        
        <table cellpadding="0" cellspacing="0" style="margin: 25px 0;">
            <tr>
                <td style="background-color: #f97316; border-radius: 4px;">
                    <a href="https://infometrica.de/mitarbeiter/vertrag" 
                       style="display: inline-block; padding: 14px 28px; color: #ffffff; 
                              text-decoration: none; font-size: 14px; font-weight: bold;">
                        Vertrag unterschreiben →
                    </a>
                </td>
            </tr>
        </table>
        
        <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.8;">
            Bei Fragen zum Vertrag stehen wir Ihnen gerne zur Verfügung.
        </p>
    """
    
    try:
        params = {
            "from": f"Infometrica <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": "Ihr Arbeitsvertrag ist bereit zur Unterschrift",
            "html": get_letter_template(content, "Ref: Arbeitsvertrag")
        }
        
        resend.Emails.send(params)
        print(f"Contract ready email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
