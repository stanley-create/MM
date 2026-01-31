# 錢途冒險 / MoneyQuest

錢途冒險是一款以 RPG 為媒介的 AI 記帳 App。它旨在將枯燥的財務管理轉化為有趣的冒險體驗，並整合了台灣本土化的支付習慣與碳足跡計算。

## 核心價值
- **遊戲化體驗**：每一筆記帳都是對怪獸的擊敗，累積經驗值升級並開拓冒險地圖。
- **AI 洞察**：後端 AI 自動分析消費習慣，以 RPG 語氣提供理財建議。
- **環保意識**：內建碳足跡計算，鼓勵低碳生活。
- **快速記帳**：支援模擬掃碼 OCR 與語音輸入。

## 技術棧
- **前端**：React Native (Expo), React Navigation, Axios, Lottie
- **後端**：FastAPI (Python), Pandas, Scikit-learn
- **資料庫**：Firebase Firestore (提供 Mock 模式)

---

## 快速開始

### 1. 後端 (FastAPI)
進入 `moneyquest-backend` 目錄：
```bash
cd moneyquest-backend
# 建立並啟用虛擬環境 (建議)
python -m venv venv
.\venv\Scripts\Activate  # Windows Powershell
# source venv/bin/activate # Mac/Linux

pip install -r requirements.txt
# 設定 Gemini API Key (可在 .env 檔案中設定)
# export GEMINI_API_KEY=YOUR_API_KEY 

# 啟動伺服器 (使用模組模式運行以避免路徑問題)
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

## 目錄結構
- `moneyquest-backend/app/routers`: API 端點邏輯
- `moneyquest-backend/app/services`: 遊戲化與 Firebase 服務
- `moneyquest-frontend/src/screens`: 冒險地圖、分析報表等頁面
- `moneyquest-frontend/src/components`: NPC 氣泡、記帳 Modal 等組件

---

## 模擬功能說明
由於環境限制，以下功能目前為模擬實作：
- **發票掃碼**：Record Modal 中的「掃描發票」會模擬讀取金額。
- **Firebase**：若無 `serviceAccount.json`，系統會自動切換至記憶體 Mock 資料庫。
- **語音輸入**：介面已預載，具體串接需視裝置權限而定。

祝你在錢途冒險中獲得豐富的寶藏與心靈成長！
