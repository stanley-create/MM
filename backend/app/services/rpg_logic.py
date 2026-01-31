import random

def calculate_exp(amount: float, transaction_count: int) -> int:
    """
    Calculate EXP based on transaction amount and consistent usage.
    Base: 10-50 EXP.
    """
    base_exp = random.randint(10, 30)
    bonus = min(20, int(amount / 100)) # Small bonus for larger amounts
    return base_exp + bonus

def check_level_up(current_exp: int, current_level: int) -> tuple[bool, int, int]:
    """
    Check if user leveled up.
    Returns: (did_level_up, new_level, remaining_exp)
    Formula: Level * 100 * 1.2
    """
    required_exp = int(current_level * 100 * 1.2)
    if current_exp >= required_exp:
        return True, current_level + 1, current_exp - required_exp
    return False, current_level, current_exp

def get_npc_reaction(transaction_category: str) -> str:
    """
    Return a random NPC dialogue based on category.
    To be expanded with 200-300 lines.
    """
    responses = [
        "Great job keeping track!",
        "Every coin counts on this adventure.",
        "A wise spending choice!",
        "Your inventory is growing.",
        "Keep it up, adventurer!"
    ]
    return random.choice(responses)
