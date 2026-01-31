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
    # 3. RPG Advice via Gemini
    # Summarize graph data for context
    total_amount = sum(d['amount'] for d in graph_data)
    summary_text = f"本週總支出: {total_amount}"
    
    try:
        from app.services.gemini import generate_rpg_advice
        rpg_advice = await generate_rpg_advice(summary_text)
        prediction_text = rpg_advice
    except ImportError:
        # Fallback to Persona logic if gemini service has issues
        prediction_text = f"{persona['intro']} {selected_advice}"
    except Exception as e:
        print(f"Gemini error: {e}")
        prediction_text = f"{persona['intro']} {selected_advice}"
    
    return AnalysisResponse(
        summary="Weekly Analysis",
        prediction=prediction_text, 
        graph_data=graph_data
    )
