/**
 * סקריפט עזר להעברת נתונים מ-localStorage לשרת
 * 
 * הוראות שימוש:
 * 1. פתח את האתר בדפדפן
 * 2. פתח את ה-Console (F12)
 * 3. העתק והדבק את הקוד הזה
 * 4. הסקריפט יבדוק אם יש נתונים ב-localStorage ויציע להעביר אותם
 */

(async function migrateLocalStorageToServer() {
  console.log('🔍 בודק נתונים ב-localStorage...')
  
  const keysToMigrate = []
  
  // חפש מפתחות של סטטוס עמודים
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('book_') && key.endsWith('_pages')) {
      keysToMigrate.push(key)
    }
  }
  
  if (keysToMigrate.length === 0) {
    console.log('✅ לא נמצאו נתונים ישנים ב-localStorage')
    return
  }
  
  console.log(`📦 נמצאו ${keysToMigrate.length} ספרים עם נתונים ב-localStorage`)
  
  const shouldMigrate = confirm(
    `נמצאו ${keysToMigrate.length} ספרים עם נתונים שמורים מקומית.\n\n` +
    `האם ברצונך להעביר את הנתונים לשרת?\n` +
    `(לאחר ההעברה, הנתונים המקומיים יימחקו)`
  )
  
  if (!shouldMigrate) {
    console.log('❌ ההעברה בוטלה')
    return
  }
  
  console.log('🚀 מתחיל העברת נתונים...')
  
  let successCount = 0
  let errorCount = 0
  
  for (const key of keysToMigrate) {
    try {
      const data = localStorage.getItem(key)
      const pages = JSON.parse(data)
      
      // חלץ את שם הספר מהמפתח
      const bookPath = key.replace('book_', '').replace('_pages', '')
      
      console.log(`📤 מעביר נתונים עבור: ${bookPath}`)
      
      // עבור על כל עמוד ושלח עדכון לשרת
      for (const page of pages) {
        if (page.status !== 'available') {
          // העמוד נתפס או הושלם - שלח לשרת
          const action = page.status === 'completed' ? 'complete' : 'claim'
          
          const response = await fetch(`/api/book/${encodeURIComponent(bookPath)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action,
              bookPath,
              pageNumber: page.number,
              userId: page.claimedById,
              userName: page.claimedBy
            })
          })
          
          if (!response.ok) {
            console.warn(`⚠️ שגיאה בהעברת עמוד ${page.number}`)
          }
        }
      }
      
      // מחק את הנתונים המקומיים
      localStorage.removeItem(key)
      successCount++
      console.log(`✅ הועבר בהצלחה: ${bookPath}`)
      
    } catch (error) {
      console.error(`❌ שגיאה בהעברת ${key}:`, error)
      errorCount++
    }
  }
  
  console.log('\n=== סיכום ===')
  console.log(`✅ הועברו בהצלחה: ${successCount}`)
  console.log(`❌ שגיאות: ${errorCount}`)
  console.log('🎉 ההעברה הושלמה!')
  
  alert(
    `ההעברה הושלמה!\n\n` +
    `✅ הועברו: ${successCount} ספרים\n` +
    `❌ שגיאות: ${errorCount}\n\n` +
    `רענן את הדף כדי לראות את השינויים`
  )
})()
