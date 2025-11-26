import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { readJSON, saveJSON } from '@/lib/storage'
import { clearLibraryCache } from '@/lib/library-loader'

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { bookPath } = await request.json()
    
    if (!bookPath) {
      return NextResponse.json(
        { success: false, error: 'חסר שם ספר' },
        { status: 400 }
      )
    }

    console.log(`🗑️  Deleting book: ${bookPath}`)

    // קרא את books.json
    const books = await readJSON('data/books.json') || []
    
    // מחק את הספר מהרשימה
    const filteredBooks = books.filter(book => book.name !== bookPath && book.id !== bookPath)
    
    if (filteredBooks.length === books.length) {
      return NextResponse.json(
        { success: false, error: 'ספר לא נמצא' },
        { status: 404 }
      )
    }

    // שמור חזרה
    await saveJSON('data/books.json', filteredBooks)
    
    // מחק גם את קובץ העמודים
    try {
      const pagesFile = `data/pages/${bookPath}.json`
      await saveJSON(pagesFile, null) // מחיקה על ידי שמירת null
    } catch (error) {
      console.warn('Could not delete pages file:', error)
    }

    console.log(`✅ Book deleted: ${bookPath}`)

    // נקה את ה-cache
    clearLibraryCache()

    return NextResponse.json({
      success: true,
      message: 'הספר נמחק בהצלחה'
    })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
