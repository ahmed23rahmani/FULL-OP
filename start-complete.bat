@echo off
echo ========================================
echo    ORIGINALE PLUS - Serveur Complet
echo ========================================
echo.
echo Demarrage des serveurs...
echo.
echo 1. Serveur API (port 5000)...
start "API Server" cmd /k "node server-test-local.js"
echo.
echo 2. Serveur HTML (port 3000)...
timeout /t 3 /nobreak >nul
start "HTML Server" cmd /k "node serve-html.js"
echo.
echo ========================================
echo    Serveurs demarres !
echo ========================================
echo.
echo Site client: http://localhost:3000
echo Dashboard admin: http://localhost:3000/admin
echo API: http://localhost:5000/api
echo.
echo Appuyez sur une touche pour fermer...
pause >nul
