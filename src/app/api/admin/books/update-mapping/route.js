import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { readJSON, saveJSON } from '@/lib/storage'
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

    const { bookId, bookName, totalPages } = await request.json()
    
    if (!bookId || !bookName) {
      return NextResponse.json(
        { success: false, error: 'חסרים פרמטרים' },
        { status: 400 }
      )
    }

    console.log(`📝 Updating mapping: ${bookId} -> ${bookName}`)

    // עדכן book-mapping.json
    const mapping = await readJSON('data/book-mapping.json') || {}
    mapping[bookId] = bookName
    await saveJSON('data/book-mapping.json', mapping)

    // עדכן books.json
    const books = await readJSON('data/books.json') || []
    const existingIndex = books.findIndex(b => b.name === bookName || b.id === bookName)
    
    const bookData = {
      id: bookName,
      name: bookName,
      totalPages: totalPages || 0,
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    if (existingIndex >= 0) {
      books[existingIndex] = { ...books[existingIndex], ...bookData }
    } else {
      books.push(bookData)
    }
    
    await saveJSON('data/books.json', books)

    // נקה cache
    clearLibraryCache()

    console.log(`✅ Book added: ${bookName} with ${totalPages} pages`)

    return NextResponse.json({
      success: true,
      book: bookData,
      message: 'הספר נוסף בהצלחה'
    })
  } catch (error) {
    console.error('Error updating mapping:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
