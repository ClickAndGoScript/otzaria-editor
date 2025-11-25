import fs from 'fs'
import path from 'path'
import { listFiles } from './storage.js'

// נתיב לתיקיית התמונות המקומית
const THUMBNAILS_PATH = path.join(process.cwd(), 'public', 'thumbnails')

// האם להשתמש ב-Blob Storage או בקבצים מקומיים
const USE_BLOB = process.env.USE_BLOB_STORAGE === 'true' || process.env.VERCEL_ENV === 'production'

/**
 * קריאת מבנה הספרייה מתיקיית התמונות
 * כל תיקייה = ספר, כל תמונה = עמוד
 */
export async function loadLibraryStructure() {
  try {
    console.log('🚀 Loading library structure...')
    console.log('   USE_BLOB:', USE_BLOB)
    console.log('   VERCEL_ENV:', process.env.VERCEL_ENV)
    console.log('   USE_BLOB_STORAGE:', process.env.USE_BLOB_STORAGE)
    
    if (USE_BLOB) {
      console.log('   📦 Using Blob Storage')
      return await scanBlobThumbnails()
    } else {
      console.log('   📁 Using local filesystem')
      if (!fs.existsSync(THUMBNAILS_PATH)) {
        console.warn('Thumbnails directory does not exist:', THUMBNAILS_PATH)
        return []
      }
      return scanThumbnailsDirectory()
    }
  } catch (error) {
    console.error('Error loading library structure:', error)
    return []
  }
}

/**
 * סריקת תמונות מ-Blob Storage
 */
async function scanBlobThumbnails() {
  try {
    console.log('🔍 Scanning Blob Storage for thumbnails...')
    const blobs = await listFiles('thumbnails/')
    console.log('📦 Total blobs found:', blobs.length)
    
    if (blobs.length > 0) {
      console.log('📄 First blob example:', blobs[0])
    }
    
    const books = new Map()

    for (const blob of blobs) {
      console.log('  Processing blob:', blob.pathname)
      
      // נתיב לדוגמה: dev/thumbnails/חוות דעת/page-1.jpg
      const pathParts = blob.pathname.split('/')
      console.log('    Path parts:', pathParts)
      
      // צריך לפחות 4 חלקים: dev/thumbnails/bookName/file.jpg
      if (pathParts.length < 4) {
        console.log('    ⏭️  Skipping - not enough path parts')
        continue
      }

      // pathParts[0] = 'dev'
      // pathParts[1] = 'thumbnails'
      // pathParts[2] = שם הספר
      const bookName = pathParts[2]
      console.log('    📖 Book name:', bookName)
      
      if (!books.has(bookName)) {
        // המר Date object ל-string
        const uploadDate = blob.uploadedAt instanceof Date 
          ? blob.uploadedAt.toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
          
        books.set(bookName, {
          id: bookName,
          name: bookName,
          type: 'file',
          status: 'available',
          lastEdit: uploadDate,
          editor: null,
          path: bookName,
          pageCount: 0,
          thumbnailsPath: `/thumbnails/${bookName}`,
        })
        console.log('    ✅ Created book entry')
      }

      books.get(bookName).pageCount++
    }

    console.log('📚 Total books found in Blob:', books.size)
    return Array.from(books.values())
  } catch (error) {
    console.error('❌ Error scanning blob thumbnails:', error)
    return []
  }
}

/**
 * סריקת תיקיית התמונות
 * כל תיקייה = ספר
 */
function scanThumbnailsDirectory() {
  const books = []
  
  try {
    console.log('📂 Scanning thumbnails directory:', THUMBNAILS_PATH)
    const entries = fs.readdirSync(THUMBNAILS_PATH, { withFileTypes: true })
    console.log('📁 Found entries:', entries.length)
    
    entries.forEach((entry) => {
      console.log('  - Entry:', entry.name, 'isDirectory:', entry.isDirectory())
      
      // דלג על קבצים מוסתרים
      if (entry.name.startsWith('.')) {
        console.log('    ⏭️  Skipping hidden file')
        return
      }
      
      if (entry.isDirectory()) {
        const bookPath = path.join(THUMBNAILS_PATH, entry.name)
        console.log('    📖 Scanning book:', entry.name)
        const bookData = scanBookDirectory(entry.name, bookPath)
        
        if (bookData) {
          console.log('    ✅ Book added:', bookData.name, 'pages:', bookData.pageCount)
          books.push(bookData)
        } else {
          console.log('    ❌ Book data is null')
        }
      }
    })
    
    console.log('📚 Total books found:', books.length)
  } catch (error) {
    console.error('Error scanning thumbnails directory:', error)
  }
  
  return books
}

/**
 * סריקת תיקיית ספר ספציפי
 */
function scanBookDirectory(bookName, bookPath) {
  try {
    console.log('      📂 Reading directory:', bookPath)
    const files = fs.readdirSync(bookPath)
    console.log('      📄 Total files:', files.length)
    
    // סנן רק קבצי תמונות
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    })
    
    console.log('      🖼️  Image files:', imageFiles.length)
    
    if (imageFiles.length === 0) {
      console.warn(`      ⚠️  No images found in book: ${bookName}`)
      return null
    }
    
    // ספור עמודים
    const pageCount = imageFiles.length
    
    // קרא מטא-דאטה אם קיימת
    const stats = fs.statSync(bookPath)
    
    const bookData = {
      id: bookName,
      name: bookName,
      type: 'file',
      status: 'available', // ברירת מחדל
      lastEdit: stats.mtime.toISOString().split('T')[0],
      editor: null,
      path: bookName,
      pageCount: pageCount,
      thumbnailsPath: `/thumbnails/${bookName}`,
    }
    
    console.log('      ✅ Book data created:', JSON.stringify(bookData, null, 2))
    return bookData
  } catch (error) {
    console.error('      ❌ Error scanning book directory:', bookName, error)
    return null
  }
}

/**
 * חיפוש ספרים
 */
export function searchInTree(books, searchTerm) {
  if (!searchTerm) return books
  
  const lowerSearch = searchTerm.toLowerCase()
  return books.filter(book => 
    book.name.toLowerCase().includes(lowerSearch)
  )
}

/**
 * ספירת ספרים לפי סטטוס
 */
export function countByStatus(books) {
  const counts = { completed: 0, 'in-progress': 0, available: 0 }
  
  books.forEach(book => {
    if (book.status) {
      counts[book.status]++
    }
  })
  
  return counts
}

/**
 * קבלת מספר עמודים של ספר
 */
export function getBookPageCount(bookName) {
  try {
    const bookPath = path.join(THUMBNAILS_PATH, bookName)
    
    if (!fs.existsSync(bookPath)) {
      return 0
    }
    
    const files = fs.readdirSync(bookPath)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    })
    
    return imageFiles.length
  } catch (error) {
    console.error('Error getting page count:', error)
    return 0
  }
}

/**
 * בדיקה אם תמונת עמוד קיימת
 */
export function pageImageExists(bookName, pageNumber) {
  try {
    const bookPath = path.join(THUMBNAILS_PATH, bookName)
    
    if (!fs.existsSync(bookPath)) {
      return false
    }
    
    // נסה מספר פורמטים אפשריים
    const possibleNames = [
      `page-${pageNumber}.jpg`,
      `page-${pageNumber}.jpeg`,
      `page-${pageNumber}.png`,
      `page_${pageNumber}.jpg`,
      `${pageNumber}.jpg`,
    ]
    
    for (const name of possibleNames) {
      if (fs.existsSync(path.join(bookPath, name))) {
        return true
      }
    }
    
    return false
  } catch (error) {
    return false
  }
}
