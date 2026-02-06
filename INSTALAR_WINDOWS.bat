@echo off
echo ======================================================
echo   Instalador RiosF5 - Corrigindo Dependencias
echo ======================================================
echo.

echo [1/3] Entrando na pasta do frontend...
cd frontend\riosf5-frontend\frontend\riosf5-frontend 2>nul
if %errorlevel% neq 0 (
    cd frontend\riosf5-frontend 2>nul
)

echo [2/3] Limpando instalacoes anteriores...
if exist node_modules (
    echo Removendo node_modules antigo...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    del /f /q package-lock.json
)

echo [3/3] Instalando dependencias (isso pode demorar alguns minutos)...
call npm install --legacy-peer-deps

echo.
echo ======================================================
echo   Instalacao Concluida! 
echo   Agora voce pode usar o arquivo ABRIR_SISTEMA.bat
echo ======================================================
pause
