from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"

class UserBase(BaseModel):
    display_name: str
    email: str
    avatar_id: Optional[str] = "default_npc"
    
class UserCreate(UserBase):
    uid: str

class User(UserBase):
    uid: str
    level: int = 1
    current_exp: int = 0
    total_carbon_saved: float = 0.0
    guild_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RecordCreate(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    transaction_type: TransactionType = TransactionType.EXPENSE
    photo_url: Optional[str] = None
    is_electronic_payment: bool = False

class Record(RecordCreate):
    id: str
    user_id: str
    carbon_footprint: float = 0.0
    exp_gained: int = 0
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Quest(BaseModel):
    id: str
    title: str
    description: str
    reward_exp: int
    deadline: datetime
    is_completed: bool = False
    progress: int = 0
    target: int = 1

class Guild(BaseModel):
    id: str
    name: str
    description: str
    members: List[str] = []
    total_carbon_saved: float = 0.0

class AnalysisRequest(BaseModel):
    user_id: str
    days: int = 30

class AnalysisResponse(BaseModel):
    summary: str
    prediction: str
    graph_data: List[dict]

class RPGUpdate(BaseModel):
    """Response model for RPG updates (leveling, exp gains)"""
    new_level: int
    current_exp: int
    message: str
    npc_reaction: str  # URL or ID of the reaction asset
