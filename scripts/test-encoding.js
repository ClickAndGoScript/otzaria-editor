// בדיקת קידוד של שם ספר עם עברית ורווח

const bookName = 'חוות דעת'

console.log('📖 Testing encoding for:', bookName)
console.log()

console.log('Original:', bookName)
console.log('encodeURIComponent:', encodeURIComponent(bookName))
console.log('decodeURIComponent:', decodeURIComponent(encodeURIComponent(bookName)))
console.log()

// בדיקת נתיב ב-Blob
const blobPath = `dev/thumbnails/${bookName}/`
console.log('Blob path:', blobPath)
console.log('Blob path encoded:', encodeURIComponent(blobPath))
console.log()

// בדיקת מה קורה ב-URL
const url = `/book/${encodeURIComponent(bookName)}`
console.log('URL:', url)
console.log('URL decoded:', decodeURIComponent(url.split('/').pop()))
