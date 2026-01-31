from fastapi import APIRouter, Header
from app.models.schemas import AnalysisReport, Record
from app.services.firebase import get_db
import pandas as pd
from datetime import datetime, timedelta
from app.services.gemini import generate_rpg_advice

router = APIRouter()
db = get_db()

@router.post("/", response_model=AnalysisReport)
async def analyze_finances(x_user_id: str = Header(...)):
    # 1. Fetch historical records
    records_ref = db.collection("records").where("user_id", "==", x_user_id).stream()
    data = [doc.to_dict() for doc in records_ref]
    
    if not data:
        return AnalysisReport(
            summary="冒險尚未開始，快去記錄第一筆收支吧！",
            rpg_advice="你的紀錄冊空空如也，快去探索外面的世界。",
            carbon_analysis="尚未有足夠的碳足跡數據。",
            category_breakdown={},
            prediction_next_month=0.0
        )
        
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    
    # 2. Category Breakdown
    category_sums = df.groupby('category')['amount'].sum().to_dict()
    total_spent = df[df['is_income'] == False]['amount'].sum()
    
    # 3. RPG Advice via Gemini
    financial_summary = f"本月支出：{total_spent} NTD。各分類支出：{category_sums}。"
    advice = await generate_rpg_advice(financial_summary)

    # 4. Carbon Analysis
    total_carbon = df['carbon_kg'].sum()
    carbon_report = f"你目前已累積了 {total_carbon:.2f} kg 的碳足跡。綠色地圖正在緩慢生長！"
    
    # 5. Simple Prediction (Average daily last 30 days * 30)
    last_30_days = datetime.now() - timedelta(days=30)
    recent_df = df[df['date'] > last_30_days]
    if not recent_df.empty:
        avg_daily = recent_df[recent_df['is_income'] == False]['amount'].sum() / 30
        prediction = avg_daily * 30
    else:
        prediction = total_spent # Fallback
        
    return AnalysisReport(
        summary=f"本月累計支出：{total_spent} NTD",
        rpg_advice=advice,
        carbon_analysis=carbon_report,
        category_breakdown=category_sums,
        prediction_next_month=prediction
    )
