from fastapi import APIRouter, HTTPException, Depends, Header
from app.models.schemas import Record, RecordCreate, RPGUpdate
from app.models.dashboard import DashboardState, RpgState
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
    
    # 4. Generate Response (Gemini Enhanced)
    try:
        from app.services.gemini import generate_npc_comment
        npc_msg = await generate_npc_comment(record_in.description or record_in.category)
    except:
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
    all_records = [doc.to_dict() for doc in db.collection("records").stream()]
    user_records = [r for r in all_records if r.get("user_id") == user_id]
    return user_records

@router.get("/rpg-status", response_model=DashboardState)
async def get_rpg_status(db=Depends(get_db)):
    user_id = get_current_user_id()
    
    # Get User Stats
    user_ref = db.collection("users").document(user_id)
    doc = user_ref.get()
    
    if doc.exists:
        d = doc.to_dict()
        rpg_state = RpgState(
            user_id=user_id,
            level=d.get('level', 1),
            xp=d.get('current_exp', 0),
            xp_to_next_level=1000, # Simplified
            title="Eco Warrior" if d.get('total_carbon_saved', 0) > 100 else "Novice",
            map_progress=min(1.0, d.get('total_carbon_saved', 0) / 500.0)
        )
    else:
        rpg_state = RpgState(user_id=user_id)
        
    # Calculate Today's Stats
    now = datetime.now()
    start_of_day = datetime(now.year, now.month, now.day)
    
    records = [r.to_dict() for r in db.collection("records").stream()]
    user_recs = [r for r in records if r.get("user_id") == user_id]
    
    today_spend = 0.0
    today_carbon = 0.0
    recent_recs = []
    
    for r in user_recs:
        try:
            ts = datetime.fromisoformat(r["timestamp"])
            if ts >= start_of_day:
                today_spend += r.get("amount", 0)
                today_carbon += r.get("carbon_footprint", 0)
        except:
            pass
            
    # Convert dicts back to Record schema for response
    # Simplified handling
    
    return DashboardState(
        rpg=rpg_state,
        today_spend=today_spend,
        today_carbon=today_carbon,
        recent_records=[] 
    )
