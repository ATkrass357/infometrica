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
    message: str
    cv_filename: Optional[str] = None
    status: str = "Neu"
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
    message: str
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
    message: str
    cv_filename: Optional[str]
    status: str
    created_at: datetime
