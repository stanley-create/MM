# MoneyQuest / 錢途冒險 (v5)

**透過 RPG 冒險，讓記帳變為自我成長的傳奇旅程。**

MoneyQuest 是一款結合了 **Gamification (遊戲化)** 與 **AI (人工智慧)** 的創新型記帳 App。它不只是記錄數字，而是將你的財務管理轉化為一場對抗「消費怪獸」的冒險，並整合了台灣本土化的支付習慣與碳足跡計算。

---

## 🚀 v5 版本特色 (整合 v3 + v4)
- **🛡️ 冒險者公會 (Community)**：加入公會，與其他冒險者即時聊天，共同累積碳積分！
- **📜 每日委託 (Quests)**：完成每日/每週任務（如：登入獎勵、低碳消費挑戰）賺取額外 EXP。
- **🔐 冒險者證 (Auth)**：完整的登入/註冊流程，保護你的冒險進度。
- **🤖 AI 賢者 (Gemini Integration)**：內建針對台灣職場人的 AI 理財賢者，提供幽默且接地氣的財務預言。
- **✨ 介面升級**：全新設計的漸層 UI 與動態儀表板，提供即時的消費與碳足跡追蹤。

## ⚡ 快速開始 (使用自動化腳本)

### 🚀 一鍵啟動伺服器 (推薦)
```bash
# 在專案根目錄執行
python start_servers.py
```
此腳本會自動：
- ✅ 建立並啟動後端 FastAPI 伺服器 (http://127.0.0.1:8000)
- ✅ 建立並啟動前端 Expo 開發伺服器 (含 QR code)
- ✅ 自動安裝缺少的依賴

### 🔧 手動啟動

**後端 (Backend)**:
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate  # Windows
pip install -r requirements.txt

# 設定 Gemini API Key (必要)
# 在 backend/.env 檔案中設定：GEMINI_API_KEY=你的金鑰

uvicorn app.main:app --reload
```

**前端 (Frontend)**:
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

---

## 🏗️ 技術架構 & 目錄結構

```
MoneyQuest/
├── backend/              # FastAPI 後端 (v4 架構)
│   ├── app/
│   │   ├── routers/     # API endpoints (records, analyze, community)
│   │   ├── services/    # Business logic (Gemini, Gamification)
│   │   └── models/      # Pydantic schemas
│   └── tests/           # Pytest tests
├── frontend/             # React Native 前端 (v4 架構)
│   ├── src/
│   │   ├── screens/     # Dashboard, Quests, Community
│   │   ├── services/    # API & validation
│   │   └── context/     # AuthContext
├── scripts/             # 自動化腳本 (run_all.sh, etc)
└── moneyquest-backend/  # (Legacy - 待移除)
└── moneyquest-frontend/ # (Legacy - 待移除)
```

## 🔐 安全性與優化
- ✅ JWT 認證整合
- ✅ 輸入驗證 (Pydantic)
- ✅ Gemini AI 整合 (冒險建議)
- ✅ Lottie 動畫與漸層 UI

---
*Made with ❤️ by Agent Antigravity & MoneyQuest Team*
