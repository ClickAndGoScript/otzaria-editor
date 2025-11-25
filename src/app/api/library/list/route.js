import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const PAGES_PATH = path.join(process.cwd(), 'data', 'pages')

export async function GET() {
  try {
    const books = []
    
    // בדוק אם התיקייה קיימת
    if (!fs.existsSync(PAGES_PATH)) {
      return NextResponse.json({ success: true, books: [] })
    }
    
    // קרא את כל קבצי ה-JSON
    const files = fs.readdirSync(PAGES_PATH).filter(f => f.endsWith('.json'))
    
    for (const file of files) {
      try {
        const filePath = path.join(PAGES_PATH, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const pages = JSON.parse(content)
        const bookName = file.replace('.json', '')
        
        const totalPages = pages.length
        const completedPages = pages.filter(p => p.status === 'completed').length
        
        books.push({
          path: bookName,
          name: bookName,
          thumbnail: pages[0]?.thumbnail || null,
          totalPages,
          completedPages
        })
      } catch (error) {
        console.error(`Error loading book ${file}:`, error)
      }
    }

    return NextResponse.json({ success: true, books })
  } catch (error) {
    console.error('Error loading books list:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת רשימת ספרים' },
      { status: 500 }
    )
  }
}
