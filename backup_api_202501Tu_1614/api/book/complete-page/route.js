import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const PAGES_DATA_PATH = path.join(process.cwd(), 'data', 'pages')

export async function POST(request) {
  try {
    const { bookPath, pageNumber, userId } = await request.json()

    if (!bookPath || !pageNumber || !userId) {
      return NextResponse.json(
        { success: false, error: 'חסרים פרמטרים נדרשים' },
        { status: 400 }
      )
    }

    // קרא את נתוני העמודים
    const bookName = path.basename(bookPath, '.pdf')
    const pagesDataFile = path.join(PAGES_DATA_PATH, `${bookName}.json`)

    if (!fs.existsSync(pagesDataFile)) {
      return NextResponse.json(
        { success: false, error: 'קובץ נתוני העמודים לא נמצא' },
        { status: 404 }
      )
    }

    const pagesData = JSON.parse(fs.readFileSync(pagesDataFile, 'utf-8'))

    // מצא את העמוד
    const pageIndex = pagesData.findIndex(p => p.number === pageNumber)

    if (pageIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'העמוד לא נמצא' },
        { status: 404 }
      )
    }

    const page = pagesData[pageIndex]

    // בדוק אם המשתמש הוא זה שתפס את העמוד
    if (page.claimedById !== userId) {
      return NextResponse.json(
        { success: false, error: 'אין לך הרשאה לסמן עמוד זה כהושלם' },
        { status: 403 }
      )
    }

    // עדכן את העמוד
    pagesData[pageIndex] = {
      ...page,
      status: 'completed',
      completedAt: new Date().toISOString(),
    }

    // שמור את הקובץ
    fs.writeFileSync(pagesDataFile, JSON.stringify(pagesData, null, 2))

    console.log(`✅ Page ${pageNumber} completed by user ${userId}`)

    return NextResponse.json({
      success: true,
      message: 'העמוד סומן כהושלם',
      page: pagesData[pageIndex],
    })
  } catch (error) {
    console.error('Error completing page:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בסימון העמוד כהושלם' },
      { status: 500 }
    )
  }
}
