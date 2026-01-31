#!/usr/bin/env python3
"""
MoneyQuest Auto-Start Servers Script
一鍵啟動後端 FastAPI 與前端 Expo 開發伺服器

使用方式：
    python start_servers.py

停止伺服器：
    按 Ctrl+C
"""

import subprocess
import os
import sys
import time
import signal
from pathlib import Path
from threading import Thread
import re

# ANSI color codes
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    MAGENTA = '\033[95m'
    BOLD = '\033[1m'
    RESET = '\033[0m'

# Process storage for cleanup
processes = []

def log_backend(message):
    """Backend logs in blue"""
    print(f"{Colors.BLUE}[後端]{Colors.RESET} {message}")

def log_frontend(message):
    """Frontend logs in green"""
    print(f"{Colors.GREEN}[前端]{Colors.RESET} {message}")

def log_system(message):
    """System logs in cyan"""
    print(f"{Colors.CYAN}[系統]{Colors.RESET} {message}")

def log_error(message):
    """Error logs in red"""
    print(f"{Colors.RED}[錯誤]{Colors.RESET} {message}")

def log_success(message):
    """Success logs in green bold"""
    print(f"{Colors.GREEN}{Colors.BOLD}✅ {message}{Colors.RESET}")

def print_header():
    """Print startup header"""
    print(f"\n{Colors.CYAN}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.MAGENTA}🚀 MoneyQuest Auto-Start Servers{Colors.RESET}")
    print(f"{Colors.CYAN}{'='*60}{Colors.RESET}\n")

def check_project_structure():
    """Verify project directory structure"""
    log_system("檢查專案結構...")
    
    project_root = Path.cwd()
    backend_dir = project_root / "backend"
    frontend_dir = project_root / "frontend"
    
    if not backend_dir.exists():
        log_error(f"找不到 backend/ 目錄在 {project_root}")
        log_error("請確認在 MoneyQuest 專案根目錄執行此腳本")
        return False
    
    if not frontend_dir.exists():
        log_error(f"找不到 frontend/ 目錄在 {project_root}")
        return False
    
    log_success("專案結構正確")
    return True

def setup_backend_venv():
    """Setup backend virtual environment if needed"""
    log_backend("檢查 Python 虛擬環境...")
    
    backend_dir = Path.cwd() / "backend"
    venv_dir = backend_dir / "venv"
    
    if not venv_dir.exists():
        log_backend("建立虛擬環境中...")
        try:
            subprocess.run(
                ["python3", "-m", "venv", "venv"],
                cwd=backend_dir,
                check=True,
                capture_output=True
            )
            log_success("虛擬環境建立完成")
        except subprocess.CalledProcessError as e:
            log_error(f"虛擬環境建立失敗: {e}")
            log_error("請確認 python3 已安裝")
            return False
    else:
        log_backend("虛擬環境已存在")
    
    return True

def install_backend_deps():
    """Install backend dependencies"""
    log_backend("檢查後端依賴...")
    
    backend_dir = Path.cwd() / "backend"
    venv_python = backend_dir / "venv" / "bin" / "python"
    
    try:
        # Check if requirements are installed by trying to import fastapi
        check_cmd = [str(venv_python), "-c", "import fastapi; import uvicorn"]
        result = subprocess.run(check_cmd, capture_output=True)
        
        if result.returncode != 0:
            log_backend("安裝依賴中...")
            install_cmd = [
                str(venv_python), "-m", "pip", "install", "-q",
                "-r", "requirements.txt"
            ]
            subprocess.run(install_cmd, cwd=backend_dir, check=True)
            log_success("後端依賴安裝完成")
        else:
            log_backend("依賴已安裝")
    except subprocess.CalledProcessError as e:
        log_error(f"依賴安裝失敗: {e}")
        log_backend("請手動執行: cd backend && source venv/bin/activate && pip install -r requirements.txt")
        return False
    
    return True

def install_frontend_deps():
    """Install frontend dependencies if needed"""
    log_frontend("檢查前端依賴...")
    
    frontend_dir = Path.cwd() / "frontend"
    node_modules = frontend_dir / "node_modules"
    
    if not node_modules.exists():
        log_frontend("安裝依賴中（使用 --legacy-peer-deps）...")
        try:
            subprocess.run(
                ["npm", "install", "--legacy-peer-deps"],
                cwd=frontend_dir,
                check=True,
                capture_output=True
            )
            log_success("前端依賴安裝完成")
        except subprocess.CalledProcessError as e:
            log_error(f"依賴安裝失敗: {e}")
            return False
    else:
        log_frontend("依賴已安裝")
    
    return True

def stream_output(process, prefix_func, highlight_patterns=None):
    """Stream process output with colored prefix"""
    if highlight_patterns is None:
        highlight_patterns = []
    
    for line in iter(process.stdout.readline, b''):
        if line:
            decoded = line.decode('utf-8', errors='ignore').rstrip()
            
            # Highlight special patterns
            highlighted = False
            for pattern, color in highlight_patterns:
                if re.search(pattern, decoded, re.IGNORECASE):
                    print(f"{color}{prefix_func('')}{decoded}{Colors.RESET}")
                    highlighted = True
                    break
            
            if not highlighted:
                prefix_func(decoded)

def start_backend():
    """Start backend FastAPI server"""
    log_backend("啟動 FastAPI 伺服器...")
    
    backend_dir = Path.cwd() / "backend"
    venv_python = backend_dir / "venv" / "bin" / "python"
    
    cmd = [
        str(venv_python), "-m", "uvicorn",
        "app.main:app",
        "--reload",
        "--host", "0.0.0.0",
        "--port", "8000"
    ]
    
    try:
        process = subprocess.Popen(
            cmd,
            cwd=backend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            bufsize=1
        )
        processes.append(process)
        
        # Highlight patterns for backend
        patterns = [
            (r"Application startup complete", Colors.GREEN + Colors.BOLD),
            (r"Uvicorn running on", Colors.CYAN + Colors.BOLD),
            (r"http://", Colors.CYAN),
            (r"ERROR", Colors.RED),
            (r"WARNING", Colors.YELLOW)
        ]
        
        # Stream output in thread
        thread = Thread(target=stream_output, args=(process, log_backend, patterns))
        thread.daemon = True
        thread.start()
        
        log_success("後端伺服器啟動中...")
        return process
    
    except Exception as e:
        log_error(f"後端啟動失敗: {e}")
        return None

def start_frontend():
    """Start frontend Expo server"""
    log_frontend("啟動 Expo 開發伺服器...")
    
    frontend_dir = Path.cwd() / "frontend"
    
    cmd = ["npx", "expo", "start"]
    
    try:
        process = subprocess.Popen(
            cmd,
            cwd=frontend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            bufsize=1,
            env={**os.environ, "FORCE_COLOR": "1"}  # Preserve colors
        )
        processes.append(process)
        
        # Highlight patterns for frontend
        patterns = [
            (r"Metro.*waiting", Colors.GREEN + Colors.BOLD),
            (r"exp://", Colors.CYAN + Colors.BOLD),
            (r"https://expo", Colors.CYAN),
            (r"› Press", Colors.YELLOW),
            (r"ERROR", Colors.RED),
            (r"Logs for your project", Colors.GREEN)
        ]
        
        # Stream output in thread
        thread = Thread(target=stream_output, args=(process, log_frontend, patterns))
        thread.daemon = True
        thread.start()
        
        log_success("前端伺服器啟動中...")
        return process
    
    except Exception as e:
        log_error(f"前端啟動失敗: {e}")
        return None

def cleanup(signum=None, frame=None):
    """Cleanup all processes on exit"""
    print(f"\n{Colors.YELLOW}正在停止所有伺服器...{Colors.RESET}")
    
    for process in processes:
        try:
            process.terminate()
            process.wait(timeout=5)
        except:
            process.kill()
    
    log_system("所有伺服器已停止")
    sys.exit(0)

def print_instructions():
    """Print usage instructions"""
    print(f"\n{Colors.CYAN}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}📱 使用說明{Colors.RESET}\n")
    print(f"{Colors.YELLOW}後端 API:{Colors.RESET} http://127.0.0.1:8000")
    print(f"{Colors.YELLOW}API 文件:{Colors.RESET} http://127.0.0.1:8000/docs\n")
    print(f"{Colors.YELLOW}前端 App:{Colors.RESET}")
    print(f"  1. 使用 Expo Go App 掃描上方 QR code")
    print(f"  2. 或在終端按 'a' (Android) 或 'i' (iOS) 啟動模擬器\n")
    print(f"{Colors.RED}停止伺服器:{Colors.RESET} 按 Ctrl+C")
    print(f"{Colors.CYAN}{'='*60}{Colors.RESET}\n")

def main():
    """Main execution"""
    # Setup signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)
    
    print_header()
    
    # Step 1: Check project structure
    if not check_project_structure():
        sys.exit(1)
    
    # Step 2: Setup backend
    if not setup_backend_venv():
        sys.exit(1)
    
    if not install_backend_deps():
        log_error("請先手動安裝後端依賴後再運行")
        sys.exit(1)
    
    # Step 3: Setup frontend
    if not install_frontend_deps():
        log_error("請先手動安裝前端依賴後再運行")
        sys.exit(1)
    
    print(f"\n{Colors.CYAN}{'='*60}{Colors.RESET}\n")
    
    # Step 4: Start servers
    backend_process = start_backend()
    time.sleep(2)  # Give backend time to start
    
    frontend_process = start_frontend()
    
    if not backend_process or not frontend_process:
        log_error("伺服器啟動失敗")
        cleanup()
        sys.exit(1)
    
    time.sleep(3)  # Wait for initial logs
    
    # Print instructions
    print_instructions()
    
    log_system("伺服器運行中... (按 Ctrl+C 停止)")
    
    # Keep script running
    try:
        while True:
            time.sleep(1)
            
            # Check if processes are still alive
            if backend_process.poll() is not None:
                log_error("後端伺服器已停止")
                cleanup()
                break
            
            if frontend_process.poll() is not None:
                log_error("前端伺服器已停止")
                cleanup()
                break
    
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
