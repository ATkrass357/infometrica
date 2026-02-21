# Infometrica - App Testing Agency Platform

## Original Problem Statement
Build a full-stack application for the app testing agency "Infometrica" with:
1. **Public Website** - German language, white/orange theme
2. **Admin Panel** - Tokyo Night theme for managing applications and tasks
3. **Employee Dashboard** - Orange/white theme for viewing assigned tasks

## Core Requirements
- German language throughout
- Role-based authentication (Admin, Applicant, Employee)
- Task management with 4-part descriptions
- Application tracking with ID verification (Geldwäschegesetz compliance)

## Tech Stack
- **Frontend**: React, React Router, TailwindCSS, shadcn/ui
- **Backend**: FastAPI, MongoDB (motor async), Pydantic
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
- [x] **Verifications page** (NEW - Dec 2025)
  - View pending verifications
  - Display ID images (base64, no download - DSGVO compliant)
  - Unlock verified employees
  - Delete verification documents
- [x] Task Management System
  - Create tasks with title, website URL, 4-part description
  - Assign tasks to employees
  - View/delete tasks

### Applicant/Employee Flow (100% Complete - NEW)
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

### Employee Dashboard (Core Complete)
- [x] Secure login at `/mitarbeiter/login`
- [x] Orange/white theme
- [x] Sidebar navigation
- [x] Aufträge (Tasks) page - View and manage assigned tasks
- [ ] Main dashboard (placeholder)
- [ ] Einstellungen (Settings) - placeholder
- [ ] Dokumente (Documents) - placeholder
- [ ] Auszahlung (Payout) - placeholder

---

## Status Flow

```
┌─────────┐     Admin      ┌────────────┐    Uploads ID    ┌────────────┐    Admin     ┌───────────────┐
│   Neu   │ ──────────────►│ Akzeptiert │ ────────────────►│ Verifiziert│ ────────────►│Freigeschaltet │
│(Pending)│    accepts     │ (Needs ID) │   front+back     │(Waiting)   │   unlocks    │(Full Access)  │
└─────────┘                └────────────┘                  └────────────┘              └───────────────┘
```

---

## API Endpoints

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
| GET | /api/applications/verification/{id}/{side} | Get ID image as base64 (admin) |
| DELETE | /api/applications/verification/{id} | Delete ID documents (admin) |
| DELETE | /api/applications/{id} | Delete application (admin) |

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

## Test Credentials

| Role | Email | Password | Status |
|------|-------|----------|--------|
| Admin | admin@infometrica.de | Admin123! | - |
| Applicant (Neu) | pending-test@example.com | PendingTest123! | Neu |
| Applicant (Akzeptiert) | anna.schmidt@example.com | TestPass123! | Akzeptiert |

---

## Prioritized Backlog

### P0 - Completed
- [x] Applicant self-registration with password
- [x] Status-based access control
- [x] ID verification upload
- [x] Admin verification management

### P1 - Next Up
- [ ] Employee Main Dashboard with statistics
- [ ] Employee Settings page
- [ ] Employee Documents page (upload/download)
- [ ] Employee Payout page

### P2 - Future
- [ ] Email notifications (SMTP integration)
- [ ] Admin Employee Management (CRUD)
- [ ] Document signing integration (DocuSign)
- [ ] Employee performance reports

---

## File Structure
```
/app
├── backend/
│   ├── routes/
│   │   ├── admin.py
│   │   ├── employee.py
│   │   └── applications.py  # All applicant/verification endpoints
│   ├── models/
│   │   ├── admin.py
│   │   ├── employee.py
│   │   └── application.py   # Updated with password_hash, verification fields
│   ├── uploads/
│   │   └── verifications/   # ID images stored here
│   └── server.py
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminApplications.jsx
    │   │   │   ├── AdminVerifications.jsx  # NEW
    │   │   │   └── AdminTasks.jsx
    │   │   ├── mitarbeiter/
    │   │   │   ├── MitarbeiterLogin.jsx
    │   │   │   ├── MitarbeiterPending.jsx      # NEW - Status Neu
    │   │   │   ├── MitarbeiterVerification.jsx # NEW - Status Akzeptiert
    │   │   │   ├── MitarbeiterAwaitingApproval.jsx # NEW - Status Verifiziert
    │   │   │   └── MitarbeiterAuftrage.jsx
    │   │   └── Karriere.jsx  # Updated with password fields
    │   └── components/
    │       └── mitarbeiter/
    │           ├── MitarbeiterLayout.jsx    # Updated for status routing
    │           └── ProtectedEmployeeRoute.jsx # Updated for dual auth
    └── App.js
```

---

## Last Updated
December 2025 - Applicant self-registration & ID verification flow implemented (100% test pass rate)
