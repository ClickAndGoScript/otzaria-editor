@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         מעבר ל-Vercel Blob Storage - אוטומטי             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM בדיקה אם Node מותקן
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js לא מותקן!
    echo.
    echo התקן מ: https://nodejs.org
    pause
    exit /b 1
)

echo [1/6] התקנת @vercel/blob...
echo.
call npm install @vercel/blob
if %errorlevel% neq 0 (
    echo ❌ התקנה נכשלה!
    pause
    exit /b 1
)

echo.
echo ✅ @vercel/blob הותקן בהצלחה
echo.
echo [2/6] יוצר קובץ storage helper...
echo.

REM יצירת src/lib/storage.js
mkdir src\lib 2>nul

(
echo import { put, del, list, head } from '@vercel/blob'
echo.
echo const BLOB_PREFIX = process.env.VERCEL_ENV === 'production' ? 'prod/' : 'dev/'
echo.
echo // שמירת קובץ JSON
echo export async function saveJSON^(path, data^) {
echo   try {
echo     const blob = await put^(BLOB_PREFIX + path, JSON.stringify^(data, null, 2^), {
echo       access: 'public',
echo       contentType: 'application/json',
echo       addRandomSuffix: false
echo     }^)
echo     return blob
echo   } catch ^(error^) {
echo     console.error^('Error saving JSON:', error^)
echo     throw error
echo   }
echo }
echo.
echo // קריאת קובץ JSON
echo export async function readJSON^(path^) {
echo   try {
echo     const blobs = await list^({ prefix: BLOB_PREFIX + path, limit: 1 }^)
echo     if ^(blobs.blobs.length === 0^) return null
echo.    
echo     const response = await fetch^(blobs.blobs[0].url^)
echo     if ^(!response.ok^) return null
echo     return await response.json^(^)
echo   } catch ^(error^) {
echo     console.error^('Error reading JSON:', error^)
echo     return null
echo   }
echo }
echo.
echo // שמירת קובץ טקסט
echo export async function saveText^(path, content^) {
echo   try {
echo     const blob = await put^(BLOB_PREFIX + path, content, {
echo       access: 'public',
echo       contentType: 'text/plain; charset=utf-8',
echo       addRandomSuffix: false
echo     }^)
echo     return blob
echo   } catch ^(error^) {
echo     console.error^('Error saving text:', error^)
echo     throw error
echo   }
echo }
echo.
echo // קריאת קובץ טקסט
echo export async function readText^(path^) {
echo   try {
echo     const blobs = await list^({ prefix: BLOB_PREFIX + path, limit: 1 }^)
echo     if ^(blobs.blobs.length === 0^) return null
echo.    
echo     const response = await fetch^(blobs.blobs[0].url^)
echo     if ^(!response.ok^) return null
echo     return await response.text^(^)
echo   } catch ^(error^) {
echo     console.error^('Error reading text:', error^)
echo     return null
echo   }
echo }
echo.
echo // מחיקת קובץ
echo export async function deleteFile^(url^) {
echo   try {
echo     await del^(url^)
echo   } catch ^(error^) {
echo     console.error^('Error deleting file:', error^)
echo   }
echo }
echo.
echo // רשימת קבצים
echo export async function listFiles^(prefix^) {
echo   try {
echo     const { blobs } = await list^({ prefix: BLOB_PREFIX + prefix }^)
echo     return blobs
echo   } catch ^(error^) {
echo     console.error^('Error listing files:', error^)
echo     return []
echo   }
echo }
echo.
echo // בדיקה אם קובץ קיים
echo export async function fileExists^(path^) {
echo   try {
echo     const blobs = await list^({ prefix: BLOB_PREFIX + path, limit: 1 }^)
echo     return blobs.blobs.length ^> 0
echo   } catch {
echo     return false
echo   }
echo }
) > src\lib\storage.js

echo ✅ storage.js נוצר
echo.
echo [3/6] יוצר סקריפט העלאת נתונים...
echo.

REM יצירת scripts/upload-to-blob.js
(
echo import { put } from '@vercel/blob'
echo import fs from 'fs'
echo import path from 'path'
echo import { fileURLToPath } from 'url'
echo.
echo const __filename = fileURLToPath^(import.meta.url^)
echo const __dirname = path.dirname^(__filename^)
echo.
echo const BLOB_PREFIX = 'prod/'
echo.
echo async function uploadDirectory^(dir, prefix = ''^) {
echo   if ^(!fs.existsSync^(dir^)^) {
echo     console.log^(`⚠️  Directory not found: ${dir}`^)
echo     return
echo   }
echo.
echo   const files = fs.readdirSync^(dir^)
echo   let uploadCount = 0
echo.  
echo   for ^(const file of files^) {
echo     const filePath = path.join^(dir, file^)
echo     const stat = fs.statSync^(filePath^)
echo.    
echo     if ^(stat.isDirectory^(^)^) {
echo       await uploadDirectory^(filePath, `${prefix}${file}/`^)
echo     } else {
echo       const content = fs.readFileSync^(filePath^)
echo       const blobPath = `${BLOB_PREFIX}${prefix}${file}`
echo.      
echo       try {
echo         await put^(blobPath, content, {
echo           access: 'public',
echo           addRandomSuffix: false
echo         }^)
echo         uploadCount++
echo         console.log^(`✅ ${uploadCount}. Uploaded: ${prefix}${file}`^)
echo       } catch ^(error^) {
echo         console.error^(`❌ Failed: ${prefix}${file}`, error.message^)
echo       }
echo     }
echo   }
echo }
echo.
echo async function main^(^) {
echo   console.log^('🚀 מתחיל העלאת נתונים ל-Vercel Blob...\n'^)
echo.  
echo   // העלה את כל תיקיית data
echo   await uploadDirectory^('./data', 'data/'^)
echo.  
echo   console.log^('\n🎉 ההעלאה הושלמה!'^)
echo   console.log^('עכשיו תוכל לפרוס ל-Vercel והנתונים יהיו שמורים.'^)
echo }
echo.
echo main^(^).catch^(console.error^)
) > scripts\upload-to-blob.js

echo ✅ upload-to-blob.js נוצר
echo.
echo [4/6] מוסיף type: module ל-package.json...
echo.

REM עדכון package.json להוסיף type: module
node -e "const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('package.json','utf-8'));pkg.type='module';fs.writeFileSync('package.json',JSON.stringify(pkg,null,2));"

echo ✅ package.json עודכן
echo.
echo [5/6] בודק אם יש BLOB_READ_WRITE_TOKEN...
echo.

if not exist .env.local (
    echo ⚠️  .env.local לא קיים, יוצר...
    echo BLOB_READ_WRITE_TOKEN= > .env.local
)

findstr /C:"BLOB_READ_WRITE_TOKEN" .env.local >nul
if %errorlevel% neq 0 (
    echo BLOB_READ_WRITE_TOKEN= >> .env.local
    echo ✅ הוספתי BLOB_READ_WRITE_TOKEN ל-.env.local
) else (
    echo ✅ BLOB_READ_WRITE_TOKEN כבר קיים
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    פעולות נדרשות ממך                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 1. לך ל: https://vercel.com/dashboard
echo 2. בחר את הפרויקט שלך
echo 3. Settings ^> Environment Variables
echo 4. מצא את BLOB_READ_WRITE_TOKEN
echo 5. העתק את הערך
echo 6. פתח את .env.local והדבק את הערך אחרי BLOB_READ_WRITE_TOKEN=
echo.
echo לאחר מכן:
echo.
echo [6/6] הרץ: node scripts/upload-to-blob.js
echo.
echo זה יעלה את כל הנתונים מ-data/ ל-Vercel Blob
echo.
pause
echo.
echo האם סיימת להוסיף את BLOB_READ_WRITE_TOKEN? ^(Y/N^)
set /p ready=
if /i "%ready%"=="Y" (
    echo.
    echo [6/6] מעלה נתונים ל-Vercel Blob...
    echo.
    node scripts/upload-to-blob.js
    if %errorlevel% equ 0 (
        echo.
        echo ╔════════════════════════════════════════════════════════════╗
        echo ║                  ✅ הכל מוכן!                             ║
        echo ╚════════════════════════════════════════════════════════════╝
        echo.
        echo עכשיו צריך לעדכן את ה-API routes להשתמש ב-storage.js
        echo.
        echo הרץ: migrate-api-to-blob.bat
        echo.
    ) else (
        echo.
        echo ❌ ההעלאה נכשלה!
        echo בדוק שהוספת את BLOB_READ_WRITE_TOKEN נכון ב-.env.local
        echo.
    )
) else (
    echo.
    echo אחרי שתוסיף את BLOB_READ_WRITE_TOKEN, הרץ:
    echo node scripts/upload-to-blob.js
    echo.
)

pause
