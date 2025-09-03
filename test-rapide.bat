@echo off
echo ========================================
echo   TEST RAPIDE - ORIGINALE PLUS
echo ========================================
echo.

echo 🔍 Verification des serveurs...
echo.

echo 1. Test du serveur API (port 5000)...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing; Write-Host '✅ Serveur API OK' -ForegroundColor Green } catch { Write-Host '❌ Serveur API KO' -ForegroundColor Red }"

echo.
echo 2. Test du serveur HTML (port 3000)...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing; Write-Host '✅ Serveur HTML OK' -ForegroundColor Green } catch { Write-Host '❌ Serveur HTML KO' -ForegroundColor Red }"

echo.
echo 3. Test des produits...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/products' -UseBasicParsing; $data = $response.Content | ConvertFrom-Json; Write-Host '✅ Produits OK - Nombre:' $data.data.Count -ForegroundColor Green } catch { Write-Host '❌ Produits KO' -ForegroundColor Red }"

echo.
echo 4. Test des catégories...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/categories' -UseBasicParsing; $data = $response.Content | ConvertFrom-Json; Write-Host '✅ Catégories OK - Nombre:' $data.data.Count -ForegroundColor Green } catch { Write-Host '❌ Catégories KO' -ForegroundColor Red }"

echo.
echo 5. Test des commandes...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/orders' -UseBasicParsing; $data = $response.Content | ConvertFrom-Json; Write-Host '✅ Commandes OK - Nombre:' $data.data.Count -ForegroundColor Green } catch { Write-Host '❌ Commandes KO' -ForegroundColor Red }"

echo.
echo ========================================
echo   RESULTATS DES TESTS
echo ========================================
echo.
echo 🌐 Site client: http://localhost:3000
echo 👨‍💼 Dashboard admin: http://localhost:3000/admin
echo 🔗 API: http://localhost:5000/api
echo.
echo Appuyez sur une touche pour continuer...
pause > nul
