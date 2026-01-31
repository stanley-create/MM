from fastapi import APIRouter, Header, HTTPException
from app.models.schemas import RecordCreate, Record, RpgState
from app.services.firebase import get_db
from app.services.gamification import calculate_carbon, update_rpg_state
from app.services.gemini import generate_npc_comment
import uuid
from datetime import datetime

router = APIRouter()
db = get_db()

@router.post("/", response_model=dict)
async def create_record(record_in: RecordCreate, x_user_id: str = Header(...)):
    # 1. Calculate Carbon
    carbon_kg = calculate_carbon(record_in.category, record_in.amount)
    
    # 2. Create Record Object
    record_id = str(uuid.uuid4())
    record = Record(
        id=record_id,
        user_id=x_user_id,
        **record_in.dict()
    )
    record.carbon_kg = carbon_kg
    
    # 3. Save Record to DB
    db.collection("records").document(record_id).set(record.dict())
    
    # 4. Update RPG State
    rpg_doc = db.collection("rpg_states").document(x_user_id).get()
    if rpg_doc.exists:
        state = RpgState(**rpg_doc.to_dict())
    else:
        state = RpgState(user_id=x_user_id)
        
    updated_state = update_rpg_state(state, record)
    db.collection("rpg_states").document(x_user_id).set(updated_state.dict())
    
    # 5. Dynamic NPC Message via Gemini
    npc_msg = await generate_npc_comment(record_in.description or record_in.category)
    
    return {
        "record": record,
        "rpg_update": updated_state,
        "npc_message": npc_msg
    }

@router.get("/", response_model=list[Record])
async def list_records(x_user_id: str = Header(...)):
    records_ref = db.collection("records").where("user_id", "==", x_user_id).stream()
    return [Record(**doc.to_dict()) for doc in records_ref]

from app.models.dashboard import DashboardState
from datetime import datetime, timedelta

@router.get("/rpg-status", response_model=DashboardState)
async def get_rpg_status(x_user_id: str = Header(...)):
    # 1. Get RPG State
    rpg_doc = db.collection("rpg_states").document(x_user_id).get()
    if rpg_doc.exists:
        rpg_state = RpgState(**rpg_doc.to_dict())
    else:
        rpg_state = RpgState(user_id=x_user_id)
        
    # 2. Calculate Today's Stats
    try:
        now = datetime.now()
        start_of_day = datetime(now.year, now.month, now.day)
        
        # Note: In a real app we'd query with date filter
        # For mock/simple implementation, we stream recent and filter in python
        records_ref = db.collection("records").where("user_id", "==", x_user_id).stream()
        
        today_spend = 0.0
        today_carbon = 0.0
        
        for doc in records_ref:
            d = doc.to_dict()
            # Handle string vs datetime object from firestore depending on client
            rec_date = d.get('date')
            if isinstance(rec_date, str):
                rec_date = datetime.fromisoformat(rec_date)
            # Firestore timestamp behavior varies, assume iso string or datetime
            
            if rec_date and rec_date.replace(tzinfo=None) >= start_of_day:
                if not d.get('is_income', False):
                    today_spend += d.get('amount', 0)
                today_carbon += d.get('carbon_kg', 0)
                
    except Exception as e:
        print(f"Error calculating stats: {e}")
        today_spend = 0.0
        today_carbon = 0.0

    return DashboardState(
        rpg=rpg_state,
        today_spend=today_spend,
        today_carbon=today_carbon
    )
