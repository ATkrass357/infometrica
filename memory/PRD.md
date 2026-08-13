# Prysm Technologies (ehemals Keyperion / Precision Labs) – PRD

## 🔵 Rebrand → Webora (2026-06)
- Kompletter Rebrand **Keyperion Technologies → Webora** (Frontend, Backend-Texte, Verträge, Mails, index.html, Impressum, SMS-Texte).
- **Design: Hellblau/Weiß** (grün #00C853/emerald/green → sky #0EA5E9 / sky-* Klassen; rgba 0,200,83 → 14,165,233).
- **Neues Logo** `WeboraLogo` (aufwändiges „W"-Monogramm mit Sky-Gradient, Hexagon-Rahmen, Doppel-W-Tiefe, Glanz) + passendes `favicon.svg` + theme-color #0EA5E9.
- **Rechtsträger**: MO Handel & Service, Inh. Mariusz Jerzy Otok, Darmstädter Landstraße 60, 65462 Ginsheim-Gustavsburg. USt-IdNr **DE368527526**. Verantwortlich §18 Abs.2 MStV: Mariusz Otok. (KEIN HRB – Einzelunternehmen; alte GmbH/HRB/Frankfurt-Registerdaten entfernt.)
- **Verträge (PDF+HTML)**: Arbeitgeber = MO Handel & Service (Marke Webora), Adresse Ginsheim-Gustavsburg, Unterzeichner = **Mariusz Otok**. ⚠️ Gerichtsstand-Klauseln stehen weiterhin auf „Frankfurt am Main" (nicht geändert – bei Bedarf anpassen).
- **Mails**: alle @webora.de (info/hr/kontakt/datenschutz). Admin-Login: **admin@webora.de** (Migration alter Accounts beim Start).
- WhatsApp-Float-Button (wa.me/4917613660609) unten rechts auf allen öffentlichen Seiten.
- Getestet: Startseite + Impressum (Screenshot), Admin-Login (HTTP 200). Vertrags-PDF-Generierung nur code-seitig verifiziert (Strings), nicht E2E.

## (Historie) Zurück zu Keyperion + .de — ersetzt durch Webora-Rebrand
- Prysm-Rebrand komplett zurückgerollt (git checkout f5aea75): wieder **Keyperion Technologies**, grünes Design (#00C853/emerald), grünes „K"-Logo, Geschäftsführer wieder **Lars Kurjo**.
- **Mail-Domain jetzt `.de`**: info@/hr@/kontakt@/datenschutz@keyperion-technologies.de.
- Admin-Login: `admin@keyperion-technologies.de` (Passwort unverändert). Seed migriert alte Accounts (prysm/keyperion.com/precision) automatisch.
- Deployment-Artefakte bleiben: `backend/requirements-prod.txt`, `DEPLOYMENT.md`.

## (Historie) Rebrand → Prysm Technologies + Weiß/Hellblau (2026-06) — RÜCKGÄNGIG
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
2026-06-30 (8): VPS-Deploy-Bug behoben. Ursache: `frontend/yarn.lock` war nie in Git committed (untracked) → auf dem VPS „No lockfile found", danach frische Auflösung über instabile Verbindung scheiterte an `follow-redirects`/`axios`. Fix: yarn.lock in Git aufgenommen (staged, valide via `yarn install --frozen-lockfile` = up-to-date) → kommt beim nächsten „Save to GitHub" ins Repo. DEPLOYMENT.md: robuster Install-Befehl (`--network-timeout 1000000`) + Fallback (`yarn cache clean && yarn install`). Kein Code/App betroffen; Testing-Agent iteration_25: Frontend 100% keine Regression.

2026-06-30 (7): Verträge im Panel editierbar (DB) + Startdatum pro Bewerber + „Überspringen"-Schalter. Verifiziert.

2026-06-30 (5): Provision für Aufgaben/Probeaufträge (Admin-Feld €, Mitarbeiter sieht Betrag je Auftrag + „Provision gesamt" Summe auf Dashboard). Backend total_provision in /api/employee/stats. Verifiziert.

2026-06-30 (4): Bewerber-Anliegen in DE- & AT-Arbeitsverträge eingearbeitet (Sozialversicherung/Anmeldung, 13./14. Gehalt, Kollektivvertrag/Tarifbindung, konkrete Verstöße). 5 Arbeitsverträge, Frontend+Backend, verifiziert.

2026-06-30 (3): KI-Generator für App-Test-Aufgaben (Gemini 3 Flash). Button „✨ Mit KI generieren" (nur Kategorie App Test), Duplikat-Sperre via ai_app_name (409), ~640 Tokens/Aufgabe. WICHTIG: Import von emergentintegrations ist im Endpoint lazy (ModuleNotFoundError→503), damit ein fehlendes Paket auf dem VPS NICHT das ganze Backend/Login lahmlegt. VPS braucht: `pip install emergentintegrations --extra-index-url ...` + EMERGENT_LLM_KEY in backend/.env.
2026-06-30 (2b): Fälligkeitsdatum (due_date) komplett aus der UI entfernt (Formular + Admin-Liste + Mitarbeiter-Ansicht). Backend-Feld bleibt bestehen, wird aber nicht mehr angezeigt.

2026-06-30 (2): Aufgaben-Kategorien im Admin-Panel. Jede Aufgabe hat eine Kategorie **BD** (Finanz-Tests/KYC) oder **App Test** (Mobile-Apps). Auswahl ist PFLICHT beim Erstellen (kein Auto-Default, Toast blockiert leeres Feld). Aufgabenliste in 2 Tabs getrennt (BD / App Tests) mit Zähler-Badges; Kategorie-Badge auf jeder Task-Karte. Alt-Aufgaben ohne Kategorie erscheinen im Banner „Noch nicht kategorisiert" mit → BD / → App Test Buttons. Mitarbeiter-Ansicht unverändert (KEINE Kategorie sichtbar). Backend: `category` in Task/TaskCreate/TaskUpdate (employee.py), Endpoint `PUT /api/admin/tasks/{id}/category`. Frontend: AdminTasks.jsx.

2026-06-30: Bugfix – Datenschutzklausel fehlte im Backend-PDF für `teilzeit`. §12 „Datenschutz, Datensicherheit und ausschließliche Testzwecke" (5 Absätze) im teilzeit-Zweig von `_build_contract_html_parts` (applications.py) ergänzt, damit Frontend-Vorschau und PDF übereinstimmen. Testing-Agent: 13/13 Backend-Tests bestanden (100%). Klausel jetzt in allen 5 Arbeitsverträgen: vollzeit §11 (Default §9), teilzeit §12, minijob §11, vollzeit_at §9, teilzeit_at §7. freiberufler_at/minijob_at (Werk-/Dienstleistungsvertrag) bewusst ohne diese Klausel.

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
