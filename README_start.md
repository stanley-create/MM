# MoneyQuest 伺服器啟動指南

## 🚀 一鍵啟動 (推薦)

在專案根目錄執行：

```bash
python start_servers.py
```

或

```bash
python3 start_servers.py
```

## 📋 功能說明

`start_servers.py` 自動化腳本會執行以下操作：

### 1. 環境檢查
- ✅ 驗證專案目錄結構 (backend/ 和 frontend/)
- ✅ 檢查 Python 虛擬環境 (backend/venv/)
- ✅ 檢查 Node.js 依賴 (frontend/node_modules/)

### 2. 自動安裝依賴

#### 後端
```bash
# 如果 venv 不存在，自動建立
python3 -m venv backend/venv

# 如果 FastAPI/uvicorn 未安裝，自動執行
pip install -r backend/requirements.txt
```

#### 前端
```bash
# 如果 node_modules 不存在，自動執行
npm install --legacy-peer-deps
```

### 3. 啟動伺服器

**後端 FastAPI**:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- 🌐 API 端點: http://127.0.0.1:8000
- 📚 API 文件: http://127.0.0.1:8000/docs

**前端 Expo**:
```bash
npx expo start
```
- 📱 掃描 QR code 使用 Expo Go App
- 💻 按 `a` 啟動 Android 模擬器
- 🍎 按 `i` 啟動 iOS 模擬器

## 🎨 輸出格式

腳本使用彩色輸出區分不同來源：

- 🔵 **[後端]** - 藍色：FastAPI/uvicorn 日誌
- 🟢 **[前端]** - 綠色：Expo Metro Bundler 日誌
- 🔷 **[系統]** - 青色：腳本系統訊息
- 🔴 **[錯誤]** - 紅色：錯誤訊息

### 重點標示

腳本會自動高亮重要訊息：
- ✅ **啟動成功**: `Application startup complete`
- 🌐 **伺服器地址**: `http://...` 或 `exp://...`
- ⚠️ **警告**: `WARNING`
- ❌ **錯誤**: `ERROR`
- 📱 **QR Code**: `exp://` 連結會以青色粗體顯示

## 🛑 停止伺服器

按 **Ctrl+C** 即可優雅地停止所有伺服器。

腳本會自動：
1. 終止後端 uvicorn 進程
2. 終止前端 Metro Bundler 進程
3. 清理資源
4. 顯示停止訊息

## ⚠️ 常見問題排除

### 問題 1: "找不到 backend/ 目錄"

**解決方案**:
```bash
# 確認在專案根目錄
cd /Users/a8888/Desktop/MoneyQuest
python start_servers.py
```

### 問題 2: "Python venv 建立失敗"

**原因**: Python 3 未安裝或版本過舊

**解決方案**:
```bash
# 檢查 Python 版本 (需要 >= 3.9)
python3 --version

# macOS 安裝 Python 3
brew install python3
```

### 問題 3: "依賴安裝失敗"

**後端依賴問題**:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**前端依賴問題**:
```bash
cd frontend
npm install --legacy-peer-deps
```

### 問題 4: "後端 import 錯誤 (ModuleNotFoundError: pydantic)"

**原因**: 虛擬環境未激活或依賴未安裝

**解決方案**:
```bash
# 手動安裝後端依賴
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 問題 5: "前端 QR code 不顯示"

**原因**: Metro Bundler 啟動需要時間

**解決方案**:
- 等待 10-15 秒
- QR code 會在終端顯示
- 或查看終端輸出的 `exp://` 連結

### 問題 6: "端口已被佔用 (Port 8000 in use)"

**解決方案**:
```bash
# 找出佔用端口的進程
lsof -ti:8000

# 終止該進程
kill -9 $(lsof -ti:8000)

# 重新啟動
python start_servers.py
```

## 📱 手機連線測試

### 使用 Expo Go App

1. **下載 Expo Go**
   - iOS: App Store 搜尋 "Expo Go"
   - Android: Google Play 搜尋 "Expo Go"

2. **掃描 QR Code**
   - 執行 `python start_servers.py`
   - 等待前端 QR code 顯示
   - 使用 Expo Go 掃描

3. **確保同一網路**
   - 手機和電腦必須在同一 WiFi 網路

### 使用模擬器

**Android**:
```bash
# 啟動後在終端按 'a'
# 需要先安裝 Android Studio 和模擬器
```

**iOS** (僅 macOS):
```bash
# 啟動後在終端按 'i'
# 需要先安裝 Xcode
```

## 🔧 進階選項

### 僅啟動後端

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### 僅啟動前端

```bash
cd frontend
npx expo start
```

### 在背景執行

```bash
# 使用 nohup (不推薦，會失去 log 輸出)
nohup python start_servers.py > servers.log 2>&1 &

# 建議使用 tmux 或 screen
tmux new -s moneyquest
python start_servers.py
# 按 Ctrl+B 然後 D 離開 (伺服器繼續運行)
# tmux attach -t moneyquest  # 重新連接
```

## 📊 腳本輸出範例

```
============================================================
🚀 MoneyQuest Auto-Start Servers
============================================================

[系統] 檢查專案結構...
✅ 專案結構正確
[後端] 檢查 Python 虛擬環境...
[後端] 虛擬環境已存在
[後端] 檢查後端依賴...
[後端] 依賴已安裝
[前端] 檢查前端依賴...
[前端] 依賴已安裝

============================================================

[後端] 啟動 FastAPI 伺服器...
✅ 後端伺服器啟動中...
[前端] 啟動 Expo 開發伺服器...
✅ 前端伺服器啟動中...
[後端] INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
[後端] INFO:     Application startup complete.
[前端] Starting Metro Bundler
[前端] › Metro waiting on exp://192.168.1.100:8081
[前端] › Scan the QR code above with Expo Go (Android) or Camera (iOS)

============================================================
📱 使用說明

後端 API: http://127.0.0.1:8000
API 文件: http://127.0.0.1:8000/docs

前端 App:
  1. 使用 Expo Go App 掃描上方 QR code
  2. 或在終端按 'a' (Android) 或 'i' (iOS) 啟動模擬器

停止伺服器: 按 Ctrl+C
============================================================

[系統] 伺服器運行中... (按 Ctrl+C 停止)
```

## 🆚 與手動啟動的比較

| 操作 | 手動啟動 | 使用 start_servers.py |
|------|---------|----------------------|
| 開啟終端數量 | 2 個 | 1 個 |
| 需要記憶命令 | 是 | 否 |
| 自動檢查依賴 | 否 | 是 |
| 彩色輸出 | 否 | 是 |
| 統一日誌顯示 | 否 | 是 |
| 優雅停止 | 手動 kill | 自動 Ctrl+C |
| QR code 提示 | 無 | 有 |

## 💡 提示

- ✅ **首次使用**: 依賴安裝可能需要 2-3 分鐘
- ✅ **日常開發**: 後續啟動僅需 5-10 秒
- ✅ **保持運行**: 不要關閉終端視窗
- ✅ **修改代碼**: 後端和前端都會自動重載
- ✅ **快速測試**: 使用 http://127.0.0.1:8000/docs 測試 API

## 📚 相關文件

- [專案 README.md](README.md) - 完整專案文件
- [前端 README.md](frontend/README.md) - 前端優化說明
- [自動化腳本 Walkthrough](../.gemini/antigravity/brain/.../automation_walkthrough.md)

---

**快速開始 MoneyQuest 開發！** 🚀
