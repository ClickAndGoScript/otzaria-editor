import { NextResponse } from 'next/server'
import { readJSON, listFiles } from '@/lib/storage'

export async function GET(request) {
  try {
    // קרא משתמשים
    const users = await readJSON('data/users.json')
    
    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        users: []
      })
    }

    // חשב נקודות וסטטיסטיקות לכל משתמש
    const usersWithStats = await Promise.all(users.map(async user => {
      const stats = await calculateUserStats(user.id)
      
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
    }))

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

async function calculateUserStats(userId) {
  let completedPages = 0
  let inProgressPages = 0
  let points = 0

  try {
    const files = await listFiles('data/pages/')
    const jsonFiles = files.filter(f => f.pathname.endsWith('.json'))

    for (const file of jsonFiles) {
      const response = await fetch(file.url)
      if (!response.ok) continue
      
      const pages = await response.json()

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
    }

    // בונוס נקודות
    if (completedPages >= 100) points += 100 // בונוס ל-100 עמודים
    if (completedPages >= 50) points += 50   // בונוס ל-50 עמודים
    if (completedPages >= 10) points += 20   // בונוס ל-10 עמודים

  } catch (error) {
    console.error('Error calculating user stats:', error)
  }

  return { completedPages, inProgressPages, points }
}
