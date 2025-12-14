/**
 * סקריפט לסנכרון ספרים מהמיפוי המקומי ל-MongoDB
 * מריצים: node scripts/sync-local-to-mongodb.js
 */

import { MongoClient } from 'mongodb'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function syncToMongoDB() {
  const client = new MongoClient(process.env.DATABASE_URL)
  
  try {
    // קרא את המיפוי המקומי
    const localMappingPath = 'data/book-mapping-local.json'
    if (!fs.existsSync(localMappingPath)) {
      console.log('❌ לא נמצא קובץ מיפוי מקומי')
      return
    }
    
    const localMapping = JSON.parse(fs.readFileSync(localMappingPath, 'utf-8'))
    console.log(`📖 נמצאו ${Object.keys(localMapping).length} ספרים במיפוי המקומי`)
    
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db('otzaria')
    const collection = db.collection('files')
    
    // קרא את המיפוי הקיים ב-MongoDB
    const mappingPath = 'data/book-mapping.json'
    const mappingDoc = await collection.findOne({ path: mappingPath })
    const mongoMapping = mappingDoc?.data || {}
    
    console.log(`📦 נמצאו ${Object.keys(mongoMapping).length} ספרים ב-MongoDB`)
    
    // מצא ספרים חסרים
    let addedCount = 0
    
    for (const [bookId, bookInfo] of Object.entries(localMapping)) {
      const bookName = bookInfo.name
      const totalPages = bookInfo.totalPages
      
      // בדוק אם הספר כבר קיים ב-MongoDB
      if (mongoMapping[bookId]) {
        console.log(`⏭️  ${bookName} - כבר קיים`)
        continue
      }
      
      console.log(`\n📚 מוסיף: ${bookName} (${totalPages} עמודים)`)
      
      // 1. עדכן את המיפוי
      mongoMapping[bookId] = bookName
      
      // 2. צור קובץ עמודים
      const pages = []
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          number: i,
          status: 'available',
          claimedBy: null,
          claimedById: null,
          claimedAt: null,
          completedAt: null,
          thumbnail: `github:${bookId}_page-${i}.jpg`
        })
      }
      
      const pagesPath = `data/pages/${bookName}.json`
      await collection.updateOne(
        { path: pagesPath },
        { $set: { path: pagesPath, data: pages, updatedAt: new Date() } },
        { upsert: true }
      )
      console.log(`   ✅ נוצר ${pagesPath}`)
      
      addedCount++
    }
    
    // שמור את המיפוי המעודכן
    if (addedCount > 0) {
      await collection.updateOne(
        { path: mappingPath },
        { $set: { path: mappingPath, data: mongoMapping, updatedAt: new Date() } },
        { upsert: true }
      )
      console.log(`\n✅ המיפוי עודכן ב-MongoDB`)
      
      // עדכן גם את books.json
      const booksPath = 'data/books.json'
      const booksDoc = await collection.findOne({ path: booksPath })
      let books = booksDoc?.data || []
      
      for (const [bookId, bookInfo] of Object.entries(localMapping)) {
        const bookName = bookInfo.name
        const totalPages = bookInfo.totalPages
        
        // בדוק אם הספר כבר קיים ב-books.json
        const existingIndex = books.findIndex(b => b.name === bookName || b.id === bookName)
        
        const bookData = {
          id: bookName,
          name: bookName,
          totalPages: totalPages,
          status: 'available',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        if (existingIndex >= 0) {
          books[existingIndex] = { ...books[existingIndex], ...bookData }
        } else {
          books.push(bookData)
        }
      }
      
      await collection.updateOne(
        { path: booksPath },
        { $set: { path: booksPath, data: books, updatedAt: new Date() } },
        { upsert: true }
      )
      console.log(`✅ books.json עודכן`)
    }
    
    console.log(`\n🎉 סיום! נוספו ${addedCount} ספרים חדשים`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

syncToMongoDB()
