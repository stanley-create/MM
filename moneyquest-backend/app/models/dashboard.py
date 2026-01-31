from pydantic import BaseModel
from typing import Optional
from app.models.schemas import RpgState

class DashboardState(BaseModel):
    rpg: RpgState
    today_spend: float = 0.0
    today_carbon: float = 0.0
