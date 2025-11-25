# מעבר ל-Vercel Blob Storage

## למה Vercel Blob?
- שומר קבצים לצמיתות (לא כמו file system רגיל ב-Vercel)
- חינמי עד 1GB
- עובד בדיוק כמו המערכת הנוכחית שלך
- קל להטמיע

## שלב 1: התקנה

```bash
npm install @vercel/blob
```

## שלב 2: הגדרת Blob Store ב-Vercel

1. לך ל: https://vercel.com/dashboard
2. בחר את הפרויקט שלך
3. **Storage** → **Create Database** → **Blob**
4. שם: `otzaria-files`
5. לחץ **Create**
6. לחץ **Connect Project** ובחר את הפרויקט

Vercel יוסיף אוטומטית את `BLOB_READ_WRITE_TOKEN`

## שלב 3: צור helper function

צור קובץ: `src/lib/storage.js`

```javascript
import { put, del, list } from '@vercel/blob'

// שמירת קובץ JSON
export async function saveJSON(path, data) {
  const blob = await put(path, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json'
  })
  return blob
}

// קריאת קובץ JSON
export async function readJSON(path) {
  try {
    const response = await fetch(`https://your-blob-url/${path}`)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

// שמירת קובץ טקסט
export async function saveText(path, content) {
  const blob = await put(path, content, {
    access: 'public',
    contentType: 'text/plain'
  })
  return blob
}

// קריאת קובץ טקסט
export async function readText(path) {
  try {
    const response = await fetch(`https://your-blob-url/${path}`)
    if (!response.ok) return null
    return await response.text()
  } catch {
    return null
  }
}

// מחיקת קובץ
export async function deleteFile(url) {
  await del(url)
}

// רשימת קבצים
export async function listFiles(prefix) {
  const { blobs } = await list({ prefix })
  return blobs
}
```

## שלב 4: עדכן את ה-API routes

במקום:
```javascript
const fs = require('fs')
const data = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'))
fs.writeFileSync('data/users.json', JSON.stringify(data, null, 2))
```

השתמש ב:
```javascript
import { readJSON, saveJSON } from '@/lib/storage'

const data = await readJSON('data/users.json') || []
await saveJSON('data/users.json', data)
```

## שלב 5: העבר נתונים קיימים

הרץ סקריפט להעלאת הנתונים הקיימים:

```javascript
// scripts/upload-to-blob.js
import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

async function uploadDirectory(dir, prefix = '') {
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      await uploadDirectory(filePath, `${prefix}${file}/`)
    } else {
      const content = fs.readFileSync(filePath)
      const blobPath = `${prefix}${file}`
      
      await put(blobPath, content, {
        access: 'public'
      })
      
      console.log(`✅ Uploaded: ${blobPath}`)
    }
  }
}

// העלה את כל תיקיית data
await uploadDirectory('./data', 'data/')
```

הרץ:
```bash
node scripts/upload-to-blob.js
```

## יתרונות
✅ קל להטמיע - רק להחליף fs ב-blob functions
✅ חינמי עד 1GB
✅ מהיר
✅ מתאים למבנה הקיים שלך

## חסרונות
⚠️ צריך לשנות את כל ה-API routes
⚠️ עלות אחרי 1GB ($0.15/GB)
