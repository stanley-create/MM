#!/usr/bin/env python3
"""
MoneyQuest Backend Auto-Debug Script
Automatically fixes import errors, missing models, and validates backend code.
"""

import os
import re
import subprocess
import sys
from pathlib import Path

# Color codes for terminal output
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    RESET = '\033[0m'

def log(message, color=Colors.RESET):
    print(f"{color}{message}{Colors.RESET}")

def fix_rpg_schemas():
    """Fix incomplete RPGUpdate model in schemas.py"""
    log("\n🔧 Fixing RPGUpdate schema model...", Colors.BLUE)
    
    schemas_path = Path("app/models/schemas.py")
    
    if not schemas_path.exists():
        log(f"❌ {schemas_path} not found", Colors.RED)
        return False
    
    with open(schemas_path, 'r') as f:
        content = f.read()
    
    # Check if RPGUpdate is already properly defined
    if "class RPGUpdate(BaseModel):" in content:
        log("✅ RPGUpdate model already exists", Colors.GREEN)
        return True
    
    # Fix orphaned fields by adding proper RPGUpdate model
    fixed_content = content.rstrip()
    
    # Remove orphaned fields at the end if they exist
    if fixed_content.endswith("npc_reaction: str  # URL or ID of the reaction asset"):
        # Remove the orphaned lines
        lines = fixed_content.split('\n')
        # Find where AnalysisResponse ends
        for i in range(len(lines) - 1, -1, -1):
            if 'graph_data: List[dict]' in lines[i]:
                fixed_content = '\n'.join(lines[:i+1])
                break
    
    # Add proper RPGUpdate model
    rpg_update_model = """

class RPGUpdate(BaseModel):
    \"\"\"Response model for RPG updates (leveling, exp gains)\"\"\"
    new_level: int
    current_exp: int
    message: str
    npc_reaction: str  # URL or ID of the reaction asset
"""
    
    fixed_content += rpg_update_model
    
    # Write back
    with open(schemas_path, 'w') as f:
        f.write(fixed_content)
    
    log(f"✅ Fixed {schemas_path} - Added RPGUpdate model", Colors.GREEN)
    return True

def add_pytest_dependency():
    """Add pytest to requirements.txt if missing"""
    log("\n🔧 Checking pytest dependency...", Colors.BLUE)
    
    req_path = Path("requirements.txt")
    with open(req_path, 'r') as f:
        content = f.read()
    
    if 'pytest' not in content:
        with open(req_path, 'a') as f:
            f.write('pytest\n')
            f.write('pytest-asyncio\n')
            f.write('httpx  # For FastAPI testing\n')
        log("✅ Added pytest dependencies", Colors.GREEN)
    else:
        log("✅ pytest already in requirements", Colors.GREEN)
    
    return True

def validate_imports():
    """Check for common import errors"""
    log("\n🔍 Validating Python imports...", Colors.BLUE)
    
    try:
        # Try importing the schemas module
        result = subprocess.run(
            [sys.executable, "-c", "from app.models.schemas import RPGUpdate; print('OK')"],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if result.returncode == 0 and "OK" in result.stdout:
            log("✅ All imports valid", Colors.GREEN)
            return True
        else:
            log(f"⚠️  Import validation: {result.stderr}", Colors.YELLOW)
            return False
    except Exception as e:
        log(f"⚠️  Could not validate imports: {e}", Colors.YELLOW)
        return False

def create_backend_tests():
    """Generate basic pytest tests"""
    log("\n🧪 Creating backend tests...", Colors.BLUE)
    
    tests_dir = Path("tests")
    tests_dir.mkdir(exist_ok=True)
    
    # Create __init__.py
    (tests_dir / "__init__.py").touch()
    
    # Create test_api.py
    test_api_content = '''"""
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
'''
    
    with open(tests_dir / "test_api.py", 'w') as f:
        f.write(test_api_content)
    
    log(f"✅ Created {tests_dir}/test_api.py", Colors.GREEN)
    return True

def run_tests():
    """Run pytest if available"""
    log("\n🧪 Running tests...", Colors.BLUE)
    
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pytest", "-v", "--tb=short"],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            log("✅ All tests passed", Colors.GREEN)
            return True
        else:
            log("⚠️  Some tests failed (this is OK for first run):", Colors.YELLOW)
            print(result.stdout)
            return False
    except Exception as e:
        log(f"⚠️  Could not run tests: {e}", Colors.YELLOW)
        return False

def main():
    log("🚀 MoneyQuest Backend Auto-Debug Script", Colors.BLUE)
    log("=" * 50, Colors.BLUE)
    
    # Change to backend directory
    backend_dir = Path(__file__).parent.parent
    os.chdir(backend_dir)
    log(f"📁 Working directory: {backend_dir}", Colors.BLUE)
    
    # Step 1: Fix RPGUpdate schema
    if not fix_rpg_schemas():
        log("\n❌ Failed to fix schemas", Colors.RED)
        sys.exit(1)
    
    # Step 2: Add test dependencies
    add_pytest_dependency()
    
    # Step 3: Validate imports
    validate_imports()
    
    # Step 4: Create tests
    create_backend_tests()
    
    # Step 5: Run tests (optional, may fail if env not set up)
    run_tests()
    
    log("\n" + "=" * 50, Colors.GREEN)
    log("🎉 Backend Debug Complete!", Colors.GREEN)
    log("=" * 50, Colors.GREEN)
    
    log("\n📝 Next steps:", Colors.BLUE)
    log("  1. Install dependencies: pip install -r requirements.txt", Colors.BLUE)
    log("  2. Run tests: pytest -v", Colors.BLUE)
    log("  3. Start server: uvicorn app.main:app --reload", Colors.BLUE)

if __name__ == "__main__":
    main()
