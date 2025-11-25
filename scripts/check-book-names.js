import { list } from '@vercel/blob'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function checkBookNames() {
  try {
    console.log('🔍 Checking exact book names in Blob Storage...\n')
    
    const thumbnailBlobs = await list({ prefix: 'dev/thumbnails/' })
    console.log(`Found ${thumbnailBlobs.blobs.length} thumbnail files\n`)
    
    // מצא את כל שמות הספרים
    const books = new Map()
    
    thumbnailBlobs.blobs.forEach(blob => {
      const parts = blob.pathname.split('/')
      // dev/thumbnails/BOOKNAME/file.jpg
      if (parts.length >= 4) {
        const bookName = parts[2]
        if (!books.has(bookName)) {
          books.set(bookName, [])
        }
        books.get(bookName).push(blob.pathname)
      }
    })
    
    console.log(`📚 Found ${books.size} unique book(s):\n`)
    
    books.forEach((files, bookName) => {
      console.log(`Book: "${bookName}"`)
      console.log(`  Length: ${bookName.length} chars`)
      console.log(`  Char codes:`, Array.from(bookName).map(c => c.charCodeAt(0)))
      console.log(`  Encoded: ${encodeURIComponent(bookName)}`)
      console.log(`  Files: ${files.length}`)
      console.log(`  First file: ${files[0]}`)
      console.log()
    })
    
    // נסה לחפש עם שמות שונים
    console.log('🔎 Testing different search patterns:\n')
    
    const testNames = [
      'חוות דעת',
      'חוות%20דעת',
      encodeURIComponent('חוות דעת')
    ]
    
    for (const testName of testNames) {
      const prefix = `dev/thumbnails/${testName}/`
      console.log(`Searching: "${prefix}"`)
      const results = await list({ prefix })
      console.log(`  Found: ${results.blobs.length} files`)
      if (results.blobs.length > 0) {
        console.log(`  ✅ SUCCESS!`)
      }
      console.log()
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkBookNames()
