import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { readJSON, saveJSON } from '@/lib/storage'
import { loadBookMapping } from '@/lib/github-storage'
import { listImages } from '@/lib/github-storage'
import { clearLibraryCache } from '@/lib/library-loader'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { bookName } = await request.json()
    
    if (!bookName) {
      return NextResponse.json(
        { success: false, error: 'חסר שם ספר' },
        { status: 400 }
      )
    }

    console.log(`➕ Adding book: ${bookName}`)

    // בדוק אם הספר קיים ב-GitHub
    const mapping = await loadBookMapping()
    const bookId = Object.entries(mapping).find(([, name]) => name === bookName)?.[0]
    
    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'הספר לא נמצא ב-GitHub. יש להעלות תמונות קודם.' },
        { status: 404 }
      )
    }

    // ספור תמונות
    const images = await listImages(bookId)
    const totalPages = images.length

    if (totalPages === 0) {
      return NextResponse.json(
        { success: false, error: 'לא נמצאו תמונות לספר זה' },
        { status: 404 }
      )
    }

    console.log(`📸 Found ${totalPages} pages for ${bookName}`)

    // קרא את books.json
    const books = await readJSON('data/books.json') || []
    
    // בדוק אם הספר כבר קיים
    const existingIndex = books.findIndex(b => b.name === bookName || b.id === bookName)
    
    const bookData = {
      id: bookName,
      name: bookName,
      totalPages: totalPages,
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    if (existingIndex >= 0) {
      // עדכן ספר קיים
      books[existingIndex] = { ...books[existingIndex], ...bookData }
      console.log(`✅ Updated existing book: ${bookName}`)
    } else {
      // הוסף ספר חדש
      books.push(bookData)
      console.log(`✅ Added new book: ${bookName}`)
    }

    // שמור חזרה
    await saveJSON('data/books.json', books)

    // נקה את ה-cache
    clearLibraryCache()

    return NextResponse.json({
      success: true,
      book: bookData,
      message: existingIndex >= 0 ? 'הספר עודכן בהצלחה' : 'הספר נוסף בהצלחה'
    })
  } catch (error) {
    console.error('Error adding book:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
