import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // בדיקה מיוחדת לדף ניהול - רק מנהלים
    if (path.startsWith('/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // כל שאר הדפים המוגנים - כל משתמש מחובר
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    // דפים שדורשים התחברות
    '/library/dashboard/:path*',
    '/library/admin/:path*',
    '/library/book/:path*',
    '/library/upload/:path*',
    '/library/edit/:path*',
    '/library/users/:path*'
  ]
}
