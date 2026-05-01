@echo off
title WorldTools Development Server
echo ==============================================
echo       Starting WorldTools App...
echo ==============================================
echo.

echo [1/2] Checking and installing dependencies...
call npm install

echo.
echo [2/2] Starting Vite development server...
echo.
call npm run dev

pause
