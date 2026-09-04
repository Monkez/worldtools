@echo off
setlocal
cd /d "%~dp0"

call "%~dp0build.bat"
if errorlevel 1 exit /b 1

echo [WorldTools] Starting application...
call npm start
