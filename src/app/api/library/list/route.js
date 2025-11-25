import { NextResponse } from 'next/server'
import { listFiles } from '@/lib/storage'

export async function GET() {
  try {
    const books = []
    
    // קבל את כל קבצי ה-JSON של הספרים
    const blobs = await listFiles('data/pages/')
    
    for (const blob of blobs) {
      if (blob.pathname.endsWith('.json')) {
        try {
          const response = await fetch(blob.url)
          if (!response.ok) continue
          
          const pages = await response.json()
          const bookName = blob.pathname.split('/').pop().replace('.json', '')
          
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
          console.error(`Error loading book:`, error)
        }
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
