# Infometrica - App Testing Agency Platform

## Original Problem Statement
Build a full-stack application for the app testing agency "Infometrica" with:
1. **Public Website** - German language, white/orange theme
2. **Admin Panel** - Tokyo Night theme for managing applications, tasks, and contracts
3. **Employee Dashboard** - Orange/white theme for viewing assigned tasks and signing contracts

## Core Requirements
- German language throughout
- Role-based authentication (Admin, Applicant, Employee)
- Task management with 4-part descriptions
- Application tracking with ID verification (Geldwaschegesetz compliance)
- Digital contract signing with IBAN collection
- Minijob employment contracts (603 EUR/month)

## Tech Stack
- **Frontend**: React, React Router, TailwindCSS, shadcn/ui, react-signature-canvas
- **Backend**: FastAPI, MongoDB (motor async), Pydantic, ReportLab (PDF generation)
- **Authentication**: JWT with role-based access control

---

## What's Been Implemented

### Public Website (100% Complete)
- [x] Home page with hero section
- [x] Unternehmen (About) page
- [x] Dienstleistungen (Services) page
- [x] Karriere (Career) page with application form + password selection
  - **NEW: "Web Application Tester" position (Minijob)**
- [x] Kontakt (Contact) page
- [x] Impressum (Imprint) page
- [x] Datenschutz (Privacy Policy) page
- [x] Logo and branding
- [x] Footer with admin login link

### Admin Panel (100% Complete)
- [x] Secure login at `/admin/login`
- [x] Tokyo Night theme
- [x] Dashboard overview
- [x] Applications management
  - View all job applications
  - Accept applications (changes status to allow ID upload)
  - **NEW: Bulk acceptance - select multiple applications and accept at once**
  - Search and filter applications by name, email, position, city, or status
  - Status badges: Neu, Wartet auf ID, Verifiziert, Freigeschaltet
- [x] **Verifications page (P1 COMPLETE)**
  - View pending verifications
  - Display ID images (base64, no download - DSGVO compliant)
  - **Unlock verified employees ("Freischalten" button)**
  - Delete verification documents
- [x] Task Management System
  - Create tasks with title, website URL, 4-part description
  - **Multi-Person Task Assignment (NEW - February 22, 2025)**
    - Search employees by name, email, or position
    - Select multiple employees via checkboxes
    - Enter unique test credentials per employee (Test Ident Link, E-Mail, Passwort)
    - 2-step modal: Step 1 = select employees, Step 2 = enter credentials
  - View tasks with assignment count ("X Mitarbeiter")
  - Expanded view shows all assignments with individual credentials
  - View/delete tasks
- [x] **Contract Management**
  - Create employment contracts for employees
  - **Search employees by name (autocomplete)**
  - View contract status (pending/signed)
- [x] **Document Management (NEW)**
  - View all employee-uploaded documents
  - Search and filter by name, employee, category, status
  - Approve or reject documents
  - Download documents
  - Delete documents

### Applicant/Employee Flow (100% Complete)
- [x] **Self-Registration with Password**
  - Applicants choose own password during application
  - Can login immediately at `/mitarbeiter/login`
- [x] **Status-Based Access Control**
  - `Neu`: "Bewerbung wird gepruft" page
  - `Akzeptiert`: ID verification upload page (GwG + DSGVO notices)
  - `Verifiziert`: "Wartet auf Freischaltung" page
  - `Freigeschaltet`: Full dashboard access
- [x] **ID Verification Upload**
  - Upload front + back of ID document
  - File validation (JPEG, PNG, WebP, max 5MB)
  - Stored securely, displayed to admin as base64

### Employee Dashboard (100% Complete - P2 COMPLETE)
- [x] Secure login at `/mitarbeiter/login`
- [x] Orange/white theme
- [x] Sidebar navigation: Main, Vertrag, Auftrage, Einstellungen, Dokumente
- [x] ~~Auszahlung (Payout)~~ - REMOVED per user request
- [x] **Vertrag (Contract) page**
  - View and sign employment contracts
  - **Full contract preview before signing (Minijob format)**
  - Digital signature with canvas
  - IBAN input field for salary payment
  - PDF download for signed contracts
- [x] Auftrage (Tasks) page - View and manage assigned tasks
- [x] **Einstellungen (Settings) page - CONNECTED TO BACKEND**
  - Profile data loaded from `/api/employee/profile`
  - Update phone and address
  - Change password (with validation)
  - Notification settings persist in database
- [x] **Dokumente (Documents) page - FULLY CONNECTED TO BACKEND**
  - Documents loaded from `/api/employee/documents`
  - **Signed contracts appear automatically**
  - **Upload new documents - WORKING**
  - Download contracts as PDF
  - Category filter
  - Delete pending documents
- [x] Main dashboard with task overview

---

## Contract Format - Minijob

The employment contract is now a **Minijob (geringfugige Beschaftigung)** with:
- Infometrica address: Tauentzienstrasse 9-12, 10789 Berlin
- Position: Assistent fur Evaluierungen im Homeoffice
- Tasks: App/Software testing, Video ID verification, Reports
- Working hours: ~10 hours/week (2-4 days)
- Salary: max 603 EUR/month
- Vacation: 28 days/year
- Special bonuses: June + December (603 EUR each)
- Probation: 6 weeks

---

## API Endpoints

### Employee Profile Endpoints (NEW)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employee/profile | Get employee profile with notifications |
| PUT | /api/employee/profile | Update phone and address |
| POST | /api/employee/change-password | Change password with validation |
| PUT | /api/employee/notifications | Update notification settings |

### Employee Documents Endpoints (NEW)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employee/documents | Get documents + signed contracts |
| POST | /api/employee/documents/upload | Upload new document |
| GET | /api/employee/documents/{id}/download | Download document/contract |
| DELETE | /api/employee/documents/{id} | Delete pending document |

### Contract Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contracts/create | Create contract for employee (admin) |
| GET | /api/contracts/ | Get all contracts (admin) |
| GET | /api/contracts/my-contracts | Get employee's contracts |
| GET | /api/contracts/{id} | Get contract details |
| POST | /api/contracts/{id}/sign | Sign contract with signature + IBAN |
| GET | /api/contracts/{id}/download | Download signed contract PDF |

### Task Endpoints (NEW)
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | /api/admin/tasks/{id}/assign-multiple | Assign task to multiple employees with unique credentials |
| GET | /api/admin/tasks | Get all tasks (with assignments array) |
| POST | /api/admin/tasks | Create new task |
| DELETE | /api/admin/tasks/{id} | Delete task |

### Application/Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/applications/{id}/unlock | Unlock verified employee (admin) |
| POST | /api/applications/bulk-accept | Accept multiple applications at once (admin) |

---

## Test Credentials

| Role | Email | Password | Status |
|------|-------|----------|--------|
| Admin | admin@infometrica.de | Admin123! | - |
| Employee | mitarbeiter@infometrica.de | Mitarbeiter123! | Freigeschaltet |

---

## Completed Tasks (This Session)

### February 2025 - Session Updates
1. **Removed Auszahlung (Payout) page** from employee dashboard
2. **Added IBAN field** to contract signing process
3. **Added "Web Application Tester"** job position (Minijob)
4. **Updated contract to Minijob format** with full legal text (10 paragraphs)
5. **Added contract preview** before signing
6. **P1 COMPLETE: Admin verification unlock** - "Freischalten" button works
7. **P2 COMPLETE: Backend connection for Settings/Documents**
   - Settings page loads from /api/employee/profile
   - Password change with validation
   - Notification settings persist
   - Documents page shows signed contracts
   - Document download works
8. **Bulk Acceptance Feature** (February 22, 2025)
   - Checkboxes for selecting multiple "Neu" applications
   - Select-all checkbox in table header
   - Bulk accept button showing count of selected items
   - Backend endpoint POST /api/applications/bulk-accept
   - Email notifications sent to each accepted applicant
   - Proper JWT token validation
   - Info banner for quick filtering to "Neu" applications
9. **Document Upload Feature** (February 22, 2025)
   - Backend endpoint POST /api/employee/documents/upload (Form-Data)
   - Frontend upload button working with file validation
   - Supports PDF, JPEG, PNG (max 10MB)
   - Documents displayed with status badges
   - Category filtering working
10. **Admin Document Management** (February 22, 2025)
   - New admin page at /admin/documents
   - View all employee-uploaded documents
   - Approve/reject/delete documents
   - Search and filter functionality
   - Download documents

---

## All Implemented - Platform Complete!

All core features have been implemented and tested:
- Public website with career page
- Admin panel with bulk application management
- Employee dashboard with document management
- Contract signing with Minijob template
- Email notifications via Resend
- ID verification flow

### Potential Enhancements
- [ ] Email notifications (SMTP integration) for new applications, tasks
- [ ] Employee management module in admin panel (CRUD)
- [ ] Dashboard analytics and reports
- [ ] Multi-language support

---

## File Structure
```
/app
├── backend/
│   ├── routes/
│   │   ├── applications.py  # Application + unlock endpoint
│   │   ├── contracts.py     # Contract management + PDF
│   │   └── employee.py      # Profile, settings, documents
│   ├── uploads/
│   │   ├── contracts/       # Signed PDF storage
│   │   ├── documents/       # Employee documents
│   │   ├── signatures/      # Signature images
│   │   └── verifications/   # ID images
│   └── server.py
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminContracts.jsx    # Contract creation + search
    │   │   │   └── AdminVerifications.jsx # Unlock button
    │   │   ├── mitarbeiter/
    │   │   │   ├── MitarbeiterVertrag.jsx    # Minijob contract + preview
    │   │   │   ├── MitarbeiterDokumente.jsx  # Backend connected
    │   │   │   └── MitarbeiterEinstellungen.jsx # Backend connected
    │   │   └── Karriere.jsx  # Web Application Tester job
    │   └── components/
    │       └── mitarbeiter/
    │           └── MitarbeiterLayout.jsx  # No Auszahlung
    └── App.js
```

---

## Last Updated
February 22, 2025 - All P1 features complete. Platform fully functional.
