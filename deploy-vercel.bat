@echo off
chcp 65001 >nul
echo.
echo ════════════════════════════════════════════════════════════
echo                    פריסה ל-Vercel
echo ════════════════════════════════════════════════════════════
echo.

REM בדיקה אם vercel מותקן
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Vercel CLI לא מותקן!
    echo.
    echo מתקין Vercel CLI...
    call npm i -g vercel
    echo ✅ Vercel CLI הותקן בהצלחה!
    echo.
)

echo ✅ Vercel CLI מותקן
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo בחר אפשרות:
echo.
echo [1] התחברות ל-Vercel (פעם ראשונה)
echo [2] פריסה ראשונית (Preview)
echo [3] פריסה לייצור (Production)
echo [4] הצג סטטוס
echo.
echo [0] ביטול
echo.
echo ════════════════════════════════════════════════════════════
echo.
set /p choice="בחר (0-4): "

if "%choice%"=="1" goto login
if "%choice%"=="2" goto deploy_preview
if "%choice%"=="3" goto deploy_prod
if "%choice%"=="4" goto status
if "%choice%"=="0" goto end
goto end

:login
echo.
echo ════════════════════════════════════════════════════════════
echo התחברות ל-Vercel
echo ════════════════════════════════════════════════════════════
echo.
echo זה יפתח דפדפן להתחברות...
echo.
call vercel login
echo.
if %errorlevel% equ 0 (
    echo ✅ התחברת בהצלחה!
    echo.
    echo עכשיו הרץ שוב את הסקריפט ובחר אפשרות 2 לפריסה.
) else (
    echo ❌ ההתחברות נכשלה!
)
echo.
pause
goto end

:deploy_preview
echo.
echo ════════════════════════════════════════════════════════════
echo פריסה ראשונית (Preview)
echo ════════════════════════════════════════════════════════════
echo.
echo זה יפרוס את האתר לסביבת בדיקה...
echo.
call vercel
echo.
if %errorlevel% equ 0 (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo ✅ הפריסה הצליחה!
    echo ════════════════════════════════════════════════════════════
    echo.
    echo 📝 צעדים הבאים:
    echo.
    echo 1. בדוק את האתר בכתובת שקיבלת למעלה
    echo 2. לך ל: https://vercel.com/dashboard
    echo 3. בחר את הפרויקט → Storage → Create Database → Postgres
    echo 4. אחרי יצירת מסד הנתונים, הרץ שוב ובחר אפשרות 3
    echo.
) else (
    echo ❌ הפריסה נכשלה!
)
echo.
pause
goto end

:deploy_prod
echo.
echo ════════════════════════════════════════════════════════════
echo פריסה לייצור (Production)
echo ════════════════════════════════════════════════════════════
echo.
echo ⚠️  וודא שעשית את הדברים הבאים:
echo.
echo [✓] יצרת מסד נתונים ב-Vercel (Storage → Postgres)
echo [✓] הוספת את NEXTAUTH_SECRET במשתני סביבה של Vercel
echo [✓] הוספת את NEXTAUTH_URL במשתני סביבה של Vercel
echo.
set /p confirm="האם עשית את כל הדברים למעלה? (y/n): "

if /i not "%confirm%"=="y" (
    echo.
    echo ביטול פריסה.
    echo.
    echo 📖 ראה DEPLOYMENT.md להוראות מפורטות.
    echo.
    pause
    goto end
)

echo.
echo פורס לייצור...
echo.
call vercel --prod
echo.
if %errorlevel% equ 0 (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo 🎉 הפריסה לייצור הצליחה!
    echo ════════════════════════════════════════════════════════════
    echo.
    echo האתר שלך חי באינטרנט! 🚀
    echo.
    echo בדוק את הכתובת שקיבלת למעלה.
    echo.
) else (
    echo ❌ הפריסה נכשלה!
    echo.
    echo בדוק את השגיאות למעלה.
    echo.
)
echo.
pause
goto end

:status
echo.
echo ════════════════════════════════════════════════════════════
echo סטטוס פרויקטים
echo ════════════════════════════════════════════════════════════
echo.
call vercel ls
echo.
pause
goto end

:end
exit /b 0
