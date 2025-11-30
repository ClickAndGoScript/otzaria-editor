import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { imageBase64, model = 'gemini-2.5-flash', userApiKey, customPrompt } = await request.json()
    
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Missing image data' },
        { status: 400 }
      )
    }

    // API key - משתמש במפתח של המשתמש או במפתח ברירת מחדל
    const DEFAULT_API_KEY = 'AIzaSyA5wfIFamoian-YOFxFqbOyG5tKUyWkNVw'
    const apiKey = userApiKey || DEFAULT_API_KEY
    
    console.log('🔑 Using API key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'MISSING')
    console.log('📦 Using model:', model)
    console.log('👤 User key:', !!userApiKey)
    console.log('📝 Custom prompt:', !!customPrompt)
    
    // פרומפט משולב - מערכת + משתמש
    const systemPrompt = `You are an OCR system. Your ONLY task is to transcribe text from images. You MUST only perform OCR/text transcription. Return ONLY the transcribed text, nothing else.`

    const defaultUserPrompt = 'The text is in Hebrew, written in Rashi script (traditional Hebrew font).\n\nTranscription guidelines:\n- Transcribe exactly what you see, letter by letter\n- Do NOT add nikud (vowel points) unless they appear in the image\n- Do NOT correct or "fix" words to make them more meaningful\n- Preserve the exact spelling, even if words seem unusual or abbreviated\n- In Rashi script: Final Mem (ם) looks like Samekh (ס), and Alef (א) looks like Het (ח) - be careful\n- Preserve all line breaks and spacing\n- Return only the Hebrew text without explanations'
    
    const userPrompt = customPrompt || defaultUserPrompt
    const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`
    
    // שלח ל-Gemini Vision API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: combinedPrompt
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: imageBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 16384,
            thinkingConfig: {
              thinkingBudget: 2000  // הגבל חשיבה ל-2000 טוקנים
            }
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API error:', errorData)
      
      let errorMessage = `Gemini API error: ${response.status}`
      
      // הודעות שגיאה ידידותיות
      if (response.status === 429) {
        errorMessage = 'חרגת ממכסת הבקשות של Gemini. נסה שוב בעוד דקה או שדרג את התוכנית שלך.'
      } else if (response.status === 403) {
        errorMessage = 'ה-API key לא תקף או לא מורשה. בדוק את המפתח בהגדרות'
      } else if (response.status === 404) {
        errorMessage = 'המודל לא נמצא. נסה מודל אחר (1.5 Flash או 1.5 Pro)'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // חלץ את הטקסט מהתשובה
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    if (!text) {
      const finishReason = data.candidates?.[0]?.finishReason
      let errorMessage = 'No text detected by Gemini'
      
      if (finishReason === 'MAX_TOKENS') {
        errorMessage = 'המודל הגיע למקסימום טוקנים. נסה מודל אחר (2.5 Flash מומלץ) או תמונה קטנה יותר.'
      }
      
      console.error('❌ No text found. Finish reason:', finishReason)
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      text: text.trim()
    })

  } catch (error) {
    console.error('Gemini OCR error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
