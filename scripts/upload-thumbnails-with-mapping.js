import { Octokit } from '@octokit/rest'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const GITHUB_OWNER = process.env.GITHUB_OWNER
const GITHUB_REPO = process.env.GITHUB_REPO
const RELEASE_TAG = 'thumbnails-v2'

// מיפוי שמות ספרים לאנגלית
const bookMapping = {}

function generateBookId(bookName) {
  // צור ID ייחודי מהשם העברי
  const hash = crypto.createHash('md5').update(bookName).digest('hex').substring(0, 8)
  const id = `book_${hash}`
  bookMapping[id] = bookName
  return id
}

async function uploadThumbnails() {
  try {
    console.log('🚀 Uploading thumbnails to GitHub with English names...')
    
    // קבל או צור release
    let release
    try {
      const { data: releases } = await octokit.repos.listReleases({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
      })
      
      release = releases.find(r => r.tag_name === RELEASE_TAG)
      
      if (release) {
        console.log('✅ Found existing release')
      } else {
        // צור release חדש
        const { data: newRelease } = await octokit.repos.createRelease({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          tag_name: RELEASE_TAG,
          name: 'Thumbnails Storage v2',
          body: 'Storage for book thumbnails with English names',
          draft: false,
          prerelease: false,
        })
        release = newRelease
        console.log('✅ Created new release')
      }
    } catch (error) {
      console.error('❌ Error with release:', error.message)
      throw error
    }
    
    // טען mapping קיים מ-MongoDB
    console.log('📖 Loading existing mapping from MongoDB...')
    const existingMapping = await loadExistingMapping()
    Object.assign(bookMapping, existingMapping)
    console.log(`   Found ${Object.keys(existingMapping).length} existing books`)
    
    // סרוק את תיקיית התמונות
    const thumbnailsDir = 'public/thumbnails'
    const books = fs.readdirSync(thumbnailsDir)
    
    let totalSuccessCount = 0
    let totalErrorCount = 0
    let totalSkippedCount = 0
    
    // קבל רשימת assets קיימים פעם אחת (עם pagination)
    console.log('📦 Loading existing assets from GitHub...')
    let existingAssets = []
    let page = 1
    let hasMore = true
    
    while (hasMore) {
      const { data: assets } = await octokit.repos.listReleaseAssets({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        release_id: release.id,
        per_page: 100,
        page: page,
      })
      
      if (assets.length === 0) {
        hasMore = false
      } else {
        existingAssets = existingAssets.concat(assets)
        page++
        
        if (assets.length < 100) {
          hasMore = false
        }
      }
    }
    
    console.log(`   Found ${existingAssets.length} existing assets`)
    
    for (const bookName of books) {
      const bookPath = path.join(thumbnailsDir, bookName)
      
      if (!fs.statSync(bookPath).isDirectory()) continue
      
      console.log(`\n📚 Processing book: ${bookName}`)
      
      // צור ID באנגלית
      const bookId = generateBookId(bookName)
      console.log(`   ID: ${bookId}`)
      
      const files = fs.readdirSync(bookPath)
      const imageFiles = files.filter(f => {
        const ext = path.extname(f).toLowerCase()
        return ['.jpg', '.jpeg', '.png'].includes(ext)
      })
      
      console.log(`   Found ${imageFiles.length} images`)
      
      let bookSuccessCount = 0
      let bookSkippedCount = 0
      let bookErrorCount = 0
      
      for (const fileName of imageFiles) {
        try {
          const filePath = path.join(bookPath, fileName)
          
          // שם קובץ באנגלית: book_abc123_page-1.jpg
          const assetName = `${bookId}_${fileName}`
          
          // בדוק אם כבר קיים
          if (existingAssets.find(a => a.name === assetName)) {
            bookSkippedCount++
            totalSkippedCount++
            continue
          }
          
          // קרא את הקובץ
          const fileBuffer = fs.readFileSync(filePath)
          
          // העלה ל-GitHub
          await octokit.repos.uploadReleaseAsset({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            release_id: release.id,
            name: assetName,
            data: fileBuffer,
            headers: {
              'content-type': 'image/jpeg',
              'content-length': fileBuffer.length,
            },
          })
          
          console.log(`   ✅ ${fileName}`)
          bookSuccessCount++
          totalSuccessCount++
          
          // המתן קצת
          await new Promise(resolve => setTimeout(resolve, 500))
          
        } catch (error) {
          console.error(`   ❌ ${fileName}:`, error.message)
          bookErrorCount++
          totalErrorCount++
        }
      }
      
      console.log(`   📊 Book stats - Uploaded: ${bookSuccessCount}, Skipped: ${bookSkippedCount}, Errors: ${bookErrorCount}`)
    }
    
    // שמור את המיפוי ל-MongoDB
    console.log('\n💾 Saving book mapping to MongoDB...')
    await saveMapping(bookMapping)
    
    console.log('\n' + '='.repeat(50))
    console.log(`🎉 Upload completed!`)
    console.log(`✅ Success: ${totalSuccessCount} images`)
    console.log(`⏭️  Skipped: ${totalSkippedCount} images`)
    console.log(`❌ Errors: ${totalErrorCount} images`)
    console.log(`📖 Books mapped: ${Object.keys(bookMapping).length}`)
    console.log('='.repeat(50))
    
    console.log('\n📋 Book Mapping:')
    Object.entries(bookMapping).forEach(([id, name]) => {
      console.log(`   ${id} → ${name}`)
    })
    
  } catch (error) {
    console.error('❌ Upload failed:', error)
  }
}

async function loadExistingMapping() {
  const { MongoClient } = await import('mongodb')
  const client = new MongoClient(process.env.DATABASE_URL)
  
  try {
    await client.connect()
    const db = client.db('otzaria')
    const collection = db.collection('files')
    
    const doc = await collection.findOne({ path: 'data/book-mapping.json' })
    
    if (doc && doc.data) {
      return doc.data
    }
    
    return {}
  } catch (error) {
    console.warn('⚠️  Could not load existing mapping:', error.message)
    return {}
  } finally {
    await client.close()
  }
}

async function saveMapping(mapping) {
  const { MongoClient } = await import('mongodb')
  const client = new MongoClient(process.env.DATABASE_URL)
  
  try {
    await client.connect()
    const db = client.db('otzaria')
    const collection = db.collection('files')
    
    await collection.updateOne(
      { path: 'data/book-mapping.json' },
      { 
        $set: { 
          path: 'data/book-mapping.json',
          data: mapping,
          contentType: 'application/json',
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )
    
    console.log('✅ Mapping saved to MongoDB')
  } finally {
    await client.close()
  }
}

uploadThumbnails()
