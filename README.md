# 錢途冒險 / MoneyQuest (v3)

**透過 RPG 冒險，讓記帳變為自我成長的傳奇旅程。**

錢途冒險是一款結合了 **Gamification (遊戲化)** 與 **AI (人工智慧)** 的創新型記帳 App。它不只是記錄數字，而是將你的財務管理轉化為一場對抗「消費怪獸」的冒險，並整合了台灣本土化的支付習慣與碳足跡計算。

---

## 🚀 v3 版本新功能
- **🛡️ 冒險者公會 (Community)**：加入公會，與其他冒險者即時聊天，共同累積碳積分！
- **📜 每日委託 (Quests)**：完成每日/每週任務（如：登入獎勵、低碳消費挑戰）賺取額外 EXP。
- **🔐 冒險者證 (Auth)**：完整的登入/註冊流程，保護你的冒險進度。
- **✨ 介面升級**：全新設計的漸層 UI 與動態儀表板，提供即時的消費與碳足跡追蹤。

## 🌟 核心特色
- **遊戲化體驗**：每一筆記帳都是對怪獸的擊敗，累積經驗值升級並開拓冒險地圖。
- **AI 賢者 (Gemini Integration)**：內建針對台灣職場人的 AI 理財賢者，提供幽默且接地氣的財務預言。
- **環保意識**：內建碳足跡計算，消費也能愛地球。
- **快速記帳**：支援模擬掃碼 OCR 與語音輸入。

---

## 🛠️ 技術棧
- **前端**：React Native (Expo), React Navigation, Axios, Expo Linear Gradient
- **後端**：FastAPI (Python), Google Gemini AI, Pandas
- **資料庫**：Firebase Firestore (支援本地 Mock 模式)

---

## ⚡ 快速開始

### 1. 後端 (FastAPI)
進入 `moneyquest-backend` 目錄：
```bash
cd moneyquest-backend

# 建立並啟用虛擬環境 (建議)
python -m venv venv
.\venv\Scripts\Activate  # Windows Powershell
# source venv/bin/activate # Mac/Linux

pip install -r requirements.txt

# 設定 Gemini API Key (必要，否則 AI 功能將使用 Mock 回應)
# 在 .env 檔案中設定：GEMINI_API_KEY=你的金鑰

# 啟動伺服器
python -m app.main
```
*預設運行於 `http://localhost:8000`*

### 2. 前端 (React Native)
進入 `moneyquest-frontend` 目錄：
```bash
cd moneyquest-frontend
npm install
npx expo start
```
*建議使用 Android 模擬器或下載 Expo Go App 進行體驗。*

### 模擬登入
目前使用 Mock Auth，於登入畫面輸入任意 Email/密碼即可進入冒險。

---

## 📂 目錄結構
- **Backend (`moneyquest-backend`)**
  - `app/routers`: `records` (記帳/RPG), `analysis` (AI分析), `community` (公會)
  - `app/services`: `gemini.py` (AI), `gamification.py` (遊戲邏輯)
  
- **Frontend (`moneyquest-frontend`)**
  - `src/screens`: 
    - `AdventureScreen`: 主地圖與儀表板
    - `CommunityScreen`: 公會聊天室
    - `QuestScreen`: 任務列表
  - `src/context`: `AuthContext` (狀態管理)

---

## 💡 模擬功能說明
由於環境限制，以下功能目前為模擬實作：
- **發票掃碼**：Record Modal 中的「掃描發票」會模擬讀取金額。
- **Firebase**：若無 `serviceAccount.json`，系統會自動切換至記憶體 Mock 資料庫。

---
*Made with ❤️ by Agent Antigravity*
