@echo off
chcp 65001 >nul

echo.
echo מעדכן API route אחד לפעם...
echo.

set /p filepath="הכנס נתיב לקובץ (לדוגמה: src/app/api/users/list/route.js): "

if not exist "%filepath%" (
    echo ❌ הקובץ לא נמצא!
    pause
    exit /b 1
)

echo.
echo מעדכן %filepath%...
echo.

node -e "const fs=require('fs');let c=fs.readFileSync('%filepath%','utf-8');c=c.replace(/import fs from 'fs'/g,'');c=c.replace(/import path from 'path'/g,'import path from \\'path\\'\\nimport { saveJSON, readJSON, saveText, readText } from \\'@/lib/storage\\'');c=c.replace(/const (\w+)_PATH = path\.join\(process\.cwd\(\), 'data', '(\w+)'\)/g,'');c=c.replace(/JSON\.parse\(fs\.readFileSync\((\w+)_PATH, 'utf-8'\)\)/g,'await readJSON(\\'data/$2.json\\') || []');c=c.replace(/fs\.writeFileSync\((\w+)_PATH, JSON\.stringify\((\w+), null, 2\)\)/g,'await saveJSON(\\'data/$2.json\\', $2)');c=c.replace(/export function (GET|POST|PUT|DELETE|PATCH)/g,'export async function $1');fs.writeFileSync('%filepath%',c);"

echo ✅ הקובץ עודכן!
echo.
pause
