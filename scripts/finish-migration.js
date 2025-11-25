import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api')

// רשימת הקבצים שכבר עודכנו
const updatedFiles = [
  'page-content/route.js',
  'admin/users/update/route.js',
  'admin/users/delete/route.js',
  'users/list/route.js'
]

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let changed = false
  
  // דלג על קבצים שכבר עודכנו
  const relativePath = path.relative(apiDir, filePath).replace(/\\/g, '/')
  if (updatedFiles.includes(relativePath)) {
    console.log(`⏭️  Skipping (already updated): ${relativePath}`)
    return false
  }
  
  // דלג על קבצים שכבר משתמשים ב-storage
  if (content.includes("from '@/lib/storage'")) {
    console.log(`⏭️  Skipping (already uses storage): ${relativePath}`)
    return false
  }
  
  // דלג על קבצים שלא משתמשים ב-fs
  if (!content.includes('fs.writeFileSync') && !content.includes('fs.readFileSync')) {
    return false
  }
  
  console.log(`🔄 Updating: ${relativePath}`)
  
  // הוסף import של storage
  if (!content.includes("from '@/lib/storage'")) {
    // מצא את השורה של import fs
    if (content.includes("import fs from 'fs'")) {
      content = content.replace(
        /import fs from 'fs'/,
        "import { saveJSON, readJSON, saveText, readText, listFiles } from '@/lib/storage'"
      )
      changed = true
    }
  }
  
  // הסר import path אם לא נחוץ יותר
  if (content.includes("import path from 'path'") && !content.includes('path.basename') && !content.includes('path.join')) {
    content = content.replace(/import path from 'path'\n/, '')
  }
  
  // הסר הגדרות PATH
  content = content.replace(/const \w+_PATH = path\.join\(process\.cwd\(\), 'data', '\w+'\)\n*/g, '')
  content = content.replace(/const \w+_PATH = path\.join\(process\.cwd\(\), 'data', '\w+', '\w+'\)\n*/g, '')
  
  // הסר בדיקות fs.existsSync ויצירת תיקיות
  content = content.replace(/if \(!fs\.existsSync\(\w+_PATH\)\) \{\s*fs\.mkdirSync\(\w+_PATH, \{ recursive: true \}\)\s*\}\n*/g, '')
  
  // החלף קריאות JSON
  content = content.replace(
    /JSON\.parse\(fs\.readFileSync\((\w+)_PATH, 'utf-8'\)\)/g,
    "await readJSON('data/$1.json') || []"
  )
  
  // החלף כתיבות JSON
  content = content.replace(
    /fs\.writeFileSync\((\w+)_PATH, JSON\.stringify\((\w+), null, 2\)\)/g,
    "await saveJSON('data/$1.json', $2)"
  )
  
  // החלף קריאות טקסט
  content = content.replace(
    /fs\.readFileSync\(([^,]+), 'utf-8'\)/g,
    'await readText($1)'
  )
  
  // החלף כתיבות טקסט
  content = content.replace(
    /fs\.writeFileSync\(([^,]+), ([^,]+), 'utf-8'\)/g,
    'await saveText($1, $2)'
  )
  
  // הוסף async לפונקציות אם צריך
  if (changed || content.includes('await ')) {
    content = content.replace(/export function (GET|POST|PUT|DELETE|PATCH)/g, 'export async function $1')
    content = content.replace(/async function handle/g, 'async function handle')
    content = content.replace(/function calculate/g, 'async function calculate')
  }
  
  if (changed || content !== fs.readFileSync(filePath, 'utf-8')) {
    fs.writeFileSync(filePath, content)
    console.log(`✅ Updated: ${relativePath}`)
    return true
  }
  
  return false
}

function walkDir(dir) {
  const files = fs.readdirSync(dir)
  let count = 0
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      count += walkDir(filePath)
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      if (updateFile(filePath)) count++
    }
  }
  return count
}

console.log('🔄 מעדכן API routes...\n')
const count = walkDir(apiDir)
console.log(`\n✅ עודכנו ${count} קבצים נוספים`)
