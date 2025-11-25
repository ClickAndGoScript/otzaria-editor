import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs'
import path from 'path'

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json')

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const { userId, updates } = await request.json()

    if (!userId || !updates) {
      return NextResponse.json(
        { success: false, error: 'חסרים פרמטרים' },
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
    const userIndex = users.findIndex(u => u.id === userId)

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'משתמש לא נמצא' },
        { status: 404 }
      )
    }

    // עדכן רק שדות מותרים
    const allowedFields = ['name', 'role']
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        users[userIndex][field] = updates[field]
      }
    })

    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2))

    return NextResponse.json({ success: true, user: users[userIndex] })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בעדכון משתמש' },
      { status: 500 }
    )
  }
}
