from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

class Application(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    mobilnummer: str
    geburtsdatum: str
    staatsangehoerigkeit: str
    strasse: str
    postleitzahl: str
    stadt: str
    position: str
    message: Optional[str] = None
    password_hash: str = ""  # Hashed password
    cv_filename: Optional[str] = None
    status: str = "Neu"  # Neu, Akzeptiert, Verifiziert, Freigeschaltet
    verification_front: Optional[str] = None  # ID front image path
    verification_back: Optional[str] = None  # ID back image path
    verified_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    mobilnummer: str
    geburtsdatum: str
    staatsangehoerigkeit: str
    strasse: str
    postleitzahl: str
    stadt: str
    position: str
    message: Optional[str] = None
    password: str  # User-chosen password
    cv_filename: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: str
    name: str
    email: str
    mobilnummer: str
    geburtsdatum: str
    staatsangehoerigkeit: str
    strasse: str
    postleitzahl: str
    stadt: str
    position: str
    message: Optional[str] = None
    cv_filename: Optional[str]
    status: str
    verification_front: Optional[str] = None
    verification_back: Optional[str] = None
    verified_at: Optional[datetime] = None
    created_at: datetime
    quiz_completed: Optional[bool] = None
    quiz_completed_at: Optional[str] = None


class ApplicantLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    applicant: dict
