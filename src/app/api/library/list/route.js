import { NextResponse } from 'next/server'
import { saveJSON, readJSON, saveText, readText, listFiles } from '@/lib/storage'
import path from 'path'




export async function GET() {
  try {
    const books = []

    if (!fs.existsSync(CONTENT_PATH)) {
      return NextResponse.json({ success: true, books: [] })
    }

    const contentFiles = fs.readdirSync(CONTENT_PATH).filter(f => f.endsWith('.json'))

    for (const file of contentFiles) {
      const bookPath = file.replace('.json', '')
      const contentFile = path.join(CONTENT_PATH, file)
      const pagesFile = path.join(PAGES_PATH, file)

      try {
        const content = JSON.parse(await readText(contentFile))
        
        let totalPages = 0
        let completedPages = 0

        if (fs.existsSync(pagesFile)) {
          const pages = JSON.parse(await readText(pagesFile))
          totalPages = pages.length
          completedPages = pages.filter(p => p.status === 'completed').length
        }

        books.push({
          path: bookPath,
          name: content.name || bookPath,
          thumbnail: content.thumbnail || null,
          totalPages,
          completedPages,
          author: content.author || null,
          category: content.category || null
        })
      } catch (error) {
        console.error(`Error loading book ${bookPath}:`, error)
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
