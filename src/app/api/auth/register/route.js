import { NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'

export async function POST(request) {
  try {
    const body = await request.json()
    
    // ולידציה
    const validatedData = registerSchema.parse(body)
    
    // יצירת משתמש
    const user = await createUser(
      validatedData.email,
      validatedData.password,
      validatedData.name
    )

    return NextResponse.json(
      { message: 'המשתמש נוצר בהצלחה', user },
      { status: 201 }
    )
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'שגיאה ביצירת משתמש' },
      { status: 400 }
    )
  }
}
