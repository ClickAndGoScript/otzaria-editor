// סקריפט בדיקה מהיר לראות מה יש ב-MongoDB
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const uri = process.env.DATABASE_URL

async function testLibraryAPI() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    const db = client.db('otzaria')
    const collection = db.collection('files')
    
    console.log('🔍 מחפש קבצי pages...')
    
    // מצא את כל הקבצים שמתחילים ב-data/pages/
    const files = await collection
      .find({ path: { $regex: '^data/pages/' } })
      .toArray()
    
    console.log(`\n📦 נמצאו ${files.length} קבצים:\n`)
    
    for (const file of files) {
      console.log(`📄 ${file.path}`)
      
      if (Array.isArray(file.data)) {
        const totalPages = file.data.length
        const completed = file.data.filter(p => p.status === 'completed').length
        console.log(`   ├─ סה"כ עמודים: ${totalPages}`)
        console.log(`   ├─ הושלמו: ${completed}`)
        console.log(`   └─ תמונה ראשונה: ${file.data[0]?.thumbnail || 'אין'}`)
      } else {
        console.log(`   └─ ⚠️  הנתונים לא במבנה מערך!`)
        console.log(`   └─ סוג הנתונים: ${typeof file.data}`)
        console.log(`   └─ מבנה: ${JSON.stringify(file.data).substring(0, 200)}...`)
      }
      console.log('')
    }
    
  } catch (error) {
    console.error('❌ שגיאה:', error)
  } finally {
    await client.close()
  }
}

testLibraryAPI()
