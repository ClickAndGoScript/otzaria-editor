import { NextResponse } from 'next/server'
import { saveJSON, readJSON, saveText, readText, listFiles } from '@/lib/storage'
import path from 'path'

const UPLOADS_PATH = path.join(process.cwd(), 'public', 'uploads', 'texts')

// יצירת תיקייה אם לא קיימת


export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const bookName = formData.get('bookName')
    const author = formData.get('author')
    const description = formData.get('description')

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'לא נבחר קובץ' },
        { status: 400 }
      )
    }

    // בדוק שזה קובץ טקסט
    if (!file.name.endsWith('.txt')) {
      return NextResponse.json(
        { success: false, error: 'ניתן להעלות רק קבצי .txt' },
        { status: 400 }
      )
    }

    // קרא את תוכן הקובץ
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const content = buffer.toString('utf-8')

    // צור שם קובץ בטוח
    const safeName = (bookName || file.name.replace('.txt', '')).replace(/[^a-zA-Z0-9א-ת\s]/g, '_')
    const fileName = `${safeName}.txt`
    const filePath = path.join(UPLOADS_PATH, fileName)

    // שמור את הקובץ
    await saveText(filePath, content)

    // שמור מטא-דאטה
    const metaData = {
      bookName: bookName || file.name.replace('.txt', ''),
      author: author || 'לא ידוע',
      description: description || '',
      fileName: fileName,
      uploadedAt: new Date().toISOString(),
      fileSize: buffer.length,
      lines: content.split('\n').length
    }

    const metaPath = path.join(UPLOADS_PATH, `${safeName}.meta.json`)
    fs.writeFileSync(metaPath, JSON.stringify(metaData, null, 2), 'utf-8')

    console.log(`✅ Text file uploaded: ${fileName}`)

    return NextResponse.json({
      success: true,
      message: 'הקובץ הועלה בהצלחה',
      data: metaData
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בהעלאת הקובץ' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const files = []

    if (fs.existsSync(UPLOADS_PATH)) {
      const items = fs.readdirSync(UPLOADS_PATH)
      
      for (const item of items) {
        if (item.endsWith('.meta.json')) {
          const metaPath = path.join(UPLOADS_PATH, item)
          const meta = JSON.parse(await readText(metaPath))
          files.push(meta)
        }
      }
    }

    return NextResponse.json({
      success: true,
      files: files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    })
  } catch (error) {
    console.error('Error loading files:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת קבצים' },
      { status: 500 }
    )
  }
}
