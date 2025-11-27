import '../styles/globals.css'
import SessionProvider from '@/components/SessionProvider'
import ErrorBoundary from '@/components/ErrorBoundary'

export const metadata = {
  title: 'אוצריא | מאגר תורני פתוח',
  description: 'מאגר תורני רחב עם ממשק מודרני ומהיר. תוכנה חינמית לשימוש במחשב אישי או במכשיר הנייד, ללימוד תורה בקלות ובנוחות בכל מקום.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" href="/logo.png" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" 
        />
      </head>
      <body>
        <ErrorBoundary>
          <SessionProvider>{children}</SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
