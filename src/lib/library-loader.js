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
    if (USE_BLOB) {
      return await scanBlobThumbnails()
    } else {
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
    const blobs = await listFiles('thumbnails/')
    const books = new Map()

    for (const blob of blobs) {
      // נתיב לדוגמה: thumbnails/חוות דעת/page-1.jpg
      const pathParts = blob.pathname.split('/')
      if (pathParts.length < 3) continue

      const bookName = pathParts[1]
      
      if (!books.has(bookName)) {
        books.set(bookName, {
          id: bookName,
          name: bookName,
          type: 'file',
          status: 'available',
          lastEdit: blob.uploadedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          editor: null,
          path: bookName,
          pageCount: 0,
          thumbnailsPath: `/thumbnails/${bookName}`,
        })
      }

      books.get(bookName).pageCount++
    }

    return Array.from(books.values())
  } catch (error) {
    console.error('Error scanning blob thumbnails:', error)
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
    const entries = fs.readdirSync(THUMBNAILS_PATH, { withFileTypes: true })
    
    entries.forEach((entry) => {
      // דלג על קבצים מוסתרים
      if (entry.name.startsWith('.')) return
      
      if (entry.isDirectory()) {
        const bookPath = path.join(THUMBNAILS_PATH, entry.name)
        const bookData = scanBookDirectory(entry.name, bookPath)
        
        if (bookData) {
          books.push(bookData)
        }
      }
    })
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
    const files = fs.readdirSync(bookPath)
    
    // סנן רק קבצי תמונות
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    })
    
    if (imageFiles.length === 0) {
      console.warn(`No images found in book: ${bookName}`)
      return null
    }
    
    // ספור עמודים
    const pageCount = imageFiles.length
    
    // קרא מטא-דאטה אם קיימת
    const stats = fs.statSync(bookPath)
    
    return {
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
  } catch (error) {
    console.error('Error scanning book directory:', bookName, error)
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
