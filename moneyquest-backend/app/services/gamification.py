from app.models.schemas import RpgState, Record
import math

CARBON_COEFFICIENTS = {
    "飲食": 0.1,
    "交通": 0.2,
    "娛樂": 0.05,
    "購物": 0.08,
    "醫療": 0.01,
    "住房": 0.03,
    "收入": 0,
    "其他": 0.04
}

def calculate_carbon(category: str, amount: float) -> float:
    coef = CARBON_COEFFICIENTS.get(category, 0.05)
    return amount * coef

def update_rpg_state(current_state: RpgState, new_record: Record) -> RpgState:
    # Basic XP gain
    xp_gain = 20
    
    # Bonus for low carbon categories (relative)
    if new_record.carbon_kg < 5.0: # Arbitrary threshold for bonus
        xp_gain += 10
        
    current_state.xp += xp_gain
    
    # Level up logic
    while current_state.xp >= current_state.xp_to_next_level:
        current_state.xp -= current_state.xp_to_next_level
        current_state.level += 1
        current_state.xp_to_next_level = int(current_state.xp_to_next_level * 1.2)
        
    # Update map progress (5-10 records for visible change)
    # Let's say 1 record = 2% progress
    current_state.map_progress = min(1.0, current_state.map_progress + 0.02)
    
    # Titles
    if current_state.level >= 5:
        current_state.title = "進階冒險者"
    if current_state.level >= 10:
        current_state.title = "金幣守護者"
        
    return current_state
