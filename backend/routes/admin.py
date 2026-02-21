from fastapi import APIRouter, HTTPException, Depends, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.admin import AdminLogin, TokenResponse, AdminResponse
from utils.auth import verify_password, create_access_token, decode_token, get_password_hash
from datetime import timedelta, datetime
import os

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
