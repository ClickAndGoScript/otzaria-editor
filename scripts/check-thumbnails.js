import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const THUMBNAILS_PATH = path.join(__dirname, '..', 'public', 'thumbnails')

function checkThumbnails() {
  console.log('🔍 בודק מבנה תיקיית התמונות...\n')

  if (!fs.existsSync(THUMBNAILS_PATH)) {
    console.error('❌ תיקיית thumbnails לא קיימת!')
    console.log('📁 צור תיקייה: public/thumbnails/')
    process.exit(1)
  }

  const books = fs.readdirSync(THUMBNAILS_PATH, { withFileTypes: true })
    .filter(entry => entry.isDirectory())

  if (books.length === 0) {
    console.warn('⚠️  אין ספרים בתיקיית thumbnails')
    console.log('📚 הוסף תיקיות ספרים ב: public/thumbnails/')
    process.exit(0)
  }

  console.log(`📚 נמצאו ${books.length} ספרים:\n`)

  let totalPages = 0
  const issues = []

  for (const book of books) {
    const bookName = book.name
    const bookPath = path.join(THUMBNAILS_PATH, bookName)
    
    const files = fs.readdirSync(bookPath)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    })

    const otherFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return !['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    })

    console.log(`📖 ${bookName}`)
    console.log(`   📄 ${imageFiles.length} תמונות`)
    
    if (imageFiles.length === 0) {
      console.log('   ⚠️  אין תמונות!')
      issues.push(`${bookName}: אין תמונות`)
    }

    if (otherFiles.length > 0) {
      console.log(`   ⚠️  ${otherFiles.length} קבצים לא נתמכים: ${otherFiles.slice(0, 3).join(', ')}`)
      issues.push(`${bookName}: קבצים לא נתמכים`)
    }

    // בדוק רצף עמודים
    const pageNumbers = imageFiles
      .map(file => {
        const match = file.match(/page[-_]?(\d+)/i) || file.match(/^(\d+)/)
        return match ? parseInt(match[1]) : null
      })
      .filter(n => n !== null)
      .sort((a, b) => a - b)

    if (pageNumbers.length > 0) {
      const missing = []
      for (let i = 1; i <= Math.max(...pageNumbers); i++) {
        if (!pageNumbers.includes(i)) {
          missing.push(i)
        }
      }

      if (missing.length > 0 && missing.length < 10) {
        console.log(`   ⚠️  עמודים חסרים: ${missing.join(', ')}`)
        issues.push(`${bookName}: עמודים חסרים`)
      }
    }

    totalPages += imageFiles.length
    console.log()
  }

  console.log('='.repeat(50))
  console.log(`✅ סה"כ: ${books.length} ספרים, ${totalPages} עמודים`)
  
  if (issues.length > 0) {
    console.log(`\n⚠️  ${issues.length} בעיות נמצאו:`)
    issues.forEach(issue => console.log(`   - ${issue}`))
  } else {
    console.log('\n✅ הכל נראה תקין!')
  }
  
  console.log('='.repeat(50))
}

checkThumbnails()
