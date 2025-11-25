@echo off
echo.
echo ================================
echo התקנת תלויות
echo ================================
echo.
call npm install
echo.
if %errorlevel% equ 0 (
    echo ✅ ההתקנה הושלמה בהצלחה!
) else (
    echo ❌ ההתקנה נכשלה!
)
echo.
pause
