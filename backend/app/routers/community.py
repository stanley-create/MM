from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import Guild
from app.services.firebase import get_db
import uuid

router = APIRouter(prefix="/community", tags=["community"])

@router.post("/join", response_model=Guild)
async def join_guild(guild_id: str, db=Depends(get_db)):
    # Mock join logic
    guild_ref = db.collection("guilds").document(guild_id)
    guild_doc = guild_ref.get()
    
    if not guild_doc.exists:
        # Create dummy if not exists for demo
        new_guild = {
            "id": guild_id,
            "name": "Eco Warriors",
            "description": "Fighting for a greener earth.",
            "members": ["current_user"],
            "total_carbon_saved": 120.5
        }
        guild_ref.set(new_guild)
        return Guild(**new_guild)
    
    guild_data = guild_doc.to_dict()
    if "current_user" not in guild_data["members"]:
        guild_data["members"].append("current_user")
        guild_ref.update({"members": guild_data["members"]})
        
    return Guild(**guild_data)

@router.get("/", response_model=list[Guild])
async def list_guilds(db=Depends(get_db)):
    # Return mock guilds
    return [
        Guild(id="g1", name="Taipei Adventurers", description="Local heroes.", members=[], total_carbon_saved=500.0),
        Guild(id="g2", name="Green Knights", description="Elite accounting squad.", members=[], total_carbon_saved=1200.0)
    ]
