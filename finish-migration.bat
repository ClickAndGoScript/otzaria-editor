@echo off
chcp 65001 >nul

echo.
echo 🔄 מסיים את המעבר ל-Blob Storage...
echo.
echo זה יעדכן את כל הקבצים שנשארו.
echo.

node scripts/finish-migration.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ המעבר הושלם!
    echo.
    echo עכשיו תוכל לפרוס ל-Vercel והכל יעבוד.
    echo.
) else (
    echo.
    echo ❌ היתה בעיה במעבר
    echo.
)

pause
