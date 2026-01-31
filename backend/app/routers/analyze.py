from fastapi import APIRouter
from app.models.schemas import AnalysisRequest, AnalysisResponse
import random

router = APIRouter(prefix="/analyze", tags=["analyze"])

# NPC Personas
PERSONAS = {
    "scholar": {
        "tone": "analytical",
        "intro": "According to my calculations...",
        "advice": [
            "Your expenditure variance is within acceptable limits.",
            "I detect a surge in 'Food' sector spending. Fascinating.",
            "Efficiency is key. You are doing well."
        ]
    },
    "elder": {
        "tone": "wise",
        "intro": "Ho ho! Let an old soul look at your journey.",
        "advice": [
            "Patience brings wealth, young adventurer.",
            "The forest grows slowly, and so does your wealth.",
            "Do not let the shiny baubles distract you from the path."
        ]
    }
}

@router.post("/", response_model=AnalysisResponse)
async def analyze_finances(request: AnalysisRequest):
    # Select Persona (random or user pref)
    persona_key = "elder" # Default to Elder for V2
    persona = PERSONAS[persona_key]
    
    selected_advice = random.choice(persona["advice"])
    
    # Mock data for graph
    graph_data = [
        {"day": "Mon", "amount": random.randint(100, 500)},
        {"day": "Tue", "amount": random.randint(100, 500)},
        {"day": "Wed", "amount": random.randint(100, 500)},
        {"day": "Thu", "amount": random.randint(100, 500)},
        {"day": "Fri", "amount": random.randint(200, 800)},
    ]
    
    full_message = f"{persona['intro']} {selected_advice}"
    
    return AnalysisResponse(
        summary="Weekly Analysis",
        prediction=full_message, 
        graph_data=graph_data
    )
