@echo off
chcp 65001 >nul
:menu
cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║              ספריית אוצריא - תפריט ראשי                  ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo  פיתוח:
echo  -------
echo  [1] הפעלת שרת פיתוח (npm run dev)
echo  [2] בניית גרסת ייצור (npm run build)
echo  [3] הפעלת שרת ייצור (npm start)
echo.
echo  הכנה לפריסה:
echo  ------------
echo  [4] יצירת NEXTAUTH_SECRET
echo  [5] בדיקת מוכנות לפריסה
echo  [6] בדיקה מלאה (בדיקה + בנייה)
echo.
echo  ניהול:
echo  ------
echo  [7] התקנת תלויות (npm install)
echo  [8] סטטיסטיקות נתונים
echo.
echo  [0] יציאה
echo.
echo ═══════════════════════════════════════════════════════════
echo.
set /p choice="בחר אפשרות (0-8): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto build
if "%choice%"=="3" goto production
if "%choice%"=="4" goto secret
if "%choice%"=="5" goto check
if "%choice%"=="6" goto fullcheck
if "%choice%"=="7" goto install
if "%choice%"=="8" goto stats
if "%choice%"=="0" goto end
goto menu

:dev
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo  הפעלת שרת פיתוח
echo ═══════════════════════════════════════════════════════════
echo.
echo האתר יהיה זמין ב: http://localhost:3000
echo לעצירה לחץ Ctrl+C
echo.
call npm run dev
goto menu

:build
cls
call build.bat
goto menu

:production
cls
call start-production.bat
goto menu

:secret
cls
call generate-secret.bat
goto menu

:check
cls
call check-deploy.bat
goto menu

:fullcheck
cls
call full-check.bat
goto menu

:install
cls
call install.bat
goto menu

:stats
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo  סטטיסטיקות נתונים
echo ═══════════════════════════════════════════════════════════
echo.
call npm run data:stats
echo.
pause
goto menu

:end
cls
echo.
echo להתראות! 👋
echo.
exit
