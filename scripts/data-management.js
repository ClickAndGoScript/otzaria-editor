/**
 * סקריפטים לניהול נתונים
 * הרץ עם: node scripts/data-management.js [פקודה]
 */

const fs = require('fs')
const path = require('path')

const PAGES_PATH = path.join(__dirname, '..', 'data', 'pages')
const CONTENT_PATH = path.join(__dirname, '..', 'data', 'content')

// פקודות זמינות
const commands = {
  stats: showStats,
  'reset-page': resetPage,
  'reset-book': resetBook,
  'list-books': listBooks,
  'export-progress': exportProgress,
  help: showHelp
}

// הצג עזרה
function showHelp() {
  console.log(`
📚 סקריפטים לניהול נתונים

שימוש: node scripts/data-management.js [פקודה] [פרמטרים]

פקודות זמינות:

  stats                    - הצג סטטיסטיקות כלליות
  list-books              - הצג רשימת ספרים
  reset-page <ספר> <עמוד> - אפס עמוד ספציפי
  reset-book <ספר>        - אפס ספר שלם
  export-progress         - ייצא דוח התקדמות ל-CSV
  help                    - הצג עזרה זו

דוגמאות:
  node scripts/data-management.js stats
  node scripts/data-management.js reset-page "אילת השחר שמות" 5
  node scripts/data-management.js export-progress
`)
}

// הצג סטטיסטיקות
function showStats() {
  console.log('\n📊 סטטיסטיקות מערכת\n')
  
  if (!fs.existsSync(PAGES_PATH)) {
    console.log('❌ תיקיית pages לא נמצאה')
    return
  }
  
  const files = fs.readdirSync(PAGES_PATH).filter(f => f.endsWith('.json'))
  
  let totalPages = 0
  let availablePages = 0
  let inProgressPages = 0
  let completedPages = 0
  
  const bookStats = []
  
  files.forEach(file => {
    const bookName = path.basename(file, '.json')
    const filePath = path.join(PAGES_PATH, file)
    const pages = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    
    const stats = {
      name: bookName,
      total: pages.length,
      available: pages.filter(p => p.status === 'available').length,
      inProgress: pages.filter(p => p.status === 'in-progress').length,
      completed: pages.filter(p => p.status === 'completed').length
    }
    
    stats.progress = Math.round((stats.completed / stats.total) * 100)
    
    bookStats.push(stats)
    
    totalPages += stats.total
    availablePages += stats.available
    inProgressPages += stats.inProgress
    completedPages += stats.completed
  })
  
  // סטטיסטיקות כלליות
  console.log('=== סה"כ ===')
  console.log(`📚 ספרים: ${files.length}`)
  console.log(`📄 עמודים: ${totalPages}`)
  console.log(`✅ הושלמו: ${completedPages} (${Math.round((completedPages/totalPages)*100)}%)`)
  console.log(`🔄 בטיפול: ${inProgressPages}`)
  console.log(`⏳ זמינים: ${availablePages}`)
  
  // סטטיסטיקות לפי ספר
  console.log('\n=== לפי ספר ===')
  bookStats
    .sort((a, b) => b.progress - a.progress)
    .forEach(book => {
      const bar = '█'.repeat(Math.floor(book.progress / 5))
      console.log(`\n${book.name}`)
      console.log(`  התקדמות: [${bar.padEnd(20, '░')}] ${book.progress}%`)
      console.log(`  הושלמו: ${book.completed}/${book.total}`)
      console.log(`  בטיפול: ${book.inProgress}`)
    })
  
  // קבצי תוכן
  if (fs.existsSync(CONTENT_PATH)) {
    const contentFiles = fs.readdirSync(CONTENT_PATH).filter(f => f.endsWith('.txt'))
    console.log(`\n📝 קבצי תוכן: ${contentFiles.length}`)
  }
  
  console.log('')
}

// הצג רשימת ספרים
function listBooks() {
  console.log('\n📚 רשימת ספרים\n')
  
  if (!fs.existsSync(PAGES_PATH)) {
    console.log('❌ תיקיית pages לא נמצאה')
    return
  }
  
  const files = fs.readdirSync(PAGES_PATH).filter(f => f.endsWith('.json'))
  
  files.forEach((file, index) => {
    const bookName = path.basename(file, '.json')
    const filePath = path.join(PAGES_PATH, file)
    const pages = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const completed = pages.filter(p => p.status === 'completed').length
    const progress = Math.round((completed / pages.length) * 100)
    
    console.log(`${index + 1}. ${bookName}`)
    console.log(`   עמודים: ${pages.length} | הושלמו: ${completed} (${progress}%)`)
  })
  
  console.log('')
}

// אפס עמוד ספציפי
function resetPage(bookName, pageNumber) {
  if (!bookName || !pageNumber) {
    console.log('❌ שימוש: reset-page <ספר> <עמוד>')
    return
  }
  
  const filePath = path.join(PAGES_PATH, `${bookName}.json`)
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ הספר "${bookName}" לא נמצא`)
    return
  }
  
  const pages = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const pageIndex = pages.findIndex(p => p.number === parseInt(pageNumber))
  
  if (pageIndex === -1) {
    console.log(`❌ עמוד ${pageNumber} לא נמצא`)
    return
  }
  
  const oldStatus = pages[pageIndex].status
  
  pages[pageIndex] = {
    ...pages[pageIndex],
    status: 'available',
    claimedBy: null,
    claimedById: null,
    claimedAt: null,
    completedAt: null
  }
  
  fs.writeFileSync(filePath, JSON.stringify(pages, null, 2))
  
  console.log(`✅ עמוד ${pageNumber} אופס (היה: ${oldStatus})`)
}

// אפס ספר שלם
function resetBook(bookName) {
  if (!bookName) {
    console.log('❌ שימוש: reset-book <ספר>')
    return
  }
  
  const filePath = path.join(PAGES_PATH, `${bookName}.json`)
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ הספר "${bookName}" לא נמצא`)
    return
  }
  
  const pages = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  
  const resetPages = pages.map(page => ({
    ...page,
    status: 'available',
    claimedBy: null,
    claimedById: null,
    claimedAt: null,
    completedAt: null
  }))
  
  fs.writeFileSync(filePath, JSON.stringify(resetPages, null, 2))
  
  console.log(`✅ הספר "${bookName}" אופס (${pages.length} עמודים)`)
}

// ייצא דוח התקדמות
function exportProgress() {
  console.log('\n📤 מייצא דוח התקדמות...\n')
  
  if (!fs.existsSync(PAGES_PATH)) {
    console.log('❌ תיקיית pages לא נמצאה')
    return
  }
  
  const files = fs.readdirSync(PAGES_PATH).filter(f => f.endsWith('.json'))
  
  let csv = 'ספר,סה"כ עמודים,זמינים,בטיפול,הושלמו,אחוז התקדמות\n'
  
  files.forEach(file => {
    const bookName = path.basename(file, '.json')
    const filePath = path.join(PAGES_PATH, file)
    const pages = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    
    const total = pages.length
    const available = pages.filter(p => p.status === 'available').length
    const inProgress = pages.filter(p => p.status === 'in-progress').length
    const completed = pages.filter(p => p.status === 'completed').length
    const progress = Math.round((completed / total) * 100)
    
    csv += `"${bookName}",${total},${available},${inProgress},${completed},${progress}%\n`
  })
  
  const outputPath = path.join(__dirname, '..', 'progress-report.csv')
  fs.writeFileSync(outputPath, csv, 'utf-8')
  
  console.log(`✅ הדוח נשמר ב: ${outputPath}`)
}

// הרץ את הפקודה
const command = process.argv[2] || 'help'
const args = process.argv.slice(3)

if (commands[command]) {
  commands[command](...args)
} else {
  console.log(`❌ פקודה לא מוכרת: ${command}`)
  showHelp()
}
