# MoneyQuest - RPG AI 記帳 App

一個結合 RPG 元素與 AI 分析的記帳應用程式，採用 Q 版可愛美術風格，支援台灣用戶的互動式地圖記帳體驗。

## 🎯 專案概述

**MoneyQuest** 是一款中度 RPG AI 記帳應用程式，提供：
- 🎮 RPG 元素（等級系統、任務、NPC 互動）
- 📊 AI 分析與智能預測
- 🗺️ 互動式地區地圖（基於台灣地點）
- 🌱 碳足跡追蹤
- 👥 公會系統與社群功能

## ⚡ 快速開始

### 🚀 一鍵啟動伺服器 (推薦)

```bash
# 在專案根目錄執行
python start_servers.py
```

此腳本會自動：
- ✅ 建立並啟動後端 FastAPI 伺服器 (http://127.0.0.1:8000)
- ✅ 建立並啟動前端 Expo 開發伺服器 (含 QR code)
- ✅ 自動安裝缺少的依賴
- ✅ 彩色輸出區分後端/前端日誌
- ✅ 按 Ctrl+C 優雅停止所有伺服器

詳細說明請見 [README_start.md](README_start.md)

### 🔧 手動啟動 (進階)

**後端**:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**前端**:
```bash
cd frontend
npm start
```


## 🏗️ 技術架構

### 後端 (Backend)
- **框架**: FastAPI (Python)
- **資料庫**: Firebase
- **AI/ML**: scikit-learn, pandas
- **測試**: pytest

### 前端 (Frontend)
- **框架**: React Native (Expo)
- **語言**: JavaScript
- **UI 庫**: React Navigation, Lottie animations
- **測試**: Jest, React Testing Library

## 🚀 自動化腳本

本專案提供完整的自動除錯、優化與 Git 更新腳本：

### 📋 快速開始 - 一鍵執行所有腳本

```bash
# 在專案根目錄執行
./scripts/run_all.sh
```

此腳本將自動：
1. ✅ 修復後端 import 錯誤（RPGUpdate 模型）
2. ✅ 解決前端依賴衝突（React 版本）
3. ✅ 優化代碼格式（Prettier）
4. ✅ 自動 commit 並 push 到 Git

### 🔧 個別執行腳本

#### 後端除錯腳本

```bash
cd backend
python3 scripts/fix_backend.py
```

**功能**：
- 修復 `app/models/schemas.py` 中的 `RPGUpdate` 模型定義
- 添加 pytest、pytest-asyncio、httpx 測試依賴
- 生成基礎 pytest 單元測試
- 驗證 Python imports

#### 前端除錯腳本

```bash
cd frontend
node scripts/fix_frontend.js
```

**功能**：
- 自動修正 package.json 中的 React 版本衝突
- 使用 `--legacy-peer-deps` 安裝所有依賴
- 驗證 Expo CLI 設定
- 檢查 Babel 配置
- 執行基礎驗證檢查

#### Git 自動提交腳本

```bash
cd scripts
node git_auto_push.js
```

**功能**：
- 檢查 Git 狀態
- 自動 `git add .`
- Commit 訊息: "Fix import errors, dependency conflicts, and optimize code for MoneyQuest"
- Push 到 `origin/main` (或 `origin/master`)
- 如失敗，輸出手動指令

## 📦 安裝與設定

### 環境需求

- Node.js >= 16.x
- Python >= 3.9
- npm or yarn
- Git

### 後端設定

```bash
cd backend

# 建立虛擬環境
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安裝依賴
pip install -r requirements.txt

# 執行自動修復
python3 scripts/fix_backend.py

# 啟動服務器
uvicorn app.main:app --reload
```

### 前端設定

```bash
cd frontend

# 執行自動修復與依賴安裝
node scripts/fix_frontend.js

# 或手動安裝
npm install --legacy-peer-deps

# 啟動開發伺服器
npm start
# 或
npx expo start
```

## 🧪 測試

### 後端測試

```bash
cd backend
pytest -v
```

### 前端測試

```bash
cd frontend
npm test -- --passWithNoTests
```

> **注意**: 前端 Jest 測試目前因 React Native Reanimated 4.x 與 Expo 相容性問題無法完全運行。測試檔案已建立，將在升級到 Expo SDK 55+ 後可用。

## 🎨 UI/UX 設計

- **風格**: Q 版向量圖、輕卡通多靈國風格
- **色調**: 柔和綠藍親切感 (#90EE90 淺綠, #ADD8E6 淺藍)
- **動畫**: 使用 Lottie 與 Reanimated 實現絲滑轉場
- **響應式**: 手機優先設計

## 📁 專案結構

```
MoneyQuest/
├── backend/              # FastAPI 後端
│   ├── app/
│   │   ├── models/      # Pydantic schemas
│   │   ├── routers/     # API endpoints
│   │   └── services/    # Business logic
│   ├── scripts/
│   │   └── fix_backend.py    # 🔧 後端自動除錯腳本
│   ├── tests/           # Pytest tests
│   └── requirements.txt
├── frontend/            # React Native 前端
│   ├── src/
│   │   ├── screens/     # 畫面組件
│   │   ├── services/    # API & validation
│   │   │   ├── validation.js     # 輸入驗證
│   │   │   └── optimizeScript.js # 代碼優化腳本
│   │   └── __tests__/   # Jest 測試
│   ├── scripts/
│   │   └── fix_frontend.js       #🔧 前端自動除錯腳本
│   └── package.json
└── scripts/             # 專案級腳本
    ├── run_all.sh                # 🚀 主自動化腳本
    └── git_auto_push.js          # 📤 Git 自動提交腳本
```

## 🐛 已知問題與解決方案

### Jest 測試環境問題

**問題**: React Native Reanimated 4.1.1 需要 `react-native-worklets/plugin`，與當前 Expo/Babel 設定不相容。

**解決方案**:
1. 等待 React Native 0.82+ / Expo SDK 55+ 升級
2. 或降級 react-native-reanimated 到 3.x
3. 測試檔案已建立並準備就緒

### React 版本衝突

**問題**: `react-test-renderer` 版本與 React 19.1.0 不匹配。

**解決方案**: 使用 `--legacy-peer-deps` 安裝，或執行 `fix_frontend.js` 自動修復。

## 🔐 安全性

- ✅ JWT 認證整合 (AsyncStorage)
- ✅ 輸入驗證 (Pydantic-like utilities)
- ✅ XSS 防護 (sanitizeInput)
- ✅ API 攔截器錯誤處理

## ⚡ 性能優化

- ✅ React.useMemo & useCallback 防止不必要re-render
- ✅ Lottie 動畫速度控制（低電量模式）
- ✅ 後端 async endpoints
- ✅ 前端輸入驗證即時回饋

## 📝 開發工作流程

1. **開發階段**:
   ```bash
   # 後端
   uvicorn app.main:app --reload
   
   # 前端
   npm start
   ```

2. **提交前檢查**:
   ```bash
   # 執行所有自動化腳本
   ./scripts/run_all.sh
   ```

3. **手動 Git 操作**（如自動化失敗）:
   ```bash
   git add .
   git commit -m "Fix import errors, dependency conflicts, and optimize code for MoneyQuest"
   git push origin main
   ```

## 🎯 未來改進

- [ ] 升級到 Expo SDK 55+ 以支援完整 Jest 測試
- [ ] 實作位置基礎地圖區塊解鎖（Banqiao 等地區）
- [ ] 添加 E2E 測試（Detox）
- [ ] 實作 Crashlytics 生產環境錯誤追蹤
- [ ] 建立 Q 版 SVG 圖標集

## 📄 授權

本專案為 MoneyQuest 應用程式的一部分。

## 🤝 貢獻

歡迎提交 issue 和 pull request！

---

**Made with ❤️ for Taiwan users**
