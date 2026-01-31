# MoneyQuest V2 🛡️💰 - Cute RPG Edition

A "Medium-Core" RPG AI Bookkeeping App for Taiwan. Turn your financial management into a whimsical adventure!

## V2 Highlights
- **Cute Aesthetics**: Soft Green/Blue palette, rounded UI, and animated Map.
- **NPC Interactions**: Get financial advice from the Elder Tree or Elven Scholar.
- **Merged Features**: Quests and Guilds in one simplified tab.
- **Streamlined Records**: Fast "Scan -> Preview -> Save" flow.

## Features
- **RPG System**: Earn EXP, level up, and restore the Green Valley map.
- **Carbon Footprint**: Real-time CO2 estimates per transaction.
- **Community**: Join local guilds (e.g., Banqiao District) and chat.
- **Tech Stack**: React Native (Expo/Reanimated), FastAPI, Firebase.

## Getting Started

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API: `http://localhost:8000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npx expo start
```
*Note: Uses Reanimated 2+. Run Prebuild if not using Expo Go.*

## Project Structure
- `frontend/src/navigation`: Drawer + Bottom Tabs logic.
- `frontend/src/screens`: V2 Screens (Dashboard, RecordsModal, Combined).
- `backend/app`: FastAPI with NPC Analysis logic.

## Deployment
- **Frontend**: `eas build -p android` (or ios)
- **Backend**: Vercel / Heroku ready.
# MoneyQuest
