import { compare, hash } from 'bcryptjs'
import { readJSON, saveJSON } from './storage'

const USERS_FILE = 'data/users.json'

// טען משתמשים מ-Blob Storage
async function loadUsers() {
  try {
    const data = await readJSON(USERS_FILE)
    return data || []
  } catch (error) {
    console.error('Error loading users:', error)
    return []
  }
}

// שמור משתמשים ל-Blob Storage
async function saveUsers(users) {
  try {
    await saveJSON(USERS_FILE, users)
  } catch (error) {
    console.error('Error saving users:', error)
    throw error
  }
}

let usersCache = null
let lastLoad = 0
const CACHE_TTL = 5000 // 5 seconds

async function getUsers() {
  const now = Date.now()
  if (!usersCache || (now - lastLoad) > CACHE_TTL) {
    usersCache = await loadUsers()
    lastLoad = now
  }
  return usersCache
}

export async function hashPassword(password) {
  return await hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword)
}

export async function createUser(email, password, name) {
  const users = await getUsers()
  
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
  await saveUsers(users)
  usersCache = users // עדכן cache
  return { id: user.id, email: user.email, name: user.name, role: user.role }
}

export async function getUserByEmail(email) {
  const users = await getUsers()
  return users.find(user => user.email === email)
}

export async function getUserByEmailOrUsername(identifier) {
  const users = await getUsers()
  // חיפוש לפי אימייל או שם משתמש
  return users.find(user => 
    user.email === identifier || 
    user.name.toLowerCase() === identifier.toLowerCase()
  )
}

export async function getUserById(id) {
  const users = await getUsers()
  return users.find(user => user.id === id)
}

// פונקציה לקבלת כל המשתמשים (למנהלים בלבד)
export async function getAllUsers() {
  const users = await getUsers()
  return users.map(({ password, ...user }) => user)
}

// פונקציה לעדכון תפקיד משתמש
export async function updateUserRole(userId, newRole) {
  const users = await getUsers()
  const user = users.find(u => u.id === userId)
  if (user) {
    user.role = newRole
    await saveUsers(users)
    usersCache = users // עדכן cache
    return true
  }
  return false
}

// פונקציה למחיקת משתמש
export async function deleteUser(userId) {
  const users = await getUsers()
  const index = users.findIndex(u => u.id === userId)
  if (index !== -1) {
    users.splice(index, 1)
    await saveUsers(users)
    usersCache = users // עדכן cache
    return true
  }
  return false
}
