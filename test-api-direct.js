// בדיקה ישירה של ה-API
import { listFiles, readJSON } from './src/lib/storage.js'

async function testAPI() {
  try {
    console.log('🔍 קורא רשימת קבצים...\n')
    
    const files = await listFiles('data/pages/')
    console.log(`📦 נמצאו ${files.length} קבצים`)
    
    for (const file of files) {
      console.log(`\n📄 File: ${file.pathname}`)
      console.log(`   URL: ${file.url}`)
      console.log(`   Size: ${file.size}`)
    }
    
    console.log('\n\n🔍 מנסה לקרוא את הספר "חוות דעת"...\n')
    
    const pages = await readJSON('data/pages/חוות דעת.json')
    
    if (!pages) {
      console.log('❌ לא הצלחתי לקרוא את הקובץ!')
    } else if (!Array.isArray(pages)) {
      console.log('❌ הנתונים לא מערך!')
      console.log('סוג:', typeof pages)
    } else {
      console.log(`✅ הצלחתי לקרוא ${pages.length} עמודים`)
      console.log(`   הושלמו: ${pages.filter(p => p.status === 'completed').length}`)
      console.log(`   תמונה ראשונה: ${pages[0]?.thumbnail}`)
      
      // בואו נבדוק את המבנה של הספר
      const bookName = 'חוות דעת'
      const totalPages = pages.length
      const completedPages = pages.filter(p => p.status === 'completed').length
      
      const book = {
        path: bookName,
        name: bookName,
        thumbnail: pages[0]?.thumbnail || null,
        totalPages,
        completedPages
      }
      
      console.log('\n📚 אובייקט הספר שיוחזר:')
      console.log(JSON.stringify(book, null, 2))
    }
    
  } catch (error) {
    console.error('❌ שגיאה:', error)
  }
}

testAPI()
