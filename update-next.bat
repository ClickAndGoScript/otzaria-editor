@echo off
echo.
echo ================================
echo עדכון Next.js
echo ================================
echo.

echo מעדכן Next.js לגרסה אחרונה...
call npm install next@latest react@latest react-dom@latest

if %errorlevel% equ 0 (
    echo.
    echo ✅ העדכון הצליח!
    echo.
    echo עכשיו מנסה לבנות...
    call npm run build
    
    if %errorlevel% equ 0 (
        echo.
        echo ✅ הבנייה הצליחה!
        echo.
    ) else (
        echo.
        echo ❌ הבנייה עדיין נכשלת.
        echo.
    )
) else (
    echo.
    echo ❌ העדכון נכשל!
    echo.
)
pause
