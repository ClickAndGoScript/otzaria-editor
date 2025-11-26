import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// טען את github-storage אחרי dotenv
const { listImages, loadBookMapping } = await import('../src/lib/github-storage.js')

async function syncBooks() {
  const client = new MongoClient(process.env.DATABASE_URL)
  
  try {
    console.log('🔄 Syncing books from GitHub...\n')
    
    await client.connect()
    const db = client.db('otzaria')
    const collection = db.collection('files')
    
    // טען מיפוי ספרים
    const mapping = await loadBookMapping()
    console.log(`📋 Found ${Object.keys(mapping).length} books in mapping\n`)
    
    const books = []
    
    // עבור על כל ספר במיפוי
    for (const [bookId, bookName] of Object.entries(mapping)) {
      console.log(`📚 Processing: ${bookName}`)
      console.log(`   ID: ${bookId}`)
      
      // קבל תמונות מ-GitHub
      const images = await listImages(bookId)
      console.log(`   📸 Found ${images.length} pages`)
      
      if (images.length > 0) {
        books.push({
          id: bookName,
          name: bookName,
          totalPages: images.length,
          status: 'available',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        console.log(`   ✅ Added to list\n`)
      } else {
        console.log(`   ⚠️  No images found, skipping\n`)
      }
    }
    
    // שמור ל-MongoDB
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
    
    console.log('='.repeat(50))
    console.log(`✅ Sync completed!`)
    console.log(`📚 Total books: ${books.length}`)
    console.log('='.repeat(50))
    
  } catch (error) {
    console.error('❌ Sync failed:', error)
  } finally {
    await client.close()
  }
}

syncBooks()
