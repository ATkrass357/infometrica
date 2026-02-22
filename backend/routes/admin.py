from fastapi import APIRouter, HTTPException, Depends, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.admin import AdminLogin, TokenResponse, AdminResponse
from models.employee import Task, TaskCreate
from utils.auth import verify_password, create_access_token, decode_token, get_password_hash
from datetime import timedelta, datetime
from typing import List
import uuid

# Import email service
from services.email_service import send_new_task_notification

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Get database instance - will be injected
def get_db():
    from server import db
    return db

@router.post("/login", response_model=TokenResponse)
async def admin_login(credentials: AdminLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Admin login endpoint"""
    # Find admin by email
    admin = await db.admins.find_one({"email": credentials.email})
    
    if not admin:
        raise HTTPException(status_code=401, detail="Ungültige Anmeldedaten")
    
    # Verify password
    if not verify_password(credentials.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Ungültige Anmeldedaten")
    
    # Update last login
    await db.admins.update_one(
        {"_id": admin["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Create access token (30 minutes)
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": admin["email"], "id": admin["id"], "role": admin["role"]},
        expires_delta=access_token_expires
    )
    
    admin_response = AdminResponse(
        id=admin["id"],
        email=admin["email"],
        name=admin["name"],
        role=admin["role"]
    )
    
    return TokenResponse(
        access_token=access_token,
        admin=admin_response
    )

@router.get("/verify")
async def verify_token(authorization: str = Header(None)):
    """Verify if token is valid"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine gültige Autorisierung")
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Ungültiger oder abgelaufener Token")
    
    return {"valid": True, "email": payload.get("sub"), "role": payload.get("role")}

@router.post("/init-admin")
async def initialize_admin(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Initialize test admin user - REMOVE IN PRODUCTION"""
    # Check if admin already exists
    existing_admin = await db.admins.find_one({"email": "admin@infometrica.de"})
    
    if existing_admin:
        return {"message": "Admin bereits vorhanden"}
    
    # Create test admin
    admin_data = {
        "id": "admin-001",
        "email": "admin@infometrica.de",
        "password_hash": get_password_hash("Inf0m3tr!ca#2025Sec"),
        "name": "Administrator",
        "role": "admin",
        "created_at": datetime.utcnow(),
        "last_login": None
    }
    
    await db.admins.insert_one(admin_data)
    
    return {
        "message": "Test-Admin erstellt",
        "email": "admin@infometrica.de"
    }

# ========== TASK MANAGEMENT ==========

def verify_admin_token(authorization: str = Header(None)):
    """Helper to verify admin token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine gültige Autorisierung")
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Ungültiger oder abgelaufener Token")
    
    return payload

@router.get("/employees")
async def get_employees(
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all employees for task assignment dropdown"""
    verify_admin_token(authorization)
    
    employees = await db.employees.find(
        {"is_active": True},
        {"_id": 0, "id": 1, "name": 1, "email": 1, "position": 1, "department": 1}
    ).to_list(100)
    
    return employees

@router.post("/tasks", response_model=Task)
async def create_task(
    task_data: TaskCreate,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new task and assign to employee"""
    admin_payload = verify_admin_token(authorization)
    
    # Get employee info
    employee = await db.employees.find_one({"id": task_data.assigned_to})
    if not employee:
        raise HTTPException(status_code=404, detail="Mitarbeiter nicht gefunden")
    
    # Create task
    task = Task(
        id=str(uuid.uuid4()),
        title=task_data.title,
        website=task_data.website,
        einleitung=task_data.einleitung,
        schritt1=task_data.schritt1,
        schritt2=task_data.schritt2,
        schritt3=task_data.schritt3,
        assigned_to=task_data.assigned_to,
        assigned_to_name=employee["name"],
        assigned_by=admin_payload.get("id"),
        priority=task_data.priority,
        due_date=task_data.due_date,
        status="Offen",
        created_at=datetime.utcnow()
    )
    
    # Insert into database
    task_dict = task.model_dump()
    task_dict["created_at"] = task_dict["created_at"].isoformat()
    if task_dict.get("completed_at"):
        task_dict["completed_at"] = task_dict["completed_at"].isoformat()
    
    await db.tasks.insert_one(task_dict)
    
    # Send email notification to employee
    await send_new_task_notification(
        to_email=employee["email"],
        employee_name=employee["name"],
        task_title=task_data.title,
        due_date=task_data.due_date
    )
    
    return task

@router.get("/tasks", response_model=List[Task])
async def get_all_tasks(
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all tasks (admin view)"""
    verify_admin_token(authorization)
    
    tasks = await db.tasks.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    # Convert datetime strings back
    for task in tasks:
        if isinstance(task.get("created_at"), str):
            task["created_at"] = datetime.fromisoformat(task["created_at"])
        if task.get("completed_at") and isinstance(task["completed_at"], str):
            task["completed_at"] = datetime.fromisoformat(task["completed_at"])
    
    return tasks

@router.delete("/tasks/{task_id}")
async def delete_task(
    task_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a task"""
    verify_admin_token(authorization)
    
    result = await db.tasks.delete_one({"id": task_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Aufgabe nicht gefunden")
    
    return {"message": "Aufgabe gelöscht"}


@router.put("/tasks/{task_id}/credentials")
async def update_task_credentials(
    task_id: str,
    data: dict,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update task test credentials"""
    verify_admin_token(authorization)
    
    # Find the task
    task = await db.tasks.find_one({"id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Aufgabe nicht gefunden")
    
    # Update only credential fields
    update_data = {}
    if "test_ident_link" in data:
        update_data["test_ident_link"] = data["test_ident_link"]
    if "test_login_email" in data:
        update_data["test_login_email"] = data["test_login_email"]
    if "test_login_password" in data:
        update_data["test_login_password"] = data["test_login_password"]
    
    if update_data:
        await db.tasks.update_one(
            {"id": task_id},
            {"$set": update_data}
        )
    
    return {"message": "Test-Zugangsdaten aktualisiert"}


@router.put("/tasks/{task_id}/assign")
async def assign_task(
    task_id: str,
    data: dict,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Assign a task to an employee with optional test credentials"""
    verify_admin_token(authorization)
    
    # Find the task
    task = await db.tasks.find_one({"id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Aufgabe nicht gefunden")
    
    assigned_to = data.get("assigned_to")
    if not assigned_to:
        raise HTTPException(status_code=400, detail="Mitarbeiter muss ausgewählt werden")
    
    # Get employee name
    employee = await db.employees.find_one({"id": assigned_to})
    assigned_to_name = employee.get("name") if employee else "Unbekannt"
    
    # Prepare update data
    update_data = {
        "assigned_to": assigned_to,
        "assigned_to_name": assigned_to_name,
        "test_ident_link": data.get("test_ident_link", ""),
        "test_login_email": data.get("test_login_email", ""),
        "test_login_password": data.get("test_login_password", "")
    }
    
    await db.tasks.update_one(
        {"id": task_id},
        {"$set": update_data}
    )
    
    return {"message": "Aufgabe zugewiesen", "assigned_to_name": assigned_to_name}


# ========== DOCUMENT MANAGEMENT ==========

@router.get("/documents")
async def get_all_documents(
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all employee documents (admin view)"""
    verify_admin_token(authorization)
    
    # Get all documents
    documents = await db.employee_documents.find({}, {"_id": 0}).sort("uploaded_at", -1).to_list(500)
    
    # Get employee names for each document
    for doc in documents:
        employee = await db.employees.find_one(
            {"id": doc.get("employee_id")},
            {"_id": 0, "name": 1, "email": 1}
        )
        if employee:
            doc["employee_name"] = employee.get("name", "Unbekannt")
            doc["employee_email"] = employee.get("email", "")
        else:
            # Try to find in applications (for applicants)
            app = await db.applications.find_one(
                {"id": doc.get("employee_id")},
                {"_id": 0, "name": 1, "email": 1}
            )
            if app:
                doc["employee_name"] = app.get("name", "Unbekannt")
                doc["employee_email"] = app.get("email", "")
            else:
                doc["employee_name"] = "Unbekannt"
                doc["employee_email"] = ""
        
        # Format uploaded_at
        if isinstance(doc.get("uploaded_at"), datetime):
            doc["uploaded_at"] = doc["uploaded_at"].strftime("%Y-%m-%d %H:%M")
    
    return documents


@router.put("/documents/{doc_id}/approve")
async def approve_document(
    doc_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Approve a document"""
    verify_admin_token(authorization)
    
    result = await db.employee_documents.update_one(
        {"id": doc_id},
        {"$set": {"status": "approved", "approved_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Dokument nicht gefunden")
    
    return {"message": "Dokument bestätigt", "status": "approved"}


@router.put("/documents/{doc_id}/reject")
async def reject_document(
    doc_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Reject a document"""
    verify_admin_token(authorization)
    
    result = await db.employee_documents.update_one(
        {"id": doc_id},
        {"$set": {"status": "rejected", "rejected_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Dokument nicht gefunden")
    
    return {"message": "Dokument abgelehnt", "status": "rejected"}


@router.get("/documents/{doc_id}/download")
async def admin_download_document(
    doc_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Download a document (admin)"""
    from fastapi.responses import FileResponse
    import os
    
    verify_admin_token(authorization)
    
    document = await db.employee_documents.find_one({"id": doc_id})
    
    if not document:
        raise HTTPException(status_code=404, detail="Dokument nicht gefunden")
    
    filepath = f"/app/backend/uploads/documents/{document['filename']}"
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")
    
    return FileResponse(
        filepath,
        filename=document["name"]
    )


@router.delete("/documents/{doc_id}")
async def admin_delete_document(
    doc_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a document (admin)"""
    import os
    
    verify_admin_token(authorization)
    
    document = await db.employee_documents.find_one({"id": doc_id})
    
    if not document:
        raise HTTPException(status_code=404, detail="Dokument nicht gefunden")
    
    # Delete file
    filepath = f"/app/backend/uploads/documents/{document['filename']}"
    if os.path.exists(filepath):
        os.remove(filepath)
    
    # Delete from database
    await db.employee_documents.delete_one({"id": doc_id})
    
    return {"message": "Dokument gelöscht"}
