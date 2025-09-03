@echo off
echo 🔧 Test CSS - ORIGINALE PLUS
echo.

echo 📋 Vérification des serveurs...
echo.

echo 🌐 Test Site Client...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:3000
echo.

echo 👨‍💼 Test Dashboard Admin...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:3000/admin
echo.

echo 🎨 Test CSS Client...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:3000/frontend/client/styles.css
echo.

echo 🎨 Test CSS Admin...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:3000/frontend/admin/styles.css
echo.

echo 🔗 Test API...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:5000/api/health
echo.

echo ✅ Tests terminés !
echo.
echo 🌐 Site Client: http://localhost:3000
echo 👨‍💼 Dashboard Admin: http://localhost:3000/admin
echo 🔗 API: http://localhost:5000/api/health
echo.
pause
