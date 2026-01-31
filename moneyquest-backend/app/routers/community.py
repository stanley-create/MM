from fastapi import APIRouter, Header, Depends
from app.models.schemas import Guild
from app.services.firebase import get_db

router = APIRouter()

def get_db_dep():
    return get_db()

@router.post("/join/{guild_id}", response_model=Guild)
async def join_guild(guild_id: str, x_user_id: str = Header(...), db=Depends(get_db_dep)):
    guild_ref = db.collection("guilds").document(guild_id)
    guild_doc = guild_ref.get()
    
    if not guild_doc.exists:
        # Create dummy if not exists for demo
        new_guild = {
            "id": guild_id,
            "name": "Eco Warriors",
            "description": "Fighting for a greener earth.",
            "members": [x_user_id],  # Use actual user ID
            "total_carbon_saved": 120.5
        }
        guild_ref.set(new_guild)
        return Guild(**new_guild)
    
    guild_data = guild_doc.to_dict()
    # Check if members list exists
    if "members" not in guild_data:
        guild_data["members"] = []

    if x_user_id not in guild_data["members"]:
        guild_data["members"].append(x_user_id)
        guild_ref.update({"members": guild_data["members"]})
        
    return Guild(**guild_data)

@router.get("/", response_model=list[Guild])
async def list_guilds(db=Depends(get_db_dep)):
    # In a real app, query from DB. returning mocks for now
    return [
        Guild(id="g1", name="Taipei Adventurers", description="Local heroes.", members=[], total_carbon_saved=500.0),
        Guild(id="g2", name="Green Knights", description="Elite accounting squad.", members=[], total_carbon_saved=1200.0)
    ]
