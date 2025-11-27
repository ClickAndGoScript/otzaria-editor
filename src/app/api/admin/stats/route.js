import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { readJSON, listFiles } from '@/lib/storage'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    // טען משתמשים
    const users = await readJSON('data/users.json') || []

    // טען ספרים
    const books = []
    const blobs = await listFiles('data/pages/')
    
    for (const blob of blobs) {
      if (blob.pathname.endsWith('.json')) {
        try {
          // קרא ישירות מ-MongoDB במקום fetch
          const pages = await readJSON(blob.pathname)
          
          if (!pages || !Array.isArray(pages)) {
            console.warn(`No valid pages data for ${blob.pathname}`)
            continue
          }
          
          const bookName = blob.pathname.split('/').pop().replace('.json', '')
          
          books.push({
            path: bookName,
            totalPages: pages.length,
            completedPages: pages.filter(p => p.status === 'completed').length,
            inProgressPages: pages.filter(p => p.status === 'in-progress').length
          })
        } catch (error) {
          console.error('Error loading book:', error)
        }
      }
    }

    // חשב סטטיסטיקות
    const totalUsers = users.length
    const totalBooks = books.length
    const totalPages = books.reduce((sum, book) => sum + book.totalPages, 0)
    const completedPages = books.reduce((sum, book) => sum + book.completedPages, 0)
    const inProgressPages = books.reduce((sum, book) => sum + book.inProgressPages, 0)

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalBooks,
        totalPages,
        completedPages,
        inProgressPages,
        completionRate: totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0
      },
      books,
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      }))
    })
  } catch (error) {
    console.error('Error loading stats:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת סטטיסטיקות' },
      { status: 500 }
    )
  }
}
