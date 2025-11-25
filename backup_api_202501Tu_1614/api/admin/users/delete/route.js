import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs'
import path from 'path'

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json')

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

    if (!fs.existsSync(USERS_PATH)) {
      return NextResponse.json(
        { success: false, error: 'קובץ משתמשים לא נמצא' },
        { status: 404 }
      )
    }

    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'))
    const filteredUsers = users.filter(u => u.id !== userId)

    if (filteredUsers.length === users.length) {
      return NextResponse.json(
        { success: false, error: 'משתמש לא נמצא' },
        { status: 404 }
      )
    }

    fs.writeFileSync(USERS_PATH, JSON.stringify(filteredUsers, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה במחיקת משתמש' },
      { status: 500 }
    )
  }
}
