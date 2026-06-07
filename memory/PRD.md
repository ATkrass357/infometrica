# Keyperion Technologies (ehemals Precision Labs) – PRD

## Original Problem Statement
Keyperion Technologies VPS-Plattform (Rebrand von "Precision Labs"): Admin Panel Mobile, 1:1 Chat, HTML-Contract, GMX/Web.de IMAP, Test-Sitzungen (1-Stunden-Links), Referral-Links.

## User Language
German.

## Architecture
- Frontend: React + Tailwind + shadcn/ui
- Backend: FastAPI + MongoDB + JWT (7 Tage)
- Integrationen: Anosim, smsroute, IMAP (Gmail/GMX/Web.de), Telegram

## Completed
- Admin login (bcrypt==4.0.1)
- Mobile-responsive Admin
- 1:1 Chat mit Telegram
- Vertragsgenerierung
- GMX/Web.de IMAP
- Test-Sitzungen (Public 1h, Codes SMS+Email)

## Critical Bug Fixes
**2026-02-05: SMS Forwarding zu Test-Sitzungen (P0 – kostete User 1000€)**
- Backend: `get_sms_for_number` erwartete Telefonnummer, bekam aber Booking-ID → korrigiert auf `get_sms_for_booking` mit Fallback
- Frontend: Las `num.booking_id`, API liefert aber `num.id` → Admin-Form korrigiert
- SMS-Format normalisiert (`messageText` → `text`, `messageDate` → `received_at`)
- Automatische Code-Extraktion via `extract_verification_code`
- Nur SMS ab Sessionstart sichtbar

## Pending
- P1: WhatsApp-Weiterleitung SMS-Codes
- P2: Mitarbeiter-CRUD, Dashboard-Analytics, i18n

## Rebrand & Vertragsstartdatum (2026-06-07)
- **Rebrand Precision Labs → Keyperion Technologies** in gesamter Frontend-UI + Backend-Texten:
  - Neues SVG-Logo (Buchstabe "K", `KeyperionLogo` in `components/Logo.jsx`), ersetzt altes PNG `LOGO_URL` überall
  - Neue Domain-Mails: info@/hr@/datenschutz@/kontakt@keyperion-technologies.com
  - Impressum komplett: Keyperion Technologies GmbH, Große Gallusstr. 14, 60315 Frankfurt am Main, HRB 143010, AG Frankfurt am Main, USt-IdNr. DE156178436, Vertreter Lars Kurjo
  - Verträge (Frontend ContractSign/Vertrag, Backend `contracts.py` PDF + `applications.py` HTML): Arbeitgeber = Keyperion Technologies GmbH, Frankfurt, Unterzeichner Lars Kurjo
- **Vertragsstartdatum = Unterschriftsdatum**: §1 zeigt jetzt das tatsächliche Unterschriftsdatum (`{signed_date}` / `sign_date_str` / `new Date()`)
- ⚠️ NICHT geändert (bewusst): Login-Seed-Mails (admin@/mitarbeiter@precision-labs.de), SMS-Absender-ID "PrecisionLab" (.env), Calendly-Slug (App.js), Admin-Login-Placeholder

## Deployment
`cd ~/infometrica && git stash && git pull origin main && cd frontend && npm run build && sudo systemctl restart precision-backend && sudo systemctl restart nginx`

## Last Updated
2026-06-07: Rebrand zu Keyperion Technologies (Logo, Texte, Impressum, Verträge) + Vertragsstartdatum = Unterschriftsdatum.
