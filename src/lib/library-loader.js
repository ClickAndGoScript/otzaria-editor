import fs from 'fs'
import path from 'path'

// נתיב לתיקיית הספרייה
const LIBRARY_PATH = path.join(process.cwd(), 'public', 'assets', 'library')

/**
 * קריאת מבנה התיקיות והקבצים מתיקיית הספרייה
 */
export function loadLibraryStructure() {
  try {
    if (!fs.existsSync(LIBRARY_PATH)) {
      console.warn('Library directory does not exist:', LIBRARY_PATH)
      return []
    }

    return scanDirectory(LIBRARY_PATH, '')
  } catch (error) {
    console.error('Error loading library structure:', error)
    return []
  }
}

/**
 * סריקת תיקייה רקורסיבית
 */
function scanDirectory(dirPath, relativePath) {
  const items = []
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    
    entries.forEach((entry, index) => {
      // דלג על קבצים מוסתרים
      if (entry.name.startsWith('.')) return
      
      const fullPath = path.join(dirPath, entry.name)
      const itemRelativePath = path.join(relativePath, entry.name)
      const stats = fs.statSync(fullPath)
      
      if (entry.isDirectory()) {
        // תיקייה
        const children = scanDirectory(fullPath, itemRelativePath)
        items.push({
          id: itemRelativePath.replace(/\\/g, '/'),
          name: entry.name,
          type: 'folder',
          children: children,
          path: itemRelativePath.replace(/\\/g, '/'),
        })
      } else if (entry.isFile()) {
        // קובץ - רק קבצי PDF
        const ext = path.extname(entry.name).toLowerCase()
        if (ext === '.pdf') {
          items.push({
            id: itemRelativePath.replace(/\\/g, '/'),
            name: entry.name.replace(ext, ''), // הסר סיומת .pdf
            type: 'file',
            status: determineStatus(fullPath, stats),
            lastEdit: stats.mtime.toISOString().split('T')[0],
            editor: null, // ניתן להוסיף מטא-דאטה
            path: itemRelativePath.replace(/\\/g, '/'),
            size: stats.size,
            fileUrl: `/assets/library/${itemRelativePath.replace(/\\/g, '/')}`,
          })
        }
      }
    })
  } catch (error) {
    console.error('Error scanning directory:', dirPath, error)
  }
  
  return items
}

/**
 * קביעת סטטוס קובץ לפי מטא-דאטה או גודל
 */
function determineStatus(filePath, stats) {
  // ניתן לקרוא מקובץ מטא-דאטה או לקבוע לפי כללים
  const metaPath = filePath + '.meta.json'
  
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
      return meta.status || 'available'
    } catch (error) {
      console.error('Error reading meta file:', metaPath, error)
    }
  }
  
  // ברירת מחדל לקבצי PDF - קובץ גדול = הושלם
  // PDF בדרך כלל גדול מ-100KB
  if (stats.size > 1000000) { // 1MB
    return 'completed'
  } else if (stats.size > 100000) { // 100KB
    return 'in-progress'
  }
  
  return 'available'
}

/**
 * חיפוש בעץ
 */
export function searchInTree(tree, searchTerm) {
  if (!searchTerm) return tree
  
  const results = []
  const lowerSearch = searchTerm.toLowerCase()
  
  function search(items, path = []) {
    items.forEach(item => {
      const currentPath = [...path, item.name]
      
      if (item.name.toLowerCase().includes(lowerSearch)) {
        results.push({ ...item, path: currentPath })
      }
      
      if (item.children) {
        search(item.children, currentPath)
      }
    })
  }
  
  search(tree)
  return results
}

/**
 * ספירת קבצים לפי סטטוס
 */
export function countByStatus(tree) {
  const counts = { completed: 0, 'in-progress': 0, available: 0 }
  
  function count(items) {
    items.forEach(item => {
      if (item.type === 'file' && item.status) {
        counts[item.status]++
      }
      if (item.children) {
        count(item.children)
      }
    })
  }
  
  count(tree)
  return counts
}
