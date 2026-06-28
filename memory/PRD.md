# Prysm Technologies (ehemals Keyperion / Precision Labs) – PRD

## Rebrand → Prysm Technologies + Weiß/Hellblau (2026-06)
- Komplettes Rebranding **Keyperion Technologies → Prysm Technologies** (Frontend, Backend-Texte, Verträge, Mails, index.html, Impressum).
- Neues Logo: SVG-Prisma (weißes Dreieck auf hellblauem #0EA5E9 Rounded-Square) in `components/Logo.jsx`, Export `PrysmLogo`.
- Theme: **Weiß + Hellblau** auf öffentlicher Seite + Mitarbeiter-Portal. Grün/Emerald (#00C853, emerald-*, green-*) → Sky-Blau (#0EA5E9 / sky-* Klassen). Dunkler Text bleibt dunkel.
- Admin-Panel: nutzt weiterhin separates dunkles "Tokyo Night" Dashboard-Theme (grüne Akzente dort ebenfalls zu sky-blau). Nicht vollständig monochrom/blau umgestellt.
- Mails/Domain: `*@prysm-technologies.com`. Admin-Login: `admin@prysm-technologies.com` (Legacy-Account wird beim Start automatisch migriert).


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
2026-06-28: 3 österreichische Verträge ergänzt (Vollzeit AT, Teilzeit AT, Freiberufler AT) → insgesamt 7 Vertragstypen.

### Österreich-Verträge (2026-06-28)
- 3 neue Auswahloptionen bei der Annahme: **Vollzeit AT** (40 Std., 2.900 €), **Teilzeit AT** (20 Std., 1.100 € + Provision), **Freiberufler AT** (Dienstleistungsvertrag, nur Provision, selbstständig). Alle österreichisches Recht, Gerichtsstand Frankfurt/Österreich, NDA+DSGVO, Vertragsstrafe 5.000 €.
- Dokumenttitel dynamisch: Freiberufler AT → „DIENSTLEISTUNGSVERTRAG", sonst „ARBEITSVERTRAG".
- Keys: `vollzeit_at`, `teilzeit_at`, `freiberufler_at`. Insgesamt 7 Typen (vollzeit/teilzeit/minijob/minijob_at/vollzeit_at/teilzeit_at/freiberufler_at).

### „Minijob AT" / Werkvertrag (2026-06-26)
- 4. Auswahloption bei der Annahme: **Minijob AT** (interner Key `minijob_at`) = Werkvertrag über IT-Applikations-Testing (Vergütung pro Test, selbstständig, NDA/DSGVO, Vertragsstrafe 5.000 €). Dokumenttitel dynamisch „WERKVERTRAG".
- Vorlage aus Nutzer-PDF (tester_werkvertrag.pdf), Auftraggeber = Keyperion Technologies GmbH.
- Erweitert: `_build_contract_html_parts` (Backend), `ContractTemplates.jsx` (MinijobATBody + CONTRACT_TITLES), accept-Validierung, AdminApplications-Dialog (4. Option).


### Vertragsauswahl bei Annahme (2026-06-26)
- Admin wählt beim Akzeptieren einer Bewerbung den Vertragstyp: **Vollzeit** (bisheriger Vertrag), **Teilzeit** (700 € + Provision, bis 20 Std.) oder **Minijob** (Provision 50–300 €, max. 603 €/2026). Gespeichert als `contract_type` auf der Bewerbung (Default `vollzeit`).
- Bewerber sieht auf der Unterschriftsseite + im PDF/HTML-Download genau diesen Vertrag.
- Vorlagen aus Nutzer-PDFs als Blueprints nachgebaut (ohne Namen), Arbeitgeber = Keyperion Technologies GmbH.
- **Bulk-Annahme komplett entfernt** (Checkboxen, Bulk-Button, Info-Banner, `/bulk-accept` Endpoint).
- Dateien: `models/application.py` (+contract_type), `routes/applications.py` (`accept` mit body, `_build_contract_html_parts`), `pages/mitarbeiter/ContractTemplates.jsx` (neu), `MitarbeiterContractSign.jsx`, `pages/admin/AdminApplications.jsx` (Annahme-Dialog).
