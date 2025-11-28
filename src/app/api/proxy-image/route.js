import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Missing image URL' },
        { status: 400 }
      )
    }

    // הורד את התמונה מ-GitHub
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    // קבל את התמונה כ-buffer
    const imageBuffer = await response.arrayBuffer()
    
    // החזר את התמונה עם headers מתאימים
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Proxy image error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
