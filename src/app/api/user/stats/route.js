import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { saveJSON, readJSON, saveText, readText, listFiles } from '@/lib/storage'
import path from 'path'



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
      const bookName = path.basename(file.pathname, '.json')
      
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
            bookPath: `${bookName}.pdf`,
            pageNumber: page.number,
            status: page.status,
            date: formatDate(page.status === 'completed' ? page.completedAt : page.claimedAt)
          })
        }
      })
    }

    // מיין לפי תאריך (האחרונים ראשונים) וקח רק 10
    recentActivity.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB - dateA
    })

    const limitedActivity = recentActivity.slice(0, 10)

    return NextResponse.json({
      success: true,
      stats: {
        myPages,
        completedPages,
        inProgressPages,
        recentActivity: limitedActivity
      }
    })
  } catch (error) {
    console.error('Error loading user stats:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת הנתונים' },
      { status: 500 }
    )
  }
}

function formatDate(isoDate) {
  if (!isoDate) return 'לא ידוע'
  
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'עכשיו'
  if (diffMins < 60) return `לפני ${diffMins} דקות`
  if (diffHours < 24) return `לפני ${diffHours} שעות`
  if (diffDays < 7) return `לפני ${diffDays} ימים`
  
  return date.toLocaleDateString('he-IL', { 
    day: 'numeric', 
    month: 'long',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}
