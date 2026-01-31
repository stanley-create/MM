from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class RecordBase(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    date: datetime = Field(default_factory=datetime.now)
    is_income: bool = False
    carbon_kg: float = 0.0

class RecordCreate(RecordBase):
    pass

class Record(RecordBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class RpgState(BaseModel):
    user_id: str
    level: int = 1
    xp: int = 0
    xp_to_next_level: int = 1000
    map_progress: float = 0.0 # 0.0 to 1.0
    title: str = "初級冒險者"
    total_carbon_saved: float = 0.0

class Task(BaseModel):
    id: str
    description: str
    target_value: float
    current_value: float = 0.0
    reward_xp: int
    expiry: datetime

class AnalysisReport(BaseModel):
    summary: str
    rpg_advice: str
    carbon_analysis: str
    category_breakdown: dict
    prediction_next_month: float
