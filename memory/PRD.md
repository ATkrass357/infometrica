# Precision Labs – PRD

## Original Problem Statement
User deployed "Precision Labs" on VPS. Debugging expanded to a full-featured platform: Admin Panel mobile optimization, 1:1 Admin-Employee Chat with Telegram notifications, HTML-to-PDF Contract generation, GMX/Web.de IMAP support, and public Test-Sitzungen (1-hour links for external testers with live SMS/Email codes).

## User Language
German (respond in German only).

## Architecture
- **Frontend**: React + Tailwind + shadcn/ui
- **Backend**: FastAPI + MongoDB (Motor) + JWT (7-day expiry)
- **Integrations**: Anosim (virtual numbers), smsroute.cc (SMS), IMAP (Gmail/GMX/Web.de), Telegram Bot API

## Completed Features
- Admin login (bcrypt==4.0.1)
- Admin Panel mobile-responsive
- Employee-Applicant merged logic (status "Freigeschaltet" = Mitarbeiter)
- 1:1 Chat (images, unread badges, Telegram webhook)
- Contract signing (HTML/PDF rendering, base64 signature)
- GMX/Web.de IMAP support
- Test-Sitzungen (public 1-hour links, task selection, live SMS/Email codes)
  - Label "Test Benutzer Name" (optional, statt Test-Email)
  - "Codes" statt "E-Mail Codes" (E-Mail-Adresse versteckt)

## Pending
- **P0**: Vertragsstartdatum automatisieren (Unterschriftsdatum als Startdatum) – wartet auf User-Bestätigung
- **P1**: WhatsApp-Weiterleitung für SMS-Codes
- **P2**: Mitarbeiter-CRUD, Dashboard-Analytics, i18n

## Deployment
User runs on VPS via GitHub pull. Standard command:
`cd ~/infometrica && git stash && git pull origin main && cd frontend && npm run build && sudo systemctl restart precision-backend && sudo systemctl restart nginx`

## Last Updated
2026-02-05: Test-Sitzungen – "Test Benutzer Name" (optional) & Passwort-Anzeige unabhängig vom Benutzername.
