import { NextResponse } from 'next/server'
import { listFiles, readJSON } from '@/lib/storage'

export async function GET() {
  try {
    const books = []
    
    console.log('📚 Loading books list...')
    
    // קרא את כל קבצי העמודים מ-MongoDB
    const files = await listFiles('data/pages/')
    console.log(`📦 Found ${files.length} files`)
    
    const jsonFiles = files.filter(f => f.pathname.endsWith('.json'))
    console.log(`📄 Found ${jsonFiles.length} JSON files`)
    
    for (const file of jsonFiles) {
      try {
        const bookName = file.pathname.split('/').pop().replace('.json', '')
        console.log(`📖 Processing book: ${bookName}`)
        
        // קרא ישירות מ-MongoDB
        const pages = await readJSON(file.pathname)
        
        if (!pages) {
          console.warn(`⚠️  No data for ${bookName}`)
          continue
        }
        
        if (!Array.isArray(pages)) {
          console.warn(`⚠️  Data is not array for ${bookName}, type: ${typeof pages}`)
          continue
        }
        
        const totalPages = pages.length
        const completedPages = pages.filter(p => p.status === 'completed').length
        
        console.log(`✅ Book ${bookName}: ${totalPages} pages, ${completedPages} completed`)
        
        books.push({
          path: bookName,
          name: bookName,
          thumbnail: pages[0]?.thumbnail || null,
          totalPages,
          completedPages
        })
      } catch (error) {
        console.error(`❌ Error loading book ${file.pathname}:`, error)
      }
    }

    console.log(`📚 Returning ${books.length} books`)
    return NextResponse.json({ success: true, books })
  } catch (error) {
    console.error('❌ Error loading books list:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת רשימת ספרים' },
      { status: 500 }
    )
  }
}
