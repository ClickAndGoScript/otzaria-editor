@echo off
echo.
echo ════════════════════════════════════════════════════════════
echo הכנה לפריסה - הסרת תלויות כבדות
echo ════════════════════════════════════════════════════════════
echo.

echo שלב 1: מוחק node_modules...
if exist node_modules rmdir /s /q node_modules
echo ✅ נמחק

echo.
echo שלב 2: מתקין תלויות מחדש (בלי החבילות הכבדות)...
call npm install
echo ✅ הותקן

echo.
echo שלב 3: בונה...
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ מוכן לפריסה!
    echo.
    echo עכשיו הרץ: deploy-vercel.bat
    echo.
) else (
    echo.
    echo ❌ הבנייה נכשלה!
    echo.
)
pause
