"""
Email service using Resend for sending transactional emails
"""
import os
import resend
from typing import Optional

# Initialize Resend
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
FROM_EMAIL = os.environ.get("FROM_EMAIL", "noreply@infometrica.de")

def init_resend():
    """Initialize Resend with API key"""
    if RESEND_API_KEY:
        resend.api_key = RESEND_API_KEY
        return True
    return False


async def send_application_confirmation(
    to_email: str,
    applicant_name: str,
    position: str
) -> bool:
    """Send confirmation email when application is submitted"""
    if not init_resend():
        print("Resend not configured - skipping email")
        return False
    
    try:
        params = {
            "from": f"Infometrica <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": "Bewerbung eingegangen - Infometrica",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f97316; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Infometrica</h1>
                </div>
                <div style="padding: 30px; background-color: #fff;">
                    <h2 style="color: #333;">Hallo {applicant_name},</h2>
                    <p style="color: #666; line-height: 1.6;">
                        vielen Dank für Ihre Bewerbung als <strong>{position}</strong> bei Infometrica.
                    </p>
                    <p style="color: #666; line-height: 1.6;">
                        Wir haben Ihre Unterlagen erhalten und werden diese sorgfältig prüfen. 
                        Sie können den Status Ihrer Bewerbung jederzeit in unserem Portal einsehen.
                    </p>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #666;">
                            <strong>Nächste Schritte:</strong><br>
                            1. Wir prüfen Ihre Bewerbung<br>
                            2. Sie erhalten eine Rückmeldung per E-Mail<br>
                            3. Bei positiver Prüfung: ID-Verifizierung
                        </p>
                    </div>
                    <p style="color: #666; line-height: 1.6;">
                        Bei Fragen stehen wir Ihnen gerne zur Verfügung.
                    </p>
                    <p style="color: #666;">
                        Mit freundlichen Grüßen,<br>
                        <strong>Das Infometrica Team</strong>
                    </p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    Infometrica • Tauentzienstraße 9-12 • 10789 Berlin
                </div>
            </div>
            """
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
    
    try:
        params = {
            "from": f"Infometrica <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": "Bewerbung akzeptiert - Nächster Schritt: ID-Verifizierung",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f97316; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Infometrica</h1>
                </div>
                <div style="padding: 30px; background-color: #fff;">
                    <h2 style="color: #333;">Gute Nachrichten, {applicant_name}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Ihre Bewerbung wurde <strong style="color: #22c55e;">akzeptiert</strong>!
                    </p>
                    <p style="color: #666; line-height: 1.6;">
                        Um den Bewerbungsprozess abzuschließen, benötigen wir noch Ihre ID-Verifizierung 
                        gemäß dem Geldwäschegesetz (GwG).
                    </p>
                    <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
                        <p style="margin: 0; color: #666;">
                            <strong>Bitte loggen Sie sich in Ihr Konto ein und laden Sie Folgendes hoch:</strong><br><br>
                            • Vorderseite Ihres Ausweises<br>
                            • Rückseite Ihres Ausweises
                        </p>
                    </div>
                    <p style="color: #666; line-height: 1.6;">
                        Die Dokumente werden ausschließlich zur Identitätsprüfung verwendet und nach 
                        Freischaltung Ihres Kontos gelöscht.
                    </p>
                    <p style="color: #666;">
                        Mit freundlichen Grüßen,<br>
                        <strong>Das Infometrica Team</strong>
                    </p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    Infometrica • Tauentzienstraße 9-12 • 10789 Berlin
                </div>
            </div>
            """
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
    
    try:
        params = {
            "from": f"Infometrica <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": "Willkommen im Team - Ihr Konto ist freigeschaltet!",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f97316; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Infometrica</h1>
                </div>
                <div style="padding: 30px; background-color: #fff;">
                    <h2 style="color: #333;">Willkommen im Team, {employee_name}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Ihre Verifizierung ist abgeschlossen und Ihr Konto wurde 
                        <strong style="color: #22c55e;">vollständig freigeschaltet</strong>!
                    </p>
                    <p style="color: #666; line-height: 1.6;">
                        Sie haben nun Zugriff auf das Mitarbeiter-Dashboard, wo Sie:
                    </p>
                    <ul style="color: #666; line-height: 1.8;">
                        <li>Ihren Arbeitsvertrag einsehen und unterschreiben können</li>
                        <li>Zugewiesene Aufträge bearbeiten</li>
                        <li>Ihre Dokumente verwalten</li>
                        <li>Ihre Einstellungen anpassen</li>
                    </ul>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://infometrica.de/mitarbeiter/login" 
                           style="background-color: #f97316; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Zum Dashboard
                        </a>
                    </div>
                    <p style="color: #666;">
                        Mit freundlichen Grüßen,<br>
                        <strong>Das Infometrica Team</strong>
                    </p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    Infometrica • Tauentzienstraße 9-12 • 10789 Berlin
                </div>
            </div>
            """
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
    
    due_info = f"<br><strong>Fällig bis:</strong> {due_date}" if due_date else ""
    
    try:
        params = {
            "from": f"Infometrica <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": f"Neuer Auftrag: {task_title}",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f97316; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Infometrica</h1>
                </div>
                <div style="padding: 30px; background-color: #fff;">
                    <h2 style="color: #333;">Hallo {employee_name},</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Ihnen wurde ein neuer Auftrag zugewiesen:
                    </p>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
                        <p style="margin: 0; color: #333; font-size: 18px;">
                            <strong>{task_title}</strong>
                            {due_info}
                        </p>
                    </div>
                    <p style="color: #666; line-height: 1.6;">
                        Bitte melden Sie sich im Dashboard an, um die Details einzusehen.
                    </p>
                    <p style="color: #666;">
                        Mit freundlichen Grüßen,<br>
                        <strong>Das Infometrica Team</strong>
                    </p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    Infometrica • Tauentzienstraße 9-12 • 10789 Berlin
                </div>
            </div>
            """
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
    
    try:
        params = {
            "from": f"Infometrica <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": "Ihr Arbeitsvertrag ist bereit zur Unterschrift",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f97316; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Infometrica</h1>
                </div>
                <div style="padding: 30px; background-color: #fff;">
                    <h2 style="color: #333;">Hallo {employee_name},</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Ihr Arbeitsvertrag als <strong>{position}</strong> ist bereit zur Unterschrift!
                    </p>
                    <p style="color: #666; line-height: 1.6;">
                        Bitte loggen Sie sich in Ihr Dashboard ein und unterschreiben Sie den Vertrag digital.
                        Vergessen Sie nicht, Ihre IBAN für die Gehaltszahlung anzugeben.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://infometrica.de/mitarbeiter/vertrag" 
                           style="background-color: #f97316; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Vertrag unterschreiben
                        </a>
                    </div>
                    <p style="color: #666;">
                        Mit freundlichen Grüßen,<br>
                        <strong>Das Infometrica Team</strong>
                    </p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    Infometrica • Tauentzienstraße 9-12 • 10789 Berlin
                </div>
            </div>
            """
        }
        
        resend.Emails.send(params)
        print(f"Contract ready email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
