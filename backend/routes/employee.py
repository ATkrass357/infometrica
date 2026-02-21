from fastapi import APIRouter, HTTPException, Depends, Header, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.employee import EmployeeLogin, TokenResponse, EmployeeResponse, Task, TaskCreate, TaskUpdate
from utils.auth import verify_password, create_access_token, decode_token, get_password_hash
from datetime import timedelta, datetime
from typing import List, Optional
from pydantic import BaseModel
import os
import uuid

router = APIRouter(prefix="/api/employee", tags=["employee"])

# Directory for employee documents
DOCUMENTS_DIR = "/app/backend/uploads/documents"
os.makedirs(DOCUMENTS_DIR, exist_ok=True)

# Models for settings and documents
class ProfileUpdate(BaseModel):
    phone: Optional[str] = None
    address: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class NotificationSettings(BaseModel):
    email_notifications: bool = True
    task_reminders: bool = True
    payout_notifications: bool = True

class DocumentResponse(BaseModel):
    id: str
    name: str
    type: str
    category: str
    size: str
    uploaded_at: str
    status: str

router = APIRouter(prefix="/api/employee", tags=["employee"])

def get_db():
    from server import db
    return db

@router.post("/login", response_model=TokenResponse)
async def employee_login(credentials: EmployeeLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Employee login endpoint"""
    employee = await db.employees.find_one({"email": credentials.email})
    
    if not employee:
        raise HTTPException(status_code=401, detail="Ungültige Anmeldedaten")
    
    if not employee.get("is_active", True):
        raise HTTPException(status_code=401, detail="Konto ist deaktiviert")
    
    if not verify_password(credentials.password, employee["password_hash"]):
        raise HTTPException(status_code=401, detail="Ungültige Anmeldedaten")
    
    # Update last login
    await db.employees.update_one(
        {"_id": employee["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Create access token (30 minutes)
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": employee["email"], "id": employee["id"], "role": "employee"},
        expires_delta=access_token_expires
    )
    
    employee_response = EmployeeResponse(
        id=employee["id"],
        email=employee["email"],
        name=employee["name"],
        position=employee["position"],
        department=employee.get("department", "Testing"),
        employee_number=employee["employee_number"]
    )
    
    return TokenResponse(
        access_token=access_token,
        employee=employee_response
    )

@router.get("/verify")
async def verify_employee_token(authorization: str = Header(None)):
    """Verify if employee token is valid"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine gültige Autorisierung")
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload or payload.get("role") != "employee":
        raise HTTPException(status_code=401, detail="Ungültiger oder abgelaufener Token")
    
    return {"valid": True, "email": payload.get("sub"), "role": payload.get("role")}

@router.get("/tasks", response_model=List[Task])
async def get_employee_tasks(
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get tasks assigned to the employee"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Ungültiger Token")
    
    employee_id = payload.get("id")
    
    # Get tasks assigned to this employee
    tasks = await db.tasks.find({"assigned_to": employee_id}).sort("created_at", -1).to_list(100)
    
    return [Task(**task) for task in tasks]

@router.patch("/tasks/{task_id}")
async def update_task_status(
    task_id: str,
    update: TaskUpdate,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update task status (employee can only update their own tasks)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Ungültiger Token")
    
    employee_id = payload.get("id")
    
    # Check if task belongs to this employee
    task = await db.tasks.find_one({"id": task_id, "assigned_to": employee_id})
    
    if not task:
        raise HTTPException(status_code=404, detail="Aufgabe nicht gefunden")
    
    # Update task
    update_data = update.dict(exclude_unset=True)
    
    if update_data.get("status") == "Abgeschlossen":
        update_data["completed_at"] = datetime.utcnow()
    
    await db.tasks.update_one(
        {"id": task_id},
        {"$set": update_data}
    )
    
    return {"message": "Aufgabe aktualisiert"}

@router.get("/stats")
async def get_employee_stats(
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get employee statistics"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Ungültiger Token")
    
    employee_id = payload.get("id")
    
    # Count tasks by status
    total_tasks = await db.tasks.count_documents({"assigned_to": employee_id})
    open_tasks = await db.tasks.count_documents({"assigned_to": employee_id, "status": "Offen"})
    in_progress = await db.tasks.count_documents({"assigned_to": employee_id, "status": "In Bearbeitung"})
    completed = await db.tasks.count_documents({"assigned_to": employee_id, "status": "Abgeschlossen"})
    
    return {
        "total_tasks": total_tasks,
        "open_tasks": open_tasks,
        "in_progress": in_progress,
        "completed": completed
    }

@router.post("/init-employee")
async def initialize_employee(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Initialize test employee - REMOVE IN PRODUCTION"""
    existing = await db.employees.find_one({"email": "mitarbeiter@infometrica.de"})
    
    if existing:
        return {"message": "Mitarbeiter bereits vorhanden"}
    
    employee_data = {
        "id": "emp-001",
        "email": "mitarbeiter@infometrica.de",
        "password_hash": get_password_hash("Mitarbeiter123!"),
        "name": "Max Mitarbeiter",
        "position": "QA Tester",
        "department": "Testing",
        "employee_number": "EMP001",
        "phone": "+49 170 1234567",
        "created_at": datetime.utcnow(),
        "last_login": None,
        "is_active": True
    }
    
    await db.employees.insert_one(employee_data)
    
    return {
        "message": "Test-Mitarbeiter erstellt",
        "email": "mitarbeiter@infometrica.de",
        "password": "Mitarbeiter123!"
    }
