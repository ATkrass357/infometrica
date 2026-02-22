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
        "password_hash": get_password_hash("Admin123!"),
        "name": "Administrator",
        "role": "admin",
        "created_at": datetime.utcnow(),
        "last_login": None
    }
    
    await db.admins.insert_one(admin_data)
    
    return {
        "message": "Test-Admin erstellt",
        "email": "admin@infometrica.de",
        "password": "Admin123!"
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
