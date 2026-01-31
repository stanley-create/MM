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
    你是一個名為 "錢途冒險" 的 RPG 遊戲中的賢者，專門輔導台灣的都市上班族。
    根據以下用戶的財務數據 (新台幣 NTD)，提供一段有趣、具勵志性且結合台灣生活情境的冒險建議。
    語氣要幽默、溫暖且富有冒險感，偶爾可以使用台灣流行用語。
    數據：{financial_data}
    請直接回傳建議內容，不要有額外標點符號或解釋，長度控制在 100 字以內。
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
    你是一個 RPG 遊戲的 NPC。用戶剛剛在台灣記錄了一筆支出：{record_description}。
    請用 30 字以內回傳一段俏皮、幽默或療癒的對話，把這筆消費比喻成冒險中的事件。
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return "做得好，勇者！"
