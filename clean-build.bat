@echo off
echo.
echo ================================
echo ניקוי ובנייה מחדש
echo ================================
echo.

echo שלב 1: מוחק .next...
if exist .next rmdir /s /q .next
echo ✅ .next נמחק

echo.
echo שלב 2: מוחק node_modules\.cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✅ cache נמחק

echo.
echo שלב 3: בונה מחדש...
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ הבנייה הצליחה!
    echo.
) else (
    echo.
    echo ❌ הבנייה נכשלה!
    echo.
)
pause
