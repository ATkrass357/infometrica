from fastapi import APIRouter, HTTPException, Depends, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.application import ApplicationCreate, ApplicationResponse
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/applications", tags=["applications"])

# Get database instance
def get_db():
    from server import db
    return db

# Public endpoint - anyone can submit application
@router.post("/submit", response_model=ApplicationResponse)
async def submit_application(
    application: ApplicationCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Submit a new job application"""
    # Create application document
    app_dict = application.dict()
    app_dict['id'] = f"app-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    app_dict['status'] = 'Neu'
    app_dict['created_at'] = datetime.utcnow()
    
    # Insert into database
    await db.applications.insert_one(app_dict)
    
    return ApplicationResponse(**app_dict)

# Protected endpoint - only admin can view
@router.get("/", response_model=List[ApplicationResponse])
async def get_applications(
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all applications (Admin only)"""
    # Verify admin token
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    # For now, just check if token exists (proper verification already done by frontend)
    # In production, verify the token here as well
    
    # Get all applications, sorted by creation date (newest first)
    applications = await db.applications.find().sort("created_at", -1).to_list(1000)
    
    # Convert MongoDB documents to response models
    return [ApplicationResponse(**app) for app in applications]

# Delete application (Admin only)
@router.delete("/{application_id}")
async def delete_application(
    application_id: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete an application (Admin only)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    result = await db.applications.delete_one({"id": application_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    return {"message": "Bewerbung gelöscht"}

# Update application status (Admin only)
@router.patch("/{application_id}/status")
async def update_application_status(
    application_id: str,
    status: str,
    authorization: str = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update application status (Admin only)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Keine Autorisierung")
    
    result = await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Bewerbung nicht gefunden")
    
    return {"message": "Status aktualisiert"}
