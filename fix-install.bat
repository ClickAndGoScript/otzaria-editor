@echo off
echo.
echo ================================
echo תיקון התקנה
echo ================================
echo.

echo שלב 1: מוחק .next...
if exist .next rmdir /s /q .next
echo ✅ .next נמחק

echo.
echo שלב 2: מנקה npm cache...
call npm cache clean --force
echo ✅ cache נוקה

echo.
echo שלב 3: מתקין מחדש (ללא מחיקת node_modules)...
call npm install
echo ✅ התקנה הושלמה

echo.
echo שלב 4: בונה...
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ הכל עבד!
    echo.
) else (
    echo.
    echo ❌ עדיין יש בעיה.
    echo נסה לסגור את כל התוכניות ולהריץ: reinstall.bat
    echo.
)
pause
