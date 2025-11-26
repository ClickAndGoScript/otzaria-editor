import { NextResponse } from 'next/server'
import { readText } from '@/lib/storage'

export const runtime = 'nodejs'

export async function GET(request, { params }) {
  try {
    // קבל את הנתיב המלא
    const pathSegments = params.path
    const filePath = pathSegments.join('/')
    
    console.log('📥 Download request:', filePath)
    console.log('   Path segments:', pathSegments)
    console.log('   Full URL:', request.url)

    // קרא את הקובץ מ-MongoDB
    const content = await readText(filePath)
    
    if (!content) {
      console.error('❌ File not found in MongoDB:', filePath)
      
      // נסה למצוא קבצים דומים
      try {
        const { MongoClient } = await import('mongodb')
        const client = new MongoClient(process.env.DATABASE_URL)
        await client.connect()
        const db = client.db('otzaria')
        const collection = db.collection('files')
        
        const similarFiles = await collection.find({
          path: { $regex: pathSegments[pathSegments.length - 1] }
        }).limit(5).toArray()
        
        console.log('📋 Similar files found:', similarFiles.map(f => f.path))
        await client.close()
      } catch (err) {
        console.error('Error searching for similar files:', err)
      }
      
      return NextResponse.json(
        { success: false, error: 'קובץ לא נמצא', path: filePath },
        { status: 404 }
      )
    }

    console.log('✅ File found, sending content')

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
