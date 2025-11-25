@echo off
echo.
echo ================================
echo בניית גרסת ייצור
echo ================================
echo.
call npm run build
echo.
if %errorlevel% equ 0 (
    echo.
    echo ✅ הבנייה הצליחה!
    echo.
    echo להפעלת השרת הרץ: start-production.bat
    echo.
) else (
    echo.
    echo ❌ הבנייה נכשלה! תקן את השגיאות ונסה שוב.
    echo.
)
pause
