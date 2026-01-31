from pydantic import BaseModel
from app.models.schemas import RpgState, Record

class DashboardState(BaseModel):
    rpg: RpgState
    today_spend: float = 0.0
    today_carbon: float = 0.0
    recent_records: list[Record] = []
