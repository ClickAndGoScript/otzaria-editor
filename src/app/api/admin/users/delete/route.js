import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { readJSON, saveJSON } from '@/lib/storage'

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'חסר מזהה משתמש' },
        { status: 400 }
      )
    }

    // מנע מחיקה עצמית
    if (userId === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'לא ניתן למחוק את עצמך' },
        { status: 400 }
      )
    }

    const users = await readJSON('data/users.json')
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'קובץ משתמשים לא נמצא' },
        { status: 404 }
      )
    }

    const filteredUsers = users.filter(u => u.id !== userId)

    if (filteredUsers.length === users.length) {
      return NextResponse.json(
        { success: false, error: 'משתמש לא נמצא' },
        { status: 404 }
      )
    }

    await saveJSON('data/users.json', filteredUsers)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה במחיקת משתמש' },
      { status: 500 }
    )
  }
}
