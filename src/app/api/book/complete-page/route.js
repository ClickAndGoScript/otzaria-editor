import { NextResponse } from 'next/server'
import { saveJSON, readJSON } from '@/lib/storage'

export const runtime = 'nodejs'

export async function POST(request) {
    try {
        const body = await request.json()
        const { bookPath, pageNumber, userId } = body

        console.log('✅ Complete page request:', { bookPath, pageNumber, userId })
        console.log('   Book path length:', bookPath?.length)
        console.log('   Book path char codes:', bookPath ? Array.from(bookPath).map(c => c.charCodeAt(0)) : 'N/A')

        if (!bookPath || !pageNumber || !userId) {
            return NextResponse.json(
                { success: false, error: 'חסרים פרמטרים נדרשים' },
                { status: 400 }
            )
        }

        const bookName = bookPath
        const pagesDataFile = `data/pages/${bookName}.json`

        let pagesData = await readJSON(pagesDataFile)

        if (!pagesData) {
            return NextResponse.json(
                { success: false, error: 'קובץ נתוני העמודים לא נמצא' },
                { status: 404 }
            )
        }

        const pageIndex = pagesData.findIndex(p => p.number === pageNumber)

        if (pageIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'העמוד לא נמצא' },
                { status: 404 }
            )
        }

        const page = pagesData[pageIndex]

        // בדוק שהמשתמש הוא זה שתפס את העמוד
        if (page.claimedById !== userId) {
            return NextResponse.json(
                { success: false, error: 'אין לך הרשאה לסמן עמוד זה כהושלם' },
                { status: 403 }
            )
        }

        // עדכן את העמוד
        pagesData[pageIndex] = {
            ...page,
            status: 'completed',
            completedAt: new Date().toISOString(),
        }

        // שמור בחזרה ל-Storage
        await saveJSON(pagesDataFile, pagesData)

        // עדכן נקודות המשתמש - הוסף 5 נקודות נוספות להשלמת עמוד
        try {
            const usersData = await readJSON('data/users.json')
            if (usersData) {
                const userIndex = usersData.findIndex(u => u.id === userId)
                if (userIndex !== -1) {
                    usersData[userIndex].points = (usersData[userIndex].points || 0) + 5
                    await saveJSON('data/users.json', usersData)
                    console.log(`💰 Added 5 points to user ${userId} (total: ${usersData[userIndex].points})`)
                }
            }
        } catch (error) {
            console.error('⚠️  Error updating user points:', error)
            // לא נכשיל את הבקשה אם עדכון הנקודות נכשל
        }

        // נקה את cache של הגרף השבועי
        try {
            // נקרא לפונקציה דרך dynamic import כדי לא ליצור circular dependency
            const { clearWeeklyProgressCache } = await import('@/app/api/stats/weekly-progress/route')
            clearWeeklyProgressCache()
        } catch (error) {
            console.warn('⚠️  Could not clear weekly progress cache:', error)
        }

        console.log(`✅ Page ${pageNumber} completed by user ${userId}`)

        return NextResponse.json({
            success: true,
            message: 'העמוד סומן כהושלם (+5 נקודות)',
            page: pagesData[pageIndex],
        })
    } catch (error) {
        console.error('❌ Error completing page:', error)
        return NextResponse.json(
            { success: false, error: 'שגיאה בסימון העמוד כהושלם: ' + error.message },
            { status: 500 }
        )
    }
}
