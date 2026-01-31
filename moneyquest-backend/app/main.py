from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import records, analysis
import uvicorn

app = FastAPI(title="MoneyQuest AI Backend")

# Setup CORS for React Native (and web debugging)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(records.router, prefix="/records", tags=["Records"])
app.include_router(analysis.router, prefix="/analyze", tags=["Analysis"])

@app.get("/")
async def root():
    return {"message": "Welcome to MoneyQuest API", "status": "active"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
