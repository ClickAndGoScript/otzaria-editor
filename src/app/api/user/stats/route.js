import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { listFiles } from '@/lib/storage'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'לא מחובר' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // קרא את כל קבצי הסטטוס
    const files = await listFiles('data/pages/')
    const jsonFiles = files.filter(f => f.pathname.endsWith('.json'))
    
    let myPages = 0
    let completedPages = 0
    let inProgressPages = 0
    const recentActivity = []

    for (const file of jsonFiles) {
      const bookName = file.pathname.split('/').pop().replace('.json', '')
      
      try {
        const response = await fetch(file.url)
        if (!response.ok) continue
        
        const pages = await response.json()

        pages.forEach(page => {
          if (page.claimedById === userId) {
            myPages++
            
            if (page.status === 'completed') {
              completedPages++
            } else if (page.status === 'in-progress') {
              inProgressPages++
            }

            // הוסף לפעילות אחרונה
            recentActivity.push({
              bookName,
              pageNumber: page.number,
              status: page.status,
              claimedAt: page.claimedAt,
              completedAt: page.completedAt
            })
          }
        })
      } catch (error) {
        console.error(`Error loading book ${bookName}:`, error)
      }
    }

    // מיין לפי תאריך אחרון
    recentActivity.sort((a, b) => {
      const dateA = new Date(a.completedAt || a.claimedAt)
      const dateB = new Date(b.completedAt || b.claimedAt)
      return dateB - dateA
    })

    return NextResponse.json({
      success: true,
      stats: {
        myPages,
        completedPages,
        inProgressPages,
        points: (completedPages * 10) + (inProgressPages * 2)
      },
      recentActivity: recentActivity.slice(0, 10) // 10 אחרונים
    })
  } catch (error) {
    console.error('Error loading user stats:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת סטטיסטיקות' },
      { status: 500 }
    )
  }
}
