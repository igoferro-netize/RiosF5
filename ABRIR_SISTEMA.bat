@echo off
echo Iniciando o Sistema RiosF5...
echo.

cd frontend\riosf5-frontend\frontend\riosf5-frontend 2>nul
if %errorlevel% neq 0 (
    cd frontend\riosf5-frontend 2>nul
)

npm run dev -- --open
pause
