@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
    echo [WorldTools] Node.js and npm are required.
    exit /b 1
)

echo [WorldTools] Installing dependencies...
call npm install
if errorlevel 1 exit /b 1

echo [WorldTools] Setup completed.
