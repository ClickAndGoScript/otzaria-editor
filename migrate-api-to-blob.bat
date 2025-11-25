@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         עדכון API Routes ל-Blob Storage                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/3] יוצר גיבוי של API routes...
echo.

REM יצירת תיקיית גיבוי
set BACKUP_DIR=backup_api_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%
set BACKUP_DIR=%BACKUP_DIR: =0%
mkdir %BACKUP_DIR%

xcopy /E /I /Y src\app\api %BACKUP_DIR%\api >nul

echo ✅ גיבוי נוצר ב: %BACKUP_DIR%
echo.
echo [2/3] מעדכן API routes...
echo.

REM יצירת סקריפט Node לעדכון הקבצים
(
echo import fs from 'fs'
echo import path from 'path'
echo import { fileURLToPath } from 'url'
echo.
echo const __filename = fileURLToPath^(import.meta.url^)
echo const __dirname = path.dirname^(__filename^)
echo.
echo const apiDir = path.join^(__dirname, '..', 'src', 'app', 'api'^)
echo.
echo function updateFile^(filePath^) {
echo   let content = fs.readFileSync^(filePath, 'utf-8'^)
echo   let changed = false
echo.  
echo   // הוסף import של storage
echo   if ^(!content.includes^('from ^'@/lib/storage^''^) ^&^& content.includes^('fs.writeFileSync'^)^) {
echo     const importLine = "import { saveJSON, readJSON, saveText, readText } from '@/lib/storage'\n"
echo     content = importLine + content
echo     changed = true
echo   }
echo.  
echo   // החלף fs.readFileSync של JSON
echo   const readJsonRegex = /JSON\.parse\^(fs\.readFileSync\^([^^)]+\),\s*'utf-8'\^)\^)/g
echo   if ^(readJsonRegex.test^(content^)^) {
echo     content = content.replace^(readJsonRegex, 'await readJSON^($1^) ^|^| []'^)
echo     changed = true
echo   }
echo.  
echo   // החלף fs.writeFileSync של JSON
echo   const writeJsonRegex = /fs\.writeFileSync\^(([^^,]+),\s*JSON\.stringify\^(([^^)]+),\s*null,\s*2\^)\^)/g
echo   if ^(writeJsonRegex.test^(content^)^) {
echo     content = content.replace^(writeJsonRegex, 'await saveJSON^($1, $2^)'^)
echo     changed = true
echo   }
echo.  
echo   // החלף fs.readFileSync של טקסט
echo   const readTextRegex = /fs\.readFileSync\^(([^^,]+),\s*'utf-8'\^)/g
echo   if ^(readTextRegex.test^(content^)^) {
echo     content = content.replace^(readTextRegex, 'await readText^($1^)'^)
echo     changed = true
echo   }
echo.  
echo   // החלף fs.writeFileSync של טקסט
echo   const writeTextRegex = /fs\.writeFileSync\^(([^^,]+),\s*([^^,]+),\s*'utf-8'\^)/g
echo   if ^(writeTextRegex.test^(content^)^) {
echo     content = content.replace^(writeTextRegex, 'await saveText^($1, $2^)'^)
echo     changed = true
echo   }
echo.  
echo   // הוסף async לפונקציות
echo   if ^(changed ^&^& !content.includes^('export async function'^)^) {
echo     content = content.replace^(/export function (GET^|POST^|PUT^|DELETE^|PATCH)/g, 'export async function $1'^)
echo   }
echo.  
echo   if ^(changed^) {
echo     fs.writeFileSync^(filePath, content^)
echo     console.log^(`✅ Updated: ${path.relative^(apiDir, filePath^)}`^)
echo     return true
echo   }
echo   return false
echo }
echo.
echo function walkDir^(dir^) {
echo   const files = fs.readdirSync^(dir^)
echo   let count = 0
echo.  
echo   for ^(const file of files^) {
echo     const filePath = path.join^(dir, file^)
echo     const stat = fs.statSync^(filePath^)
echo.    
echo     if ^(stat.isDirectory^(^)^) {
echo       count += walkDir^(filePath^)
echo     } else if ^(file.endsWith^('.js'^) ^|^| file.endsWith^('.ts'^)^) {
echo       if ^(updateFile^(filePath^)^) count++
echo     }
echo   }
echo   return count
echo }
echo.
echo console.log^('🔄 מעדכן API routes...\n'^)
echo const count = walkDir^(apiDir^)
echo console.log^(`\n✅ עודכנו ${count} קבצים`^)
) > scripts\update-api-routes.js

node scripts\update-api-routes.js

echo.
echo [3/3] בודק שהכל תקין...
echo.

call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ יש שגיאות בקוד!
    echo.
    echo משחזר מגיבוי...
    xcopy /E /I /Y %BACKUP_DIR%\api src\app\api >nul
    echo.
    echo ✅ הקבצים שוחזרו
    echo.
    echo בדוק את השגיאות ונסה שוב
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  ✅ המעבר הושלם!                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo מה עשינו:
echo ✅ יצרנו גיבוי של API routes
echo ✅ עדכנו את כל הקבצים להשתמש ב-Blob Storage
echo ✅ בדקנו שהכל עובד
echo.
echo עכשיו תוכל לפרוס ל-Vercel:
echo.
echo   vercel --prod
echo.
echo או:
echo.
echo   deploy-vercel.bat
echo.
pause
