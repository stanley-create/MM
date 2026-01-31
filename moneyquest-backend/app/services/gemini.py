import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

async def generate_rpg_advice(financial_data: str) -> str:
    """
    Generates RPG-styled financial advice using Gemini.
    """
    if not model:
        return "冒險者，目前的預言水晶球暫時失效，請稍後再試。"
    
    prompt = f"""
    你是一個名為 "錢途冒險" 的 RPG 遊戲中的賢者。
    根據以下用戶的財務數據，提供一段有趣且具勵志性的冒險建議。
    語氣要幽默、溫暖且富有冒險感。
    數據：{financial_data}
    請直接回傳建議內容，不要有額外標點符號或解釋。
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "冒險者，迷霧太濃，我看不到明確的理財路徑。"

async def generate_npc_comment(record_description: str) -> str:
    """
    Generates a quick NPC comment after a transaction.
    """
    if not model:
        return "喔！成功擊敗了一隻消費怪獸！經驗值提升！"
    
    prompt = f"""
    你是一個 RPG 遊戲的 NPC。用戶剛剛記錄了一筆支出：{record_description}。
    請用 20 字以內回傳一段俏皮的對話。
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return "做得好，勇者！"
