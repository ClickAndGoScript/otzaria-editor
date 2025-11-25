import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs'
import path from 'path'

const CONTENT_PATH = path.join(process.cwd(), 'data', 'content')
const PAGES_PATH = path.join(process.cwd(), 'data', 'pages')
const UPLOADS_PATH = path.join(process.cwd(), 'data', 'uploads')

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const { bookPath } = await request.json()

    if (!bookPath) {
      return NextResponse.json(
        { success: false, error: 'חסר נתיב ספר' },
        { status: 400 }
      )
    }

    // מחק את קובץ התוכן
    const contentFile = path.join(CONTENT_PATH, `${bookPath}.json`)
    if (fs.existsSync(contentFile)) {
      fs.unlinkSync(contentFile)
    }

    // מחק את קובץ העמודים
    const pagesFile = path.join(PAGES_PATH, `${bookPath}.json`)
    if (fs.existsSync(pagesFile)) {
      fs.unlinkSync(pagesFile)
    }

    // מחק את תיקיית התמונות
    const imagesDir = path.join(UPLOADS_PATH, bookPath)
    if (fs.existsSync(imagesDir)) {
      fs.rmSync(imagesDir, { recursive: true, force: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה במחיקת ספר' },
      { status: 500 }
    )
  }
}
