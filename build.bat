@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules\" (
    echo [WorldTools] Dependencies are missing. Running setup...
    call "%~dp0setup.bat"
    if errorlevel 1 exit /b 1
)

echo [WorldTools] Building renderer...
call npm run build
if errorlevel 1 exit /b 1

echo [WorldTools] Build completed.
