import { compare, hash } from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

// טען משתמשים מקובץ
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading users:', error)
  }
  return []
}

// שמור משתמשים לקובץ
function saveUsers(users) {
  try {
    const dir = path.dirname(USERS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving users:', error)
  }
}

let users = loadUsers()

export async function hashPassword(password) {
  return await hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword)
}

export async function createUser(email, password, name) {
  // בדיקה אם האימייל קיים
  const existingEmail = users.find(user => user.email === email)
  if (existingEmail) {
    throw new Error('משתמש עם אימייל זה כבר קיים')
  }

  // בדיקה אם שם המשתמש קיים
  const existingName = users.find(user => user.name.toLowerCase() === name.toLowerCase())
  if (existingName) {
    throw new Error('שם המשתמש כבר תפוס, אנא בחר שם אחר')
  }

  const hashedPassword = await hashPassword(password)
  const user = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    role: 'user',
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  saveUsers(users)
  return { id: user.id, email: user.email, name: user.name, role: user.role }
}

export async function getUserByEmail(email) {
  return users.find(user => user.email === email)
}

export async function getUserByEmailOrUsername(identifier) {
  // חיפוש לפי אימייל או שם משתמש
  return users.find(user => 
    user.email === identifier || 
    user.name.toLowerCase() === identifier.toLowerCase()
  )
}

export async function getUserById(id) {
  return users.find(user => user.id === id)
}

// פונקציה לקבלת כל המשתמשים (למנהלים בלבד)
export async function getAllUsers() {
  return users.map(({ password, ...user }) => user)
}

// פונקציה לעדכון תפקיד משתמש
export async function updateUserRole(userId, newRole) {
  const user = users.find(u => u.id === userId)
  if (user) {
    user.role = newRole
    saveUsers(users)
    return true
  }
  return false
}

// פונקציה למחיקת משתמש
export async function deleteUser(userId) {
  const index = users.findIndex(u => u.id === userId)
  if (index !== -1) {
    users.splice(index, 1)
    saveUsers(users)
    return true
  }
  return false
}
