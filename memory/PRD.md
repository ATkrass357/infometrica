# Infometrica - App Testing Agency Website

## Problemstellung (Original)
Moderne Website für App-Testing-Agentur "Infometrica" in deutscher Sprache mit vier Hauptseiten:
- Startseite
- Unternehmen und Agentur
- Dienstleistung und Fachgebiete (Application Testing)
- Kontakt und Helpdesk

Design: Modernes white & orange Farbschema mit Office-Stock-Photos

## Technologie-Stack
- **Frontend**: React, Tailwind CSS, shadcn/ui
- **Router**: React Router v7
- **Backend**: (später) FastAPI + MongoDB
- **Deployment**: Emergent Platform

## User Personas
1. **Geschäftsführer/CTOs** - Suchen professionelle Testing-Partner
2. **Produktmanager** - Brauchen Qualitätssicherung für Apps
3. **Entwicklerteams** - Benötigen externe Testing-Expertise

## Kern-Anforderungen (Statisch)
### Funktional
- 4 deutsche Seiten mit professionellen Inhalten
- Navigation mit aktiven States
- Kontaktformular (Frontend only, später Telegram Webhook)
- Responsive Design
- Smooth Scrolling & Animations

### Design
- White & Orange Farbschema
- Professionelle Office-Bilder
- Moderne, saubere UI
- CTA Buttons auf allen Seiten
- Hover-Effekte und Transitions

## Was implementiert wurde (Dezember 2024)

### Phase 1: Frontend-Website (Abgeschlossen)
**Datum**: Dezember 2024

#### Seiten erstellt:
1. **Startseite** (`/`)
   - Hero Section mit Office-Bild
   - Stats Section (500+ Apps, 98% Zufriedenheit, etc.)
   - Services Overview (4 Hauptdienste)
   - "Warum Infometrica?" Section
   - CTA Section

2. **Unternehmen** (`/unternehmen`)
   - Über uns Hero
   - Mission & Vision Cards
   - Unternehmenswerte (4 Werte)
   - Company Journey Timeline
   - Team Section

3. **Dienstleistungen** (`/dienstleistungen`)
   - Service Hero
   - 4 Hauptservices mit Details:
     - Funktionales Testing
     - Usability Testing
     - Performance Testing
     - Security Testing
   - Plattform-Expertise
   - Testing-Prozess (4 Schritte)
   - Vorteile-Section

4. **Karriere** (`/karriere`)
   - Karriere Hero Section
   - Benefits Section (6 Vorteile)
   - Offene Stellen (4 Positionen):
     - Senior QA Engineer
     - Mobile App Tester
     - Junior Test Analyst
     - Performance Test Engineer
   - Bewerbungsformular mit CV-Upload
   - CTA Section

5. **Kontakt** (`/kontakt`)
   - Kontakt Hero
   - 3 Kontakt-Info Cards
   - Kontaktformular (mit Validierung)
   - FAQ/Helpdesk Section (4 FAQs)
   - "Warum uns kontaktieren?" Info-Box

6. **Impressum** (`/impressum`)
   - Firmeninformationen
   - Kontaktdaten
   - Vertretungsberechtigte
   - Registereintrag
   - USt-ID
   - Berufshaftpflicht
   - Streitschlichtung
   - Haftung für Inhalte
   - Urheberrecht

7. **Datenschutz** (`/datenschutz`)
   - DSGVO-konforme Datenschutzerklärung
   - Verantwortliche Stelle
   - Datenerfassung & Nutzung
   - Benutzerrechte
   - Hosting-Informationen
   - Cookie-Policy
   - Kontaktformular-Datenschutz

#### Komponenten:
- `Logo.jsx` - Custom SVG Logo mit "I" Lettermark und Checkmark
- `Navbar.jsx` - Fixed navigation mit Mobile Menu (inkl. Karriere)
- `Footer.jsx` - Company info, Links, Social Media, Impressum & Datenschutz
- Alle shadcn/ui Components verwendet

#### Design-Features:
- White & Orange Farbschema perfekt umgesetzt
- Custom SVG Logo (modern, simpel, professionell)
- 8 professionelle Office-Stock-Photos integriert
- Smooth Scrolling aktiviert
- Hover-Animationen auf Buttons/Cards
- Transform & Scale Effekte
- Lucide-React Icons (keine Emojis)

## Prioritisierter Backlog

### P0 (Nächste Phase)
- Telegram Webhook Integration für Kontaktformular
- Backend API Setup

### P1 (Zukünftig)
- Blog/News Section
- Case Studies/Portfolio
- Kundenbewertungen
- Multi-Language Support (Englisch)

### P2 (Nice to have)
- Team Member Profiles
- Newsletter Integration
- Live Chat Support
- Download Resources (Whitepapers)

## Nächste Tasks
1. ✅ Frontend-Website erstellen - **ABGESCHLOSSEN**
2. Auf Telegram Webhook Integration warten (User Request)
3. Backend Development beginnen (falls benötigt)
4. Content-Refinement mit echten Firmendaten

## Mocking/Temporary Solutions
- Kontaktformular: Aktuell nur Frontend-Validierung und Toast-Benachrichtigung
- Bewerbungsformular: Aktuell nur Frontend-Validierung und Toast-Benachrichtigung
- Alle Bilder: Stock Photos von Unsplash/Pexels
- Content: Professionelle Platzhaltertexte
- Impressum & Datenschutz: Muster-Inhalte (müssen mit echten Firmendaten ersetzt werden)

## Notizen
- Alle Inhalte in deutscher Sprache
- Fokus auf Application Testing als Kernkompetenz
- Design folgt modernen 2024/2025 Standards
- Kein Backend benötigt für Phase 1
