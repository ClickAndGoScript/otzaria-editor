import { NextResponse } from 'next/server'
import { readText } from '@/lib/storage'

export const runtime = 'nodejs'

export async function GET(request, { params }) {
  try {
    console.log('📥 Download request received')
    console.log('   Full URL:', request.url)
    
    // Next.js 15: params is a Promise, must await it
    const resolvedParams = await params
    
    console.log('   Resolved params:', resolvedParams)
    
    // וודא ש-params.path קיים ומערך
    if (!resolvedParams || !resolvedParams.path) {
      console.error('❌ No path in params')
      return NextResponse.json(
        { success: false, error: 'נתיב חסר' },
        { status: 400 }
      )
    }
    
    // קבל את הנתיב המלא ופענח אותו (decode URL encoding)
    const pathSegments = Array.isArray(resolvedParams.path) 
      ? resolvedParams.path.map(segment => decodeURIComponent(segment))
      : [decodeURIComponent(resolvedParams.path)]
    
    const filePath = `data/uploads/${pathSegments.join('/')}`
    
    console.log('   Path segments (decoded):', pathSegments)
    console.log('   File path:', filePath)

    // קרא את הקובץ מ-MongoDB
    const content = await readText(filePath)
    
    if (!content || content === null) {
      console.error('❌ File not found in MongoDB:', filePath)
      
      // נסה למצוא קבצים דומים
      try {
        const { MongoClient } = await import('mongodb')
        const client = new MongoClient(process.env.DATABASE_URL)
        await client.connect()
        const db = client.db('otzaria')
        const collection = db.collection('files')
        
        // חפש בתיקיית uploads
        const similarFiles = await collection.find({
          path: { $regex: '^data/uploads/' }
        }).limit(10).toArray()
        
        console.log('📋 Files in uploads folder:', similarFiles.map(f => f.path))
        
        // גם חפש את הקובץ הספציפי
        const exactFile = await collection.findOne({ path: filePath })
        if (exactFile) {
          console.log('📄 File exists but data structure:', Object.keys(exactFile))
        }
        
        await client.close()
      } catch (err) {
        console.error('Error searching for similar files:', err)
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'קובץ לא נמצא במערכת', 
          path: filePath,
          hint: 'ייתכן שהקובץ לא הועלה כראוי או נמחק'
        },
        { status: 404 }
      )
    }

    console.log('✅ File found, sending content')
    console.log('   Content length:', content?.length || 0)

    // חלץ את שם הקובץ
    const fileName = pathSegments[pathSegments.length - 1]

    // החזר את הקובץ
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    })
  } catch (error) {
    console.error('❌ Error downloading file:', error)
    console.error('   Error stack:', error.stack)
    return NextResponse.json(
      { success: false, error: 'שגיאה בהורדת הקובץ', details: error.message },
      { status: 500 }
    )
  }
}
