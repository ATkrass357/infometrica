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
- Application tracking with ID verification (Geldwäschegesetz compliance)
- Digital contract signing with IBAN collection

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
  - Status badges: Neu, Wartet auf ID, Verifiziert, Freigeschaltet
- [x] **Verifications page**
  - View pending verifications
  - Display ID images (base64, no download - DSGVO compliant)
  - Unlock verified employees
  - Delete verification documents
- [x] Task Management System
  - Create tasks with title, website URL, 4-part description
  - Assign tasks to employees
  - View/delete tasks
- [x] **Contract Management**
  - Create employment contracts for employees
  - View contract status (pending/signed)

### Applicant/Employee Flow (100% Complete)
- [x] **Self-Registration with Password**
  - Applicants choose own password during application
  - Can login immediately at `/mitarbeiter/login`
- [x] **Status-Based Access Control**
  - `Neu`: "Bewerbung wird geprüft" page
  - `Akzeptiert`: ID verification upload page (GwG + DSGVO notices)
  - `Verifiziert`: "Wartet auf Freischaltung" page
  - `Freigeschaltet`: Full dashboard access
- [x] **ID Verification Upload**
  - Upload front + back of ID document
  - File validation (JPEG, PNG, WebP, max 5MB)
  - Stored securely, displayed to admin as base64

### Employee Dashboard (100% Complete - UPDATED Feb 2025)
- [x] Secure login at `/mitarbeiter/login`
- [x] Orange/white theme
- [x] Sidebar navigation: Main, Vertrag, Aufträge, Einstellungen, Dokumente
- [x] ~~Auszahlung (Payout)~~ - **REMOVED per user request**
- [x] **Vertrag (Contract) page** - View and sign employment contracts
  - List of pending/signed contracts
  - Digital signature with canvas
  - **IBAN input field for salary payment**
  - PDF download for signed contracts
- [x] Aufträge (Tasks) page - View and manage assigned tasks
- [x] **Einstellungen (Settings)** - Profile, password change, notifications (UI only)
- [x] **Dokumente (Documents)** - Upload, categorize, manage documents (UI only)
- [x] Main dashboard with task overview

---

## Contract Signing Flow

```
┌──────────────┐    Admin creates    ┌─────────────┐    Employee    ┌─────────────┐
│ New Employee │ ──────────────────► │   Pending   │ ─────────────► │   Signed    │
│              │     contract        │  Contract   │  signs + IBAN  │  Contract   │
└──────────────┘                     └─────────────┘                └─────────────┘
                                                                          │
                                                                          ▼
                                                                    PDF Download
                                                                    (includes IBAN)
```

---

## API Endpoints

### Contract Endpoints (NEW)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contracts/create | Create contract for employee (admin) |
| GET | /api/contracts/ | Get all contracts (admin) |
| GET | /api/contracts/my-contracts | Get employee's contracts |
| GET | /api/contracts/{id} | Get contract details |
| POST | /api/contracts/{id}/sign | Sign contract with signature + IBAN |
| GET | /api/contracts/{id}/download | Download signed contract PDF |

### Application/Applicant Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/applications/submit | Submit application with password |
| POST | /api/applications/login | Applicant/employee login |
| GET | /api/applications/status | Get current applicant status |
| POST | /api/applications/verification/upload | Upload ID documents |
| GET | /api/applications/ | Get all applications (admin) |
| POST | /api/applications/{id}/accept | Accept application (admin) |
| POST | /api/applications/{id}/unlock | Unlock verified employee (admin) |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/admin/login | Admin authentication |
| GET | /api/admin/employees | Get all employees |
| POST | /api/admin/tasks | Create task |
| GET | /api/admin/tasks | Get all tasks |
| DELETE | /api/admin/tasks/{id} | Delete task |

### Employee Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employee/tasks | Get assigned tasks |
| PATCH | /api/employee/tasks/{id} | Update task status |

---

## Database Schema

### contracts collection
```javascript
{
  id: "contract-YYYYMMDDHHMMSS-xxxxxx",
  employee_id: "EMP001",
  employee_name: "Max Mitarbeiter",
  employee_email: "mitarbeiter@infometrica.de",
  position: "QA Tester",
  start_date: "2025-03-01",
  salary: "3500",
  working_hours: "40",
  status: "pending" | "signed",
  created_at: ISODate(),
  signed_at: ISODate() | null,
  signature_file: "contract-xxx_signature.png" | null,
  signed_pdf: "contract-xxx_signed.pdf" | null,
  iban: "DE89370400440532013000" | null
}
```

---

## Test Credentials

| Role | Email | Password | Status |
|------|-------|----------|--------|
| Admin | admin@infometrica.de | Admin123! | - |
| Employee | mitarbeiter@infometrica.de | Mitarbeiter123! | Freigeschaltet |

---

## Prioritized Backlog

### P0 - Completed
- [x] Applicant self-registration with password
- [x] Status-based access control
- [x] ID verification upload
- [x] Admin verification management
- [x] Contract signing with IBAN

### P1 - Completed (UI Only - needs backend connection)
- [x] Employee Settings page (profile, password, notifications)
- [x] Employee Documents page (upload/download with categories)

### P2 - Future
- [ ] Email notifications (SMTP integration)
- [ ] Admin Employee Management (CRUD)
- [ ] Connect Settings/Documents pages to backend
- [ ] Employee performance reports

---

## File Structure
```
/app
├── backend/
│   ├── routes/
│   │   ├── contracts.py    # Contract management endpoints
│   │   └── ...
│   ├── uploads/
│   │   ├── contracts/      # Signed PDF storage
│   │   ├── signatures/     # Signature images
│   │   └── verifications/  # ID images
│   └── server.py
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminContracts.jsx    # Contract creation
    │   │   │   └── ...
    │   │   ├── mitarbeiter/
    │   │   │   ├── MitarbeiterVertrag.jsx  # Contract signing + IBAN
    │   │   │   ├── MitarbeiterDokumente.jsx
    │   │   │   ├── MitarbeiterEinstellungen.jsx
    │   │   │   └── ...
    │   │   └── ...
    │   └── components/
    │       └── mitarbeiter/
    │           └── MitarbeiterLayout.jsx  # Updated sidebar (no Auszahlung)
    └── App.js
```

---

## Recent Changes (Feb 2025)
- **REMOVED**: Auszahlung (Payout) page from employee panel
- **ADDED**: IBAN field in contract signing process
- **ADDED**: IBAN stored in database and included in PDF (§4 Bankverbindung)
- **TESTED**: All contract signing flows working correctly

## Last Updated
February 2025 - Contract signing with IBAN implemented and tested
