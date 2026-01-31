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

@router.get("/rpg-status", response_model=RpgState)
async def get_rpg_status(x_user_id: str = Header(...)):
    rpg_doc = db.collection("rpg_states").document(x_user_id).get()
    if rpg_doc.exists:
        return RpgState(**rpg_doc.to_dict())
    return RpgState(user_id=x_user_id)
