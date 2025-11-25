import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

// טען את .env.local
config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BLOB_PREFIX = 'prod/'

// בדוק שיש טוקן
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN לא נמצא ב-.env.local')
  process.exit(1)
}

async function uploadDirectory(dir, prefix = '') {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directory not found: ${dir}`)
    return
  }

  const files = fs.readdirSync(dir)
  let uploadCount = 0
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      await uploadDirectory(filePath, `${prefix}${file}/`)
    } else {
      const content = fs.readFileSync(filePath)
      const blobPath = `${BLOB_PREFIX}${prefix}${file}`
      
      try {
        await put(blobPath, content, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true
        })
        uploadCount++
        console.log(`✅ ${uploadCount}. Uploaded: ${prefix}${file}`)
      } catch (error) {
        console.error(`❌ Failed: ${prefix}${file}`, error.message)
      }
    }
  }
}

async function main() {
  console.log('🚀 מתחיל העלאת נתונים ל-Vercel Blob...\n')
  
  // העלה את כל תיקיית data
  await uploadDirectory('./data', 'data/')
  
  console.log('\n🎉 ההעלאה הושלמה')
  console.log('עכשיו תוכל לפרוס ל-Vercel והנתונים יהיו שמורים.')
}

main().catch(console.error)
