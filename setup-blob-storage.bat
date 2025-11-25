@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         הגדרת Vercel Blob Storage - מדריך מלא            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo סקריפט זה יעזור לך לעבור מקבצים מקומיים ל-Vercel Blob Storage
echo.
echo מה הסקריפט יעשה:
echo   1. יתקין את @vercel/blob
echo   2. ייצור קובץ storage helper
echo   3. יעלה את כל הנתונים הקיימים ל-Blob
echo   4. יעדכן את כל ה-API routes
echo   5. יבדוק שהכל עובד
echo.
echo ⚠️  לפני שמתחילים:
echo.
echo   1. וודא שיצרת Blob Store ב-Vercel:
echo      https://vercel.com/dashboard ^> Storage ^> Create ^> Blob
echo.
echo   2. חבר את ה-Blob Store לפרויקט שלך
echo.
echo   3. העתק את BLOB_READ_WRITE_TOKEN מ-Vercel
echo      Settings ^> Environment Variables
echo.
pause
echo.

REM בדיקה אם Blob Store מחובר
echo בודק אם BLOB_READ_WRITE_TOKEN מוגדר...
echo.

if not exist .env.local (
    echo יוצר .env.local...
    (
        echo # Vercel Blob Storage
        echo BLOB_READ_WRITE_TOKEN=
        echo.
        echo # NextAuth
        echo NEXTAUTH_URL=http://localhost:3000
        echo NEXTAUTH_SECRET=uXtB7d2N+lJDKvsENu2y8sXsmfrfa1qH2XsIiQN8X9k
    ) > .env.local
)

findstr /C:"BLOB_READ_WRITE_TOKEN" .env.local >nul
if %errorlevel% neq 0 (
    echo BLOB_READ_WRITE_TOKEN= >> .env.local
)

REM בדוק אם יש ערך
for /f "tokens=2 delims==" %%a in ('findstr "BLOB_READ_WRITE_TOKEN" .env.local') do set TOKEN=%%a

if "%TOKEN%"=="" (
    echo.
    echo ❌ BLOB_READ_WRITE_TOKEN לא מוגדר!
    echo.
    echo עשה את זה עכשיו:
    echo.
    echo 1. לך ל: https://vercel.com/dashboard
    echo 2. בחר את הפרויקט: otzariaeditor
    echo 3. Settings ^> Environment Variables
    echo 4. מצא BLOB_READ_WRITE_TOKEN
    echo 5. לחץ על העין לראות את הערך
    echo 6. העתק את הערך
    echo.
    echo 7. פתח את .env.local
    echo 8. הדבק את הערך אחרי BLOB_READ_WRITE_TOKEN=
    echo.
    echo דוגמה:
    echo BLOB_READ_WRITE_TOKEN=vercel_blob_rw_ABC123XYZ...
    echo.
    echo אחרי שתסיים, הרץ את הסקריפט שוב.
    echo.
    pause
    exit /b 1
)

echo ✅ BLOB_READ_WRITE_TOKEN מוגדר
echo.

REM הרץ את שלב 1 - התקנה והעלאה
echo ════════════════════════════════════════════════════════════
echo שלב 1: התקנה והעלאת נתונים
echo ════════════════════════════════════════════════════════════
echo.
call migrate-to-blob.bat
if %errorlevel% neq 0 (
    echo.
    echo ❌ שלב 1 נכשל!
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo שלב 2: עדכון API Routes
echo ════════════════════════════════════════════════════════════
echo.
echo האם הנתונים הועלו בהצלחה? ^(Y/N^)
set /p uploaded=
if /i not "%uploaded%"=="Y" (
    echo.
    echo בדוק את השגיאות ונסה שוב
    pause
    exit /b 1
)

call migrate-api-to-blob.bat
if %errorlevel% neq 0 (
    echo.
    echo ❌ שלב 2 נכשל!
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo שלב 3: בדיקה מקומית
echo ════════════════════════════════════════════════════════════
echo.
echo מריץ את האתר מקומית לבדיקה...
echo.
echo פתח דפדפן ב: http://localhost:3000
echo בדוק שהכל עובד:
echo   - התחברות
echo   - צפייה בספרים
echo   - תפיסת עמוד
echo   - שמירת תוכן
echo.
echo לחץ Ctrl+C כדי לעצור את השרת
echo.
pause
start http://localhost:3000
call npm run dev

echo.
echo ════════════════════════════════════════════════════════════
echo שלב 4: פריסה ל-Vercel
echo ════════════════════════════════════════════════════════════
echo.
echo האם הכל עבד מקומית? ^(Y/N^)
set /p works=
if /i not "%works%"=="Y" (
    echo.
    echo תקן את הבעיות ונסה שוב
    pause
    exit /b 1
)

echo.
echo מפרוס ל-Vercel...
echo.
call vercel --prod
if %errorlevel% neq 0 (
    echo.
    echo ❌ הפריסה נכשלה!
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              🎉 הכל מוכן ועובד!                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo מה עשינו:
echo   ✅ התקנו @vercel/blob
echo   ✅ יצרנו storage helper
echo   ✅ העלינו את כל הנתונים ל-Blob
echo   ✅ עדכנו את כל ה-API routes
echo   ✅ בדקנו מקומית
echo   ✅ פרסנו ל-Vercel
echo.
echo עכשיו האתר שלך עובד עם Vercel Blob Storage!
echo הנתונים נשמרים לצמיתות ולא נמחקים.
echo.
echo האתר שלך: https://otzariaeditor.vercel.app
echo.
pause
