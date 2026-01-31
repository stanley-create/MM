from fastapi import APIRouter
from app.models.schemas import Quest
from datetime import datetime, timedelta

router = APIRouter(prefix="/rpg", tags=["rpg"])

@router.get("/quests", response_model=list[Quest])
async def get_daily_quests():
    # Mock generation of quests
    return [
        Quest(
            id="q1",
            title="Green Commute",
            description="Log a transport expense with low carbon.",
            reward_exp=100,
            deadline=datetime.utcnow() + timedelta(days=1),
            target=1
        ),
        Quest(
            id="q2",
            title="Thrifty Wizard",
            description="Log 3 expenses under $100.",
            reward_exp=150,
            deadline=datetime.utcnow() + timedelta(days=1),
            target=3
        )
    ]
