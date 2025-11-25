# מעבר ל-MongoDB - פשוט ומהיר

## למה MongoDB?
- חינמי (512MB)
- מתאים לנתונים מובנים (users, pages, content)
- מהיר יותר מקבצים
- אין צורך בגיבויים ידניים

## התקנה מהירה

```bash
npm install mongodb
```

## הגדרת MongoDB Atlas (5 דקות)

עקוב אחרי `MONGODB_SETUP.md` שכבר יש לך.

## צור helper function

`src/lib/db.js`:

```javascript
import { MongoClient } from 'mongodb'

let client
let db

export async function connectDB() {
  if (db) return db
  
  client = new MongoClient(process.env.DATABASE_URL)
  await client.connect()
  db = client.db('otzaria')
  
  return db
}

// Users
export async function getUsers() {
  const db = await connectDB()
  return await db.collection('users').find({}).toArray()
}

export async function saveUser(user) {
  const db = await connectDB()
  return await db.collection('users').insertOne(user)
}

export async function updateUser(id, updates) {
  const db = await connectDB()
  return await db.collection('users').updateOne(
    { id },
    { $set: updates }
  )
}

// Pages
export async function getBookPages(bookPath) {
  const db = await connectDB()
  const doc = await db.collection('pages').findOne({ bookPath })
  return doc?.pages || []
}

export async function saveBookPages(bookPath, pages) {
  const db = await connectDB()
  return await db.collection('pages').updateOne(
    { bookPath },
    { $set: { bookPath, pages, updatedAt: new Date() } },
    { upsert: true }
  )
}

// Content
export async function getPageContent(bookPath, pageNumber) {
  const db = await connectDB()
  const doc = await db.collection('content').findOne({ 
    bookPath, 
    pageNumber 
  })
  return doc?.content || null
}

export async function savePageContent(bookPath, pageNumber, content) {
  const db = await connectDB()
  return await db.collection('content').updateOne(
    { bookPath, pageNumber },
    { 
      $set: { 
        bookPath, 
        pageNumber, 
        content, 
        updatedAt: new Date() 
      } 
    },
    { upsert: true }
  )
}
```

## עדכן API route אחד לדוגמה

`src/app/api/book/claim-page/route.js`:

**לפני:**
```javascript
const fs = require('fs')
const pagesData = JSON.parse(fs.readFileSync(pagesDataFile, 'utf-8'))
// ... עדכון
fs.writeFileSync(pagesDataFile, JSON.stringify(pagesData, null, 2))
```

**אחרי:**
```javascript
import { getBookPages, saveBookPages } from '@/lib/db'

const pagesData = await getBookPages(bookPath)
// ... עדכון
await saveBookPages(bookPath, pagesData)
```

## העבר נתונים קיימים

`scripts/migrate-to-mongodb.js`:

```javascript
import { MongoClient } from 'mongodb'
import fs from 'fs'
import path from 'path'

const client = new MongoClient(process.env.DATABASE_URL)

async function migrate() {
  await client.connect()
  const db = client.db('otzaria')
  
  // 1. העבר users
  const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'))
  await db.collection('users').insertMany(users)
  console.log(`✅ Migrated ${users.length} users`)
  
  // 2. העבר pages
  const pagesDir = 'data/pages'
  const pagesFiles = fs.readdirSync(pagesDir)
  
  for (const file of pagesFiles) {
    const bookPath = file.replace('.json', '')
    const pages = JSON.parse(
      fs.readFileSync(path.join(pagesDir, file), 'utf-8')
    )
    
    await db.collection('pages').insertOne({
      bookPath,
      pages,
      createdAt: new Date()
    })
    
    console.log(`✅ Migrated pages for: ${bookPath}`)
  }
  
  // 3. העבר content
  const contentDir = 'data/content'
  const contentFiles = fs.readdirSync(contentDir)
  
  for (const file of contentFiles) {
    const match = file.match(/(.+)_page_(\d+)\.txt/)
    if (!match) continue
    
    const [, bookPath, pageNumber] = match
    const content = fs.readFileSync(
      path.join(contentDir, file), 
      'utf-8'
    )
    
    await db.collection('content').insertOne({
      bookPath,
      pageNumber: parseInt(pageNumber),
      content,
      createdAt: new Date()
    })
    
    console.log(`✅ Migrated content: ${file}`)
  }
  
  await client.close()
  console.log('🎉 Migration complete!')
}

migrate().catch(console.error)
```

הרץ:
```bash
node scripts/migrate-to-mongodb.js
```

## יתרונות
✅ מתאים לנתונים מובנים
✅ חיפוש מהיר
✅ גיבויים אוטומטיים
✅ חינמי

## חסרונות
⚠️ צריך ללמוד MongoDB queries
⚠️ שינוי גדול בקוד
