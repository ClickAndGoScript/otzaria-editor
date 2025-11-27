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
    // קרא את הנקודות האמיתיות מ-users.json
    const usersData = await readJSON('data/users.json')
    if (usersData) {
      const user = usersData.find(u => u.id === userId)
      if (user) {
        points = user.points || 0
      }
    }

    // ספור עמודים
    const files = await listFiles('data/pages/')
    const jsonFiles = files.filter(f => f.pathname.endsWith('.json'))

    for (const file of jsonFiles) {
      // קרא ישירות מ-MongoDB במקום fetch
      const pages = await readJSON(file.pathname)
      
      if (!pages || !Array.isArray(pages)) {
        continue
      }

      pages.forEach(page => {
        if (page.claimedById === userId) {
          if (page.status === 'completed') {
            completedPages++
          } else if (page.status === 'in-progress') {
            inProgressPages++
          }
        }
      })
    }

  } catch (error) {
    console.error('Error calculating user stats:', error)
  }

  return { completedPages, inProgressPages, points }
}
