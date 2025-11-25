@echo off
chcp 65001 >nul

echo.
echo 🚀 מעלה נתונים ל-Vercel Blob...
echo.

node scripts/upload-to-blob.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ ההעלאה הושלמה בהצלחה!
    echo.
) else (
    echo.
    echo ❌ ההעלאה נכשלה!
    echo בדוק את BLOB_READ_WRITE_TOKEN ב-.env.local
    echo.
)

pause
