import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const LIBRARY_PATH = path.join(process.cwd(), 'public', 'assets', 'library')
const PAGES_DATA_PATH = path.join(process.cwd(), 'data', 'pages')

// יצירת תיקיית data אם לא קיימת
if (!fs.existsSync(PAGES_DATA_PATH)) {
  fs.mkdirSync(PAGES_DATA_PATH, { recursive: true })
}

export async function POST(request, { params }) {
  try {
    const body = await request.json()
    const { action, bookPath, pageNumber, userId, userName } = body

    console.log('POST request:', { action, bookPath, pageNumber, userId, userName })

    if (action === 'claim') {
      return handleClaimPage(bookPath, pageNumber, userId, userName)
    } else if (action === 'complete') {
      return handleCompletePage(bookPath, pageNumber, userId)
    }

    return NextResponse.json(
      { success: false, error: 'פעולה לא מוכרת' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בעיבוד הבקשה' },
      { status: 500 }
    )
  }
}

async function handleClaimPage(bookPath, pageNumber, userId, userName) {
  try {
    if (!bookPath || !pageNumber || !userId || !userName) {
      return NextResponse.json(
        { success: false, error: 'חסרים פרמטרים נדרשים' },
        { status: 400 }
      )
    }

    const bookName = path.basename(bookPath, '.pdf')
    const pagesDataFile = path.join(PAGES_DATA_PATH, `${bookName}.json`)

    if (!fs.existsSync(pagesDataFile)) {
      return NextResponse.json(
        { success: false, error: 'קובץ נתוני העמודים לא נמצא' },
        { status: 404 }
      )
    }

    const pagesData = JSON.parse(fs.readFileSync(pagesDataFile, 'utf-8'))
    const pageIndex = pagesData.findIndex(p => p.number === pageNumber)

    if (pageIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'העמוד לא נמצא' },
        { status: 404 }
      )
    }

    const page = pagesData[pageIndex]

    if (page.status === 'in-progress' && page.claimedById !== userId) {
      return NextResponse.json(
        { success: false, error: `העמוד כבר בטיפול של ${page.claimedBy}` },
        { status: 409 }
      )
    }

    pagesData[pageIndex] = {
      ...page,
      status: 'in-progress',
      claimedBy: userName,
      claimedById: userId,
      claimedAt: new Date().toISOString(),
    }

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

async function handleCompletePage(bookPath, pageNumber, userId) {
  try {
    if (!bookPath || !pageNumber || !userId) {
      return NextResponse.json(
        { success: false, error: 'חסרים פרמטרים נדרשים' },
        { status: 400 }
      )
    }

    const bookName = path.basename(bookPath, '.pdf')
    const pagesDataFile = path.join(PAGES_DATA_PATH, `${bookName}.json`)

    if (!fs.existsSync(pagesDataFile)) {
      return NextResponse.json(
        { success: false, error: 'קובץ נתוני העמודים לא נמצא' },
        { status: 404 }
      )
    }

    const pagesData = JSON.parse(fs.readFileSync(pagesDataFile, 'utf-8'))
    const pageIndex = pagesData.findIndex(p => p.number === pageNumber)

    if (pageIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'העמוד לא נמצא' },
        { status: 404 }
      )
    }

    const page = pagesData[pageIndex]

    if (page.claimedById !== userId) {
      return NextResponse.json(
        { success: false, error: 'אין לך הרשאה לסמן עמוד זה כהושלם' },
        { status: 403 }
      )
    }

    pagesData[pageIndex] = {
      ...page,
      status: 'completed',
      completedAt: new Date().toISOString(),
    }

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

export async function GET(request, { params }) {
  try {
    console.log('API called with params:', params)
    const bookPath = Array.isArray(params.path) ? params.path.join('/') : params.path
    console.log('Book path:', bookPath)
    const decodedPath = decodeURIComponent(bookPath)
    console.log('Decoded path:', decodedPath)
    const fullPath = path.join(LIBRARY_PATH, decodedPath)
    console.log('Full path:', fullPath)

    if (!fs.existsSync(fullPath)) {
      console.log('File not found:', fullPath)
      return NextResponse.json(
        { success: false, error: 'הספר לא נמצא' },
        { status: 404 }
      )
    }

    const stats = fs.statSync(fullPath)
    const bookName = path.basename(decodedPath, '.pdf')

    // קרא את מספר העמודים ממטא-דאטה או השתמש בהערכה
    let numPages = getPageCountFromMeta(fullPath) || estimatePages(stats.size)
    console.log(`Book "${bookName}" has ${numPages} pages (from meta or estimate)`)

    // טען או צור נתוני עמודים
    const pagesDataFile = path.join(PAGES_DATA_PATH, `${bookName}.json`)
    let pagesData = []

    if (fs.existsSync(pagesDataFile)) {
      pagesData = JSON.parse(fs.readFileSync(pagesDataFile, 'utf-8'))
      
      // אם מספר העמודים השתנה, עדכן
      if (pagesData.length !== numPages) {
        console.log(`Updating pages count from ${pagesData.length} to ${numPages}`)
        pagesData = createPagesData(numPages, pagesData, decodedPath)
        fs.writeFileSync(pagesDataFile, JSON.stringify(pagesData, null, 2))
      }
    } else {
      // צור נתוני עמודים חדשים
      pagesData = createPagesData(numPages, [], decodedPath)
      fs.writeFileSync(pagesDataFile, JSON.stringify(pagesData, null, 2))
    }

    return NextResponse.json({
      success: true,
      book: {
        name: bookName,
        path: decodedPath,
        size: stats.size,
        lastModified: stats.mtime,
        totalPages: numPages,
      },
      pages: pagesData,
    })
  } catch (error) {
    console.error('Error loading book:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        success: false, 
        error: 'שגיאה בטעינת הספר',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// יצירת נתוני עמודים
function createPagesData(numPages, existingData = [], bookPath) {
  const pagesData = []
  
  // נסה לטעון תמונות thumbnail אם קיימות
  const bookNameWithoutExt = bookPath.replace('.pdf', '')
  const thumbnailsPath = path.join(process.cwd(), 'public', 'thumbnails', bookNameWithoutExt)
  const hasThumbnails = fs.existsSync(thumbnailsPath)
  
  console.log(`\n=== Thumbnail Debug ===`)
  console.log(`Book path: ${bookPath}`)
  console.log(`Book name without ext: ${bookNameWithoutExt}`)
  console.log(`Looking for thumbnails at: ${thumbnailsPath}`)
  console.log(`Directory exists: ${hasThumbnails}`)
  
  // אם התיקייה קיימת, הצג את הקבצים הראשונים
  if (hasThumbnails) {
    try {
      const files = fs.readdirSync(thumbnailsPath).slice(0, 5)
      console.log(`First 5 files in directory:`, files)
    } catch (e) {
      console.log(`Error reading directory:`, e.message)
    }
  }
  
  let thumbnailCount = 0
  
  for (let i = 1; i <= numPages; i++) {
    // אם יש נתונים קיימים לעמוד זה, שמור אותם
    const existingPage = existingData.find(p => p.number === i)
    
    // בדוק אם יש תמונת thumbnail
    let thumbnail = null
    if (hasThumbnails) {
      const thumbPath = path.join(thumbnailsPath, `page-${i}.jpg`)
      if (fs.existsSync(thumbPath)) {
        thumbnail = `/thumbnails/${bookNameWithoutExt}/page-${i}.jpg`
        thumbnailCount++
        if (i === 1) {
          console.log(`✅ Found thumbnail for page 1: ${thumbnail}`)
        }
      } else if (i === 1) {
        console.log(`❌ Thumbnail NOT found at: ${thumbPath}`)
      }
    }
    
    // הוסף את העמוד לרשימה
    if (existingPage) {
      pagesData.push({
        ...existingPage,
        thumbnail: thumbnail || existingPage.thumbnail
      })
    } else {
      pagesData.push({
        number: i,
        status: 'available',
        claimedBy: null,
        claimedById: null,
        claimedAt: null,
        completedAt: null,
        thumbnail: thumbnail,
      })
    }
  }
  
  console.log(`Total thumbnails found: ${thumbnailCount}/${numPages}`)
  console.log(`======================\n`)
  
  return pagesData
}

// קריאת מספר עמודים ממטא-דאטה
function getPageCountFromMeta(pdfPath) {
  const metaPath = pdfPath + '.meta.json'
  
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
      console.log(`Found meta file for ${path.basename(pdfPath)}: ${meta.pages} pages`)
      return meta.pages || null
    } catch (error) {
      console.error('Error reading meta file:', error)
    }
  }
  
  return null
}

// הערכת מספר עמודים לפי גודל קובץ (fallback)
function estimatePages(fileSize) {
  // הערכה גסה: כל 50KB = עמוד אחד
  const estimated = Math.ceil(fileSize / 50000)
  // הגבל בין 10 ל-500 עמודים
  return Math.min(Math.max(estimated, 10), 500)
}
