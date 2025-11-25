import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json')
const PAGES_DATA_PATH = path.join(process.cwd(), 'data', 'pages')

export async function GET(request) {
  try {
    // קרא משתמשים
    if (!fs.existsSync(USERS_PATH)) {
      return NextResponse.json({
        success: true,
        users: []
      })
    }

    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'))

    // חשב נקודות וסטטיסטיקות לכל משתמש
    const usersWithStats = users.map(user => {
      const stats = calculateUserStats(user.id)
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        completedPages: stats.completedPages,
        inProgressPages: stats.inProgressPages,
        points: stats.points
      }
    })

    return NextResponse.json({
      success: true,
      users: usersWithStats
    })
  } catch (error) {
    console.error('Error loading users list:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת המשתמשים' },
      { status: 500 }
    )
  }
}

function calculateUserStats(userId) {
  let completedPages = 0
  let inProgressPages = 0
  let points = 0

  try {
    if (!fs.existsSync(PAGES_DATA_PATH)) {
      return { completedPages: 0, inProgressPages: 0, points: 0 }
    }

    const files = fs.readdirSync(PAGES_DATA_PATH).filter(f => f.endsWith('.json'))

    files.forEach(file => {
      const filePath = path.join(PAGES_DATA_PATH, file)
      const pages = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

      pages.forEach(page => {
        if (page.claimedById === userId) {
          if (page.status === 'completed') {
            completedPages++
            points += 10 // 10 נקודות לכל עמוד שהושלם
          } else if (page.status === 'in-progress') {
            inProgressPages++
            points += 2 // 2 נקודות לכל עמוד בטיפול
          }
        }
      })
    })

    // בונוס נקודות
    if (completedPages >= 100) points += 100 // בונוס ל-100 עמודים
    if (completedPages >= 50) points += 50   // בונוס ל-50 עמודים
    if (completedPages >= 10) points += 20   // בונוס ל-10 עמודים

  } catch (error) {
    console.error('Error calculating user stats:', error)
  }

  return { completedPages, inProgressPages, points }
}
