@echo off
echo.
echo ================================
echo התקנה מחדש מלאה
echo ================================
echo.
echo זה יקח כמה דקות...
echo.

echo שלב 1: מוחק .next...
if exist .next rmdir /s /q .next
echo ✅ .next נמחק

echo.
echo שלב 2: מוחק node_modules...
echo (זה יכול לקחת זמן...)
if exist node_modules rmdir /s /q node_modules
echo ✅ node_modules נמחק

echo.
echo שלב 3: מתקין מחדש...
call npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ ההתקנה הצליחה!
    echo.
    echo עכשיו נסה להריץ: build.bat
    echo.
) else (
    echo.
    echo ❌ ההתקנה נכשלה!
    echo.
)
pause
