import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { saveJSON, readJSON, saveText, readText, listFiles } from '@/lib/storage'
import path from 'path'

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json')



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
    const users = fs.existsSync(USERS_PATH) 
      ? await readJSON('data/USERS.json') || []
      : []

    // טען ספרים
    const books = []
    if (fs.existsSync(CONTENT_PATH)) {
      const contentFiles = fs.readdirSync(CONTENT_PATH).filter(f => f.endsWith('.json'))
      
      for (const file of contentFiles) {
        const bookPath = file.replace('.json', '')
        const pagesFile = path.join(PAGES_PATH, file)
        
        if (fs.existsSync(pagesFile)) {
          const pages = JSON.parse(await readText(pagesFile))
          books.push({
            path: bookPath,
            totalPages: pages.length,
            completedPages: pages.filter(p => p.status === 'completed').length,
            inProgressPages: pages.filter(p => p.status === 'in-progress').length
          })
        }
      }
    }

    // חשב סטטיסטיקות
    const totalUsers = users.length
    const totalBooks = books.length
    const totalPages = books.reduce((sum, b) => sum + b.totalPages, 0)
    const completedPages = books.reduce((sum, b) => sum + b.completedPages, 0)
    const inProgressPages = books.reduce((sum, b) => sum + b.inProgressPages, 0)
    
    // פעילות לפי יום (דוגמה - ניתן להרחיב)
    const activityByDay = {}
    
    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          admins: users.filter(u => u.role === 'admin').length,
          regular: users.filter(u => u.role === 'user').length
        },
        books: {
          total: totalBooks,
          totalPages,
          completedPages,
          inProgressPages,
          availablePages: totalPages - completedPages - inProgressPages,
          completionRate: totalPages > 0 ? (completedPages / totalPages * 100).toFixed(1) : 0
        },
        activity: activityByDay
      }
    })
  } catch (error) {
    console.error('Error loading admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת סטטיסטיקות' },
      { status: 500 }
    )
  }
}
