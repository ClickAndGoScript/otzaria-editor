import { NextResponse } from 'next/server'
import { saveJSON, readJSON, saveText, readText, listFiles } from '@/lib/storage'
import path from 'path'


const UPLOADS_META_PATH = path.join(process.cwd(), 'data', 'uploads-meta.json')

// יצירת תיקייה אם לא קיימת


export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const bookName = formData.get('bookName')
    const userId = formData.get('userId')
    const userName = formData.get('userName')

    console.log('📤 Upload request:', { bookName, userId, userName, fileType: file?.type })

    // בדיקות
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'לא נבחר קובץ' },
        { status: 400 }
      )
    }

    if (!bookName || !userId || !userName) {
      return NextResponse.json(
        { success: false, error: 'חסרים פרמטרים נדרשים' },
        { status: 400 }
      )
    }

    // בדוק שזה קובץ טקסט
    if (!file.name.endsWith('.txt')) {
      return NextResponse.json(
        { success: false, error: 'ניתן להעלות רק קבצי TXT' },
        { status: 400 }
      )
    }

    // קרא את תוכן הקובץ
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const content = buffer.toString('utf-8')

    // צור שם קובץ בטוח
    const timestamp = Date.now()
    const safeBookName = bookName.replace(/[^a-zA-Z0-9א-ת\s]/g, '_')
    const fileName = `${safeBookName}_${timestamp}.txt`
    const filePath = path.join(UPLOADS_PATH, fileName)

    // שמור את הקובץ
    await saveText(filePath, content)

    // שמור מטא-דאטה
    const uploadMeta = {
      id: timestamp.toString(),
      bookName,
      fileName,
      originalFileName: file.name,
      fileSize: buffer.length,
      uploadedBy: userName,
      uploadedById: userId,
      uploadedAt: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
      lineCount: content.split('\n').length,
      charCount: content.length
    }

    // טען או צור קובץ מטא-דאטה
    let allUploads = []
    if (fs.existsSync(UPLOADS_META_PATH)) {
      allUploads = await readJSON('data/UPLOADS_META.json') || []
    }

    allUploads.unshift(uploadMeta) // הוסף בהתחלה (האחרונים ראשונים)
    await saveJSON('data/UPLOADS_META.json', allUploads)

    console.log(`✅ Book uploaded: ${fileName} by ${userName}`)

    return NextResponse.json({
      success: true,
      message: 'הספר הועלה בהצלחה',
      upload: uploadMeta
    })
  } catch (error) {
    console.error('Error uploading book:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בהעלאת הקובץ' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!fs.existsSync(UPLOADS_META_PATH)) {
      return NextResponse.json({
        success: true,
        uploads: []
      })
    }

    let allUploads = await readJSON('data/UPLOADS_META.json') || []

    // אם יש userId, סנן רק את ההעלאות שלו
    if (userId) {
      allUploads = allUploads.filter(u => u.uploadedById === userId)
    }

    return NextResponse.json({
      success: true,
      uploads: allUploads
    })
  } catch (error) {
    console.error('Error loading uploads:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת ההעלאות' },
      { status: 500 }
    )
  }
}
