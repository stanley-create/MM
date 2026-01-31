"""
Backend API Tests for MoneyQuest
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_quests():
    """Test RPG quests endpoint"""
    response = client.get("/rpg/quests")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_rpg_model_import():
    """Test that RPGUpdate model can be imported"""
    from app.models.schemas import RPGUpdate
    
    update = RPGUpdate(
        new_level=5,
        current_exp=450,
        message="Level up!",
        npc_reaction="happy_elf"
    )
    assert update.new_level == 5
    assert update.current_exp == 450

def test_create_record_validation():
    """Test record creation with validation"""
    from app.models.schemas import RecordCreate, TransactionType
    
    record = RecordCreate(
        amount=100.0,
        category="Food",
        transaction_type=TransactionType.EXPENSE
    )
    assert record.amount == 100.0
    assert record.category == "Food"
