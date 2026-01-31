from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import Record, RecordCreate, RPGUpdate, User
from app.services.rpg_logic import calculate_exp, check_level_up, get_npc_reaction
from app.services.carbon import estimate_carbon_footprint, get_carbon_advice
from app.services.firebase import get_db
from datetime import datetime
import uuid

router = APIRouter(prefix="/records", tags=["records"])

# Helper to get user (Mocked for now, usually from JWT)
def get_current_user_id():
    return "test_user_id" 

@router.post("/", response_model=RPGUpdate)
async def create_record(record_in: RecordCreate, db=Depends(get_db)):
    user_id = get_current_user_id()
    
    # 1. Calculate Carbon & Exp
    carbon = estimate_carbon_footprint(record_in.amount, record_in.category)
    exp_gain = calculate_exp(record_in.amount, 1) # simple count=1 for now
    
    # 2. Save Record
    new_record = record_in.dict()
    new_record.update({
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "carbon_footprint": carbon,
        "exp_gained": exp_gain,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    db.collection("records").add(new_record)
    
    # 3. Update User RPG Stats
    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()
    
    if user_doc.exists:
        user_data = user_doc.to_dict()
        current_level = user_data.get("level", 1)
        current_exp = user_data.get("current_exp", 0) + exp_gain
        total_carbon = user_data.get("total_carbon_saved", 0) + carbon
    else:
        # Create new user if not exists
        current_level = 1
        current_exp = exp_gain
        total_carbon = carbon
        user_ref.set({
            "uid": user_id,
            "display_name": "Adventurer",
            "email": "test@example.com",
            "level": 1, 
            "current_exp": 0,
            "total_carbon_saved": 0
        })

    # Check Level Up
    did_level_up, new_level_val, remaining_exp = check_level_up(current_exp, current_level)
    
    # Update User
    user_ref.update({
        "level": new_level_val,
        "current_exp": remaining_exp,
        "total_carbon_saved": total_carbon
    })
    
    # 4. Generate Response
    npc_msg = get_npc_reaction(record_in.category)
    carb_advice = get_carbon_advice(record_in.category)
    
    return RPGUpdate(
        level_up=did_level_up,
        new_level=new_level_val,
        message=f"{npc_msg} You saved ~{carbon}kg CO2! {carb_advice}",
        npc_reaction="happy" # placeholder for asset ID
    )

@router.get("/", response_model=list[dict])
async def get_records(db=Depends(get_db)):
    user_id = get_current_user_id()
    # Filter by user_id in a real DB
    # For mock, we filter manually
    all_records = [doc.to_dict() for doc in db.collection("records").stream()]
    user_records = [r for r in all_records if r.get("user_id") == user_id]
    return user_records
