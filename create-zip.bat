@echo off
chcp 65001 >nul

echo.
echo יוצר קובץ ZIP לפריסה...
echo.

REM יצירת רשימת קבצים לא לכלול
(
echo node_modules/
echo .next/
echo .git/
echo .vercel/
echo *.log
echo .DS_Store
) > exclude.txt

echo ארוז את הקבצים...
echo.

powershell -Command "Compress-Archive -Path * -DestinationPath otzaria-deploy.zip -Force -CompressionLevel Fastest"

if exist otzaria-deploy.zip (
    echo.
    echo ✅ הקובץ otzaria-deploy.zip נוצר בהצלחה!
    echo.
    echo עכשיו:
    echo 1. לך ל: https://vercel.com/new
    echo 2. גרור את הקובץ otzaria-deploy.zip
    echo 3. Vercel יפרוס אוטומטית
    echo.
) else (
    echo.
    echo ❌ לא הצלחתי ליצור ZIP
    echo.
    echo נסה ידנית:
    echo 1. לחץ ימני על התיקייה otzariaeditor
    echo 2. שלח אל ^> תיקיית ZIP דחוסה
    echo 3. העלה ל-Vercel
    echo.
)

del exclude.txt 2>nul

pause
