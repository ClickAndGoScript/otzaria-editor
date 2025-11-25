@echo off
chcp 65001 >nul

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              פריסה ל-Vercel עם Blob Storage               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/2] בודק שהכל תקין...
echo.

call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ❌ יש שגיאות בקוד!
    echo תקן את השגיאות לפני הפריסה.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ הבנייה הצליחה!
echo.
echo [2/2] מפרוס ל-Vercel...
echo.

REM בדוק אם vercel מותקן
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Vercel CLI לא מותקן!
    echo.
    echo מתקין Vercel CLI...
    call npm install -g vercel
    echo.
)

echo מפרוס לייצור...
echo.

vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════════╗
    echo ║                  ✅ הפריסה הושלמה!                        ║
    echo ╚════════════════════════════════════════════════════════════╝
    echo.
    echo האתר שלך עכשיו חי עם Blob Storage!
    echo כל הנתונים נשמרים ב-Vercel Blob.
    echo.
) else (
    echo.
    echo ❌ הפריסה נכשלה!
    echo.
    echo אפשרויות חלופיות:
    echo.
    echo 1. פרוס דרך הממשק של Vercel:
    echo    - לך ל: https://vercel.com/dashboard
    echo    - בחר את הפרויקט
    echo    - לחץ על "Deployments"
    echo    - לחץ על "Redeploy"
    echo.
    echo 2. או העלה את הקבצים ידנית:
    echo    - ארוז את התיקייה
    echo    - העלה דרך Vercel Dashboard
    echo.
)

pause
