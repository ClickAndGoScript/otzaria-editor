// בדיקת API של ספר
async function testBookAPI() {
  const bookName = 'חוות דעת'
  const encodedName = encodeURIComponent(bookName)
  
  console.log('📖 Testing book API...')
  console.log('Book name:', bookName)
  console.log('Encoded:', encodedName)
  console.log('URL:', `http://localhost:3000/api/book/${encodedName}`)
  console.log()
  
  try {
    const response = await fetch(`http://localhost:3000/api/book/${encodedName}`)
    const data = await response.json()
    
    console.log('Response status:', response.status)
    console.log('Response data:', JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testBookAPI()
