// סקריפט לבדיקת קבצים שהועלו ב-MongoDB
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function checkUploads() {
  const client = new MongoClient(process.env.DATABASE_URL)
  
  try {
    await client.connect()
    console.log('✅ מחובר ל-MongoDB\n')
    
    const db = client.db('otzaria')
    const collection = db.collection('files')
    
    // 1. בדוק את המטא-דאטה של ההעלאות
    console.log('📋 בודק מטא-דאטה של העלאות...\n')
    const metaDoc = await collection.findOne({ path: 'data/uploads-meta.json' })
    
    if (metaDoc && metaDoc.data) {
      console.log(`✅ נמצאו ${metaDoc.data.length} העלאות במטא-דאטה:\n`)
      
      for (const upload of metaDoc.data.slice(0, 5)) {
        console.log(`📄 ${upload.bookName}`)
        console.log(`   קובץ: ${upload.fileName}`)
        console.log(`   גודל: ${upload.fileSize} bytes`)
        console.log(`   שורות: ${upload.lineCount}`)
        console.log(`   סטטוס: ${upload.status}`)
        console.log(`   הועלה על ידי: ${upload.uploadedBy}`)
        console.log(`   תאריך: ${upload.uploadedAt}`)
        console.log('')
      }
      
      if (metaDoc.data.length > 5) {
        console.log(`... ועוד ${metaDoc.data.length - 5} העלאות\n`)
      }
      
      // 2. בדוק אם הקבצים עצמם קיימים
      console.log('🔍 בודק אם הקבצים עצמם קיימים ב-MongoDB...\n')
      
      for (const upload of metaDoc.data.slice(0, 3)) {
        const filePath = `data/uploads/${upload.fileName}`
        const fileDoc = await collection.findOne({ path: filePath })
        
        if (fileDoc) {
          console.log(`✅ ${upload.fileName}`)
          console.log(`   נתיב: ${fileDoc.path}`)
          console.log(`   מבנה: ${Object.keys(fileDoc).join(', ')}`)
          
          if (fileDoc.data) {
            if (typeof fileDoc.data === 'string') {
              console.log(`   סוג נתונים: string`)
              console.log(`   אורך: ${fileDoc.data.length} תווים`)
            } else if (fileDoc.data.content) {
              console.log(`   סוג נתונים: object עם content`)
              console.log(`   אורך content: ${fileDoc.data.content.length} תווים`)
            } else {
              console.log(`   סוג נתונים: ${typeof fileDoc.data}`)
              console.log(`   מפתחות: ${Object.keys(fileDoc.data).join(', ')}`)
            }
          } else {
            console.log(`   ⚠️  אין שדה data!`)
          }
        } else {
          console.log(`❌ ${upload.fileName} - לא נמצא ב-MongoDB!`)
          console.log(`   נתיב מצופה: ${filePath}`)
        }
        console.log('')
      }
      
      // 3. חפש את כל הקבצים בתיקיית uploads
      console.log('📁 כל הקבצים בתיקיית data/uploads/:\n')
      const uploadFiles = await collection.find({
        path: { $regex: '^data/uploads/' }
      }).toArray()
      
      console.log(`נמצאו ${uploadFiles.length} קבצים:\n`)
      for (const file of uploadFiles) {
        console.log(`  - ${file.path}`)
      }
      
    } else {
      console.log('❌ לא נמצא קובץ מטא-דאטה של העלאות')
    }
    
  } catch (error) {
    console.error('❌ שגיאה:', error)
  } finally {
    await client.close()
    console.log('\n✅ סיים')
  }
}

checkUploads()
