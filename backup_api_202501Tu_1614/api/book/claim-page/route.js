import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const PAGES_DATA_PATH = path.join(process.cwd(), 'data', 'pages')

export async function POST(request) {
  console.log('🔵 Claim page API called')
  
  try {
    const { bookPath, pageNumber, userId, userName } = await request.json()
    
    console.log('Request data:', { bookPath, pageNumber, userId, userName })

    if (!bookPath || !pageNumber || !userId || !userName) {
      console.log('❌ Missing parameters')
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

    // בדוק אם העמוד כבר תפוס
    if (page.status === 'in-progress' && page.claimedById !== userId) {
      return NextResponse.json(
        { success: false, error: `העמוד כבר בטיפול של ${page.claimedBy}` },
        { status: 409 }
      )
    }

    // עדכן את העמוד
    pagesData[pageIndex] = {
      ...page,
      status: 'in-progress',
      claimedBy: userName,
      claimedById: userId,
      claimedAt: new Date().toISOString(),
    }

    // שמור את הקובץ
    fs.writeFileSync(pagesDataFile, JSON.stringify(pagesData, null, 2))

    console.log(`✅ Page ${pageNumber} claimed by ${userName}`)

    return NextResponse.json({
      success: true,
      message: 'העמוד נתפס בהצלחה',
      page: pagesData[pageIndex],
    })
  } catch (error) {
    console.error('Error claiming page:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בתפיסת העמוד' },
      { status: 500 }
    )
  }
}
