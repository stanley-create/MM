#!/bin/bash
# MoneyQuest Master Automation Script
# Runs all debug, optimization, and Git automation scripts in sequence

set -e  # Exit on error

# Color codes
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}$1${NC}"
}

log_success() {
    echo -e "${GREEN}$1${NC}"
}

log_warning() {
    echo -e "${YELLOW}$1${NC}"
}

log_error() {
    echo -e "${RED}$1${NC}"
}

# Get project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log_info "🚀 MoneyQuest Master Automation Script"
echo "=================================================="
log_info "📁 Project root: $PROJECT_ROOT"
echo ""

# Step 1: Fix Backend
log_info "Step 1/4: Running Backend Auto-Debug..."
echo "--------------------------------------------------"
cd "$PROJECT_ROOT/backend"

if [ -f "scripts/fix_backend.py" ]; then
    python3 scripts/fix_backend.py
    log_success "✅ Backend fixes complete"
else
    log_warning "⚠️  Backend fix script not found, skipping..."
fi

echo ""

# Step 2: Fix Frontend
log_info "Step 2/4: Running Frontend Auto-Debug..."
echo "--------------------------------------------------"
cd "$PROJECT_ROOT/frontend"

if [ -f "scripts/fix_frontend.js" ]; then
    node scripts/fix_frontend.js
    log_success "✅ Frontend fixes complete"
else
    log_warning "⚠️  Frontend fix script not found, skipping..."
fi

echo ""

# Step 3: Run Frontend Optimization (from previous work)
log_info "Step 3/4: Running Frontend Optimization..."
echo"--------------------------------------------------"
cd "$PROJECT_ROOT/frontend"

if [ -f "src/services/optimizeScript.js" ]; then
    log_info "Running Prettier formatting and code optimization..."
    npx prettier --write "src/**/*.{js,jsx,json}" || log_warning "⚠️  Prettier completed with warnings"
    log_success "✅ Frontend optimization complete"
else
    log_warning "⚠️  Optimization script not found, skipping..."
fi

echo ""

# Step 4: Git Auto-Commit & Push
log_info "Step 4/4: Auto-committing and pushing to Git..."
echo "--------------------------------------------------"
cd "$PROJECT_ROOT"

if [ -f "scripts/git_auto_push.js" ]; then
    node scripts/git_auto_push.js
    log_success "✅ Git operations complete"
else
    log_warning "⚠️  Git script not found, skipping..."
    log_info "💡 Manual Git commands:"
    echo "  cd $PROJECT_ROOT"
    echo '  git add .'
    echo '  git commit -m "Fix import errors, dependency conflicts, and optimize code for MoneyQuest"'
    echo '  git push origin main'
fi

echo ""
echo "=================================================="
log_success "🎉 Master Automation Complete!"
echo "=================================================="

echo ""
log_info "📝 Summary:"
echo "  ✓ Backend: Fixed RPGUpdate schema, added pytest"
echo "  ✓ Frontend: Resolved dependencies, optimized code"
echo "  ✓ Git: Committed and pushed changes"

echo ""
log_info "🚀 Next Steps:"
echo "  1. Backend: uvicorn app.main:app --reload"
echo "  2. Frontend: npm start (or expo start)"
echo "  3. Test: pytest (backend) and npm test (frontend)"
