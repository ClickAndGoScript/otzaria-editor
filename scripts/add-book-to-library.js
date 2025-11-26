import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function addBook(bookName, totalPages) {
  const client = new MongoClient(process.env.DATABASE_URL)
  
  try {
    await client.connect()
    const db = client.db('otzaria')
    const collection = db.collection('files')
    
    // קרא את books.json הנוכחי
    const doc = await collection.findOne({ path: 'data/books.json' })
    let books = doc?.data || []
    
    // בדוק אם הספר כבר קיים
    const existingIndex = books.findIndex(b => b.name === bookName)
    
    const bookData = {
      id: bookName,
      name: bookName,
      totalPages: totalPages,
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    if (existingIndex >= 0) {
      // עדכן ספר קיים
      books[existingIndex] = { ...books[existingIndex], ...bookData }
      console.log(`✅ Updated book: ${bookName}`)
    } else {
      // הוסף ספר חדש
      books.push(bookData)
      console.log(`✅ Added new book: ${bookName}`)
    }
    
    // שמור חזרה ל-MongoDB
    await collection.updateOne(
      { path: 'data/books.json' },
      { 
        $set: { 
          path: 'data/books.json',
          data: books,
          contentType: 'application/json',
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )
    
    console.log(`💾 Saved to MongoDB`)
    console.log(`📚 Total books: ${books.length}`)
    
  } finally {
    await client.close()
  }
}

// קבל פרמטרים מ-command line
const bookName = process.argv[2]
const totalPages = parseInt(process.argv[3])

if (!bookName || !totalPages) {
  console.error('Usage: node scripts/add-book-to-library.js "שם הספר" מספר_עמודים')
  console.error('Example: node scripts/add-book-to-library.js "חוות דעת" 141')
  process.exit(1)
}

addBook(bookName, totalPages)
