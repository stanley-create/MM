def estimate_carbon_footprint(amount: float, category: str) -> float:
    """
    Estimate carbon footprint (kg CO2e) based on spending amount (NTD) and category.
    V2 Enhancement: More granular categories.
    """
    # 1 TWD ~ 0.03 USD.
    # Factors (kg CO2e per TWD)
    factors = {
        "food": 0.015,       # Meat heavy
        "transport": 0.008,  # Public transport is lower
        "shopping": 0.012,   # General goods
        "entertainment": 0.005,
        "bill": 0.010,
        "other": 0.005
    }
    
    # Check for specific keywords in future if description is passed
    factor = factors.get(category.lower(), 0.005)
    
    # Random variance for RPG simulation feel
    import random
    variance = random.uniform(0.9, 1.1)
    
    return round(amount * factor * variance, 3)

def get_carbon_advice(category: str) -> str:
    advice = {
        "food": "Eating local? That saves CO2 and supports local farmers!",
        "transport": "Great job moving around! Walk when you can.",
        "shopping": "A shiny new item! Does it spark joy for the planet too?",
        "bill": "Energy efficiency is the ultimate magic spell."
    }
    return advice.get(category.lower(), "Every coin spent shapes the world.")
