from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime


# ── Auth ──────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: UUID
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ── Wardrobe ──────────────────────────────────────────
class WardrobeItemCreate(BaseModel):
    name: Optional[str] = None
    category: str
    color: Optional[str] = None
    style_tags: Optional[List[str]] = []
    season: Optional[str] = None
    image_url: Optional[str] = None


class WardrobeItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    style_tags: Optional[List[str]] = None
    season: Optional[str] = None


class WardrobeItemOut(BaseModel):
    id: UUID
    user_id: UUID
    name: Optional[str]
    category: str
    color: Optional[str]
    style_tags: List[str]
    season: Optional[str]
    image_url: Optional[str]
    wear_count: int
    last_worn_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Chat ──────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    image_url: Optional[str] = None


class ChatMessageOut(BaseModel):
    id: UUID
    role: str
    content: str
    image_url: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatResponse(BaseModel):
    reply: str
    message: ChatMessageOut
