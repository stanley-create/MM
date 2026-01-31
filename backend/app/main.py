from fastapi import FastAPI
from app.routers import records, rpg, community, analyze

app = FastAPI(title="MoneyQuest API", description="Backend for MoneyQuest RPG Accountant")

@app.get("/")
def read_root():
    return {"message": "Welcome to MoneyQuest Backend"}

# Placeholder for router inclusion
app.include_router(records.router)
app.include_router(rpg.router)
app.include_router(community.router)
app.include_router(analyze.router)
