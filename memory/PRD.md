# Precision Labs - App Testing Agency Platform

## Original Problem Statement
Build a full-stack application for the app testing agency "Precision Labs" (formerly "Benke IT Solutions") with:
1. **Public Website** - German language, green/white theme (ultra-modern design)
2. **Admin Panel** - Tokyo Night theme for managing applications, tasks, contracts, and virtual phone numbers
3. **Employee Dashboard** - Orange/white theme for viewing assigned tasks, signing contracts, and viewing SMS verification codes

## Core Requirements
- German language throughout
- Role-based authentication (Admin, Applicant, Employee)
- Task management with 4-part descriptions and multi-person assignment
- Application tracking with ID verification (Geldwaschegesetz compliance)
- Digital contract signing with IBAN collection
- Minijob employment contracts (603 EUR/month)
- SMS notifications via smsroute.cc
- Virtual phone numbers via Anosim.net for testing

## Tech Stack
- **Frontend**: React, React Router, TailwindCSS, shadcn/ui, react-signature-canvas
- **Backend**: FastAPI, MongoDB (motor async), Pydantic, ReportLab (PDF generation)
- **Authentication**: JWT with role-based access control
- **SMS**: smsroute.cc for notifications
- **Virtual Numbers**: Anosim.net for SMS verification codes

---

## What's Been Implemented

### Public Website (100% Complete)
- [x] Home page with hero section (green/white ultra-modern design)
- [x] Unternehmen (About) page
- [x] Dienstleistungen (Services) page
- [x] Karriere (Career) page with application form + password selection
- [x] Kontakt (Contact) page
- [x] Impressum (Imprint) page - Precision Labs branding
- [x] Datenschutz (Privacy Policy) page
- [x] Logo and branding - **Precision Labs**
- [x] Footer (Emergent badge removed as requested)

### Admin Panel (100% Complete)
- [x] Secure login at `/admin/login`
- [x] Tokyo Night theme
- [x] Dashboard overview
- [x] Applications management with bulk acceptance
- [x] Verifications page with unlock functionality
- [x] Task Management with multi-person assignment
- [x] Contract Management
- [x] Document Management
- [x] **Anosim Number Management** at `/admin/anosim` (NEW - March 2026)

### Employee Dashboard (100% Complete)
- [x] Secure login at `/mitarbeiter/login`
- [x] Orange/white theme
- [x] Contract signing with IBAN and signature (before ID verification)
- [x] Task viewing with status management
- [x] **SMS Verification Panel** - Shows when task is "In Bearbeitung" (NEW - March 2026)
- [x] Settings page
- [x] Documents page

### SMS Integration (100% Complete)
- [x] smsroute.cc integration for transactional SMS
- [x] Automated notifications for:
  - Application acceptance
  - Contract signed
  - ID verification complete
  - Account unlocked
  - Task assignment

### Anosim.net Integration (100% Complete - March 2026)
- [x] Admin can assign virtual phone numbers to employees
- [x] Admin can view/remove number assignments
- [x] Employees see SMS panel only when task is "In Bearbeitung"
- [x] Auto-refresh and manual refresh of incoming SMS
- [x] Automatic verification code extraction from SMS text

---

## Onboarding Flow (Updated)
1. User applies via Karriere page
2. Admin accepts application
3. **Employee signs contract** (NEW: Contract before ID)
4. Employee uploads ID documents
5. Admin verifies documents and unlocks account
6. Employee can now access full dashboard and tasks

---

## Test Credentials

| Role | Email | Password | Status |
|------|-------|----------|--------|
| Admin | admin@precision-labs.de | Inf0m3tr!ca#2025Sec | Active |
| Employee | mitarbeiter@precision-labs.de | Mitarbeiter123! | Freigeschaltet |

**Note:** Existing database users may still have old email addresses (e.g., admin@benke-it.de, mitarbeiter@infometrica.de). The init endpoints create users with the new @precision-labs.de emails.

---

## API Endpoints

### Application Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/apply | Submit new application |
| POST | /api/applications/login | Applicant/Employee login |
| GET | /api/applications | Get all applications (admin) |
| POST | /api/applications/{id}/accept | Accept single application |
| POST | /api/applications/bulk-accept | Accept multiple applications |
| POST | /api/applications/sign-contract | Sign employment contract |
| POST | /api/applications/{id}/unlock | Unlock verified employee |

### Task Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/tasks | Get all tasks |
| POST | /api/admin/tasks | Create new task |
| PUT | /api/admin/tasks/{id}/assign-multiple | Assign to multiple employees |
| DELETE | /api/admin/tasks/{id} | Delete task |

### Contract Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contracts/create | Create contract |
| GET | /api/contracts/ | Get all contracts |
| GET | /api/contracts/my-contracts | Get employee contracts |
| POST | /api/contracts/{id}/sign | Sign contract |
| GET | /api/contracts/{id}/download | Download PDF |

### Employee Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employee/profile | Get profile |
| PUT | /api/employee/profile | Update profile |
| POST | /api/employee/change-password | Change password |
| GET | /api/employee/documents | Get documents |
| POST | /api/employee/documents/upload | Upload document |

### Anosim Endpoints (NEW - March 2026)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/anosim/assignments | Get all number assignments (admin) |
| POST | /api/anosim/assign | Assign number to employee (admin) |
| POST | /api/anosim/unassign | Remove number from employee (admin) |
| GET | /api/anosim/my-number | Get assigned number (employee) |
| GET | /api/anosim/my-sms | Get SMS for assigned number (employee) |
| GET | /api/anosim/latest-code | Get latest verification code (employee) |

---

## File Structure
```
/app
├── backend/
│   ├── routes/
│   │   ├── admin.py
│   │   ├── applications.py
│   │   ├── contracts.py
│   │   ├── employee.py
│   │   └── anosim.py (NEW)
│   ├── services/
│   │   ├── email_service.py
│   │   ├── sms_service.py
│   │   └── anosim_service.py (NEW)
│   ├── uploads/
│   └── server.py
└── frontend/
    └── src/
        ├── components/
        │   ├── SMSPanel.jsx (NEW)
        │   ├── admin/
        │   └── mitarbeiter/
        ├── pages/
        │   ├── admin/
        │   │   ├── AdminAnosim.jsx (NEW)
        │   │   └── ...
        │   ├── mitarbeiter/
        │   └── public/
        └── App.js
```

---

## Upcoming Tasks

### P1 - High Priority
- [ ] Full employee management module in admin panel (CRUD operations)

### P2 - Medium Priority
- [ ] Dashboard analytics

### P3 - Future Enhancements
- [ ] Multi-language support

---

## Completed Tasks (March 2026)
- [x] Anosim.net API integration
- [x] Admin page for managing virtual phone numbers
- [x] SMS Panel in employee task view
- [x] Automatic code extraction from SMS
- [x] Auto-refresh functionality for SMS

---

## Deployment Notes
- **WICHTIG:** `bcrypt` muss auf Version `4.0.1` bleiben (nicht 4.1+), weil `passlib` mit neueren Versionen inkompatibel ist.
- Admin-Eintrag in der DB muss das Feld `password_hash` haben (nicht `password`), plus `id` und `role`.
- Bei Neuinstallation: `pip install -r requirements.txt` und dann `curl -X POST https://precision-labs.de/api/admin/init-admin`

## Mobile Responsive (April 2026)
- [x] Admin Login - responsive
- [x] Admin Dashboard - Cards stacking, responsive headings
- [x] Admin Applications - Table → Mobile Cards (hidden md:block / md:hidden pattern)
- [x] Admin Tasks - Badge wrapping, responsive credentials grid
- [x] Admin Contracts - Responsive card layout
- [x] Admin Verifications - Flex-col on mobile, responsive modal footer
- [x] Admin Documents - Table → Mobile Cards
- [x] Admin Email Inbox - Stats grid responsive (grid-cols-1 sm:grid-cols-3), Table → Mobile Cards
- [x] Admin Anosim - Stats/number cards responsive
- [x] Mobile sidebar with hamburger menu

## Last Updated
April 2026 - Admin Panel Mobile Optimierung abgeschlossen (100% Testrate).
