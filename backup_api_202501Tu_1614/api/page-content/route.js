import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CONTENT_PATH = path.join(process.cwd(), 'data', 'content')

// יצירת תיקייה אם לא קיימת
if (!fs.existsSync(CONTENT_PATH)) {
  fs.mkdirSync(CONTENT_PATH, { recursive: true })
}

export async function POST(request) {
  try {
    const { bookPath, pageNumber, content, leftColumn, rightColumn, twoColumns } = await request.json()

    if (!bookPath || !pageNumber) {
      return NextResponse.json(
        { success: false, error: 'חסרים פרמטרים' },
        { status: 400 }
      )
    }

    // צור שם קובץ בטוח
    const bookName = path.basename(bookPath, '.pdf').replace(/[^a-zA-Z0-9א-ת]/g, '_')
    const fileName = `${bookName}_page_${pageNumber}.txt`
    const filePath = path.join(CONTENT_PATH, fileName)

    // בנה את התוכן לשמירה
    let textContent = ''
    
    if (twoColumns) {
      // אם יש שני טורים, שמור אותם עם מפריד
      textContent = `=== טור ימין ===\n${rightColumn || ''}\n\n=== טור שמאל ===\n${leftColumn || ''}`
    } else {
      // אם יש טור אחד, שמור אותו כמו שהוא
      textContent = content || ''
    }

    fs.writeFileSync(filePath, textContent, 'utf-8')

    console.log(`✅ Content saved: ${fileName}`)

    return NextResponse.json({
      success: true,
      message: 'התוכן נשמר בהצלחה'
    })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בשמירת התוכן' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookPath = searchParams.get('bookPath')
    const pageNumber = searchParams.get('pageNumber')

    if (!bookPath || !pageNumber) {
      return NextResponse.json(
        { success: false, error: 'חסרים פרמטרים' },
        { status: 400 }
      )
    }

    const bookName = path.basename(bookPath, '.pdf').replace(/[^a-zA-Z0-9א-ת]/g, '_')
    const fileName = `${bookName}_page_${pageNumber}.txt`
    const filePath = path.join(CONTENT_PATH, fileName)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: true,
        data: {
          content: '',
          leftColumn: '',
          rightColumn: '',
          twoColumns: false
        }
      })
    }

    const textContent = fs.readFileSync(filePath, 'utf-8')
    
    // נסה לזהות אם יש שני טורים
    const rightMatch = textContent.match(/=== טור ימין ===\n([\s\S]*?)\n\n=== טור שמאל ===/)
    const leftMatch = textContent.match(/=== טור שמאל ===\n([\s\S]*)/)
    
    let data
    if (rightMatch && leftMatch) {
      // יש שני טורים
      data = {
        content: '',
        leftColumn: leftMatch[1] || '',
        rightColumn: rightMatch[1] || '',
        twoColumns: true
      }
    } else {
      // טור אחד
      data = {
        content: textContent,
        leftColumn: '',
        rightColumn: '',
        twoColumns: false
      }
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error loading content:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת התוכן' },
      { status: 500 }
    )
  }
}
