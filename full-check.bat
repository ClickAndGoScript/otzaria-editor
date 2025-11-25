@echo off
echo.
echo ================================
echo בדיקה מלאה לפני פריסה
echo ================================
echo.

echo שלב 1: בדיקת הגדרות...
node scripts/check-deployment-ready.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ יש בעיות בהגדרות! תקן אותן לפני שתמשיך.
    echo.
    pause
    exit /b 1
)

echo.
echo שלב 2: בניית הפרויקט...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ❌ הבנייה נכשלה! תקן את השגיאות.
    echo.
    pause
    exit /b 1
)

echo.
echo ================================
echo ✅ הכל מוכן לפריסה!
echo ================================
echo.
echo הצעדים הבאים:
echo 1. התקן Vercel: npm i -g vercel
echo 2. התחבר: vercel login
echo 3. פרוס: vercel
echo.
pause
