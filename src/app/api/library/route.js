import { NextResponse } from 'next/server'
import { loadLibraryStructure } from '@/lib/library-loader'

export const runtime = 'nodejs'

export async function GET(request) {
  try {
    // בדוק אם יש פרמטר refresh
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'
    
    const structure = await loadLibraryStructure(forceRefresh)
    
    return NextResponse.json({
      success: true,
      data: structure,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in library API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load library structure',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// רענון מטמון (אופציונלי)
export const revalidate = 60 // רענון כל 60 שניות
