import { list } from '@vercel/blob'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function debugBlob() {
  try {
    console.log('🔍 Debugging Blob Storage...\n')
    
    // רשימת כל הקבצים
    console.log('📦 Listing all blobs:')
    const allBlobs = await list()
    console.log(`Total blobs: ${allBlobs.blobs.length}\n`)
    
    if (allBlobs.blobs.length > 0) {
      console.log('First 10 blobs:')
      allBlobs.blobs.slice(0, 10).forEach((blob, i) => {
        console.log(`${i + 1}. ${blob.pathname}`)
      })
      console.log()
    }
    
    // חפש תמונות
    console.log('🖼️  Looking for thumbnails:')
    const thumbnailBlobs = await list({ prefix: 'dev/thumbnails/' })
    console.log(`Found ${thumbnailBlobs.blobs.length} thumbnail blobs\n`)
    
    if (thumbnailBlobs.blobs.length > 0) {
      console.log('First 10 thumbnails:')
      thumbnailBlobs.blobs.slice(0, 10).forEach((blob, i) => {
        console.log(`${i + 1}. ${blob.pathname}`)
      })
      console.log()
      
      // מצא ספרים
      const books = new Set()
      thumbnailBlobs.blobs.forEach(blob => {
        const parts = blob.pathname.split('/')
        if (parts.length >= 3) {
          books.add(parts[2])
        }
      })
      
      console.log(`📚 Found ${books.size} books:`)
      books.forEach(book => console.log(`  - ${book}`))
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

debugBlob()
