# מעבר למערכת מבוססת תמונות בלבד

## מה השתנה?

המערכת עברה לעבוד **רק עם תמונות** ללא קבצי PDF:

### ✅ לפני:
- קבצי PDF ב-`public/assets/library/`
- תמונות ב-`public/thumbnails/`
- הקוד היה תלוי ב-PDF

### ✅ אחרי:
- **רק תמונות** ב-`public/thumbnails/`
- אין צורך ב-PDF בכלל
- הקוד עובד ישירות עם התמונות

---

## מבנה התיקיות

```
public/thumbnails/
  ├── חוות דעת/
  │   ├── page-1.jpg
  │   ├── page-2.jpg
  │   └── page-3.jpg
  ├── בעל התרומות/
  │   ├── page-1.jpg
  │   └── page-2.jpg
```

**כל תיקייה = ספר אחד**
**כל תמונה = עמוד אחד**

---

## פורמטים נתמכים

התמונות יכולות להיות:
- `.jpg` / `.jpeg`
- `.png`
- `.webp`

שמות קבצים נתמכים:
- `page-1.jpg`
- `page-2.jpg`
- `page_1.jpg`
- `1.jpg`

---

## איך להוסיף ספר חדש?

### שלב 1: צור תיקייה
```
public/thumbnails/שם הספר/
```

### שלב 2: הוסף תמונות
העתק את כל תמונות העמודים לתיקייה:
```
public/thumbnails/שם הספר/page-1.jpg
public/thumbnails/שם הספר/page-2.jpg
...
```

### שלב 3: זהו!
המערכת תזהה אוטומטית את הספר ואת מספר העמודים.

---

## העלאה ל-Vercel (Blob Storage)

כדי שהתמונות יישמרו בענן:

### שלב 1: וודא שיש לך BLOB_READ_WRITE_TOKEN
בדוק ב-`.env.local`:
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### שלב 2: הרץ סקריפט העלאה
```bash
node scripts/upload-thumbnails-to-blob.js
```

הסקריפט יעלה את כל התמונות מ-`public/thumbnails/` ל-Blob Storage.

### שלב 3: הפעל Blob Storage בייצור
הוסף ל-Vercel Environment Variables:
```
USE_BLOB_STORAGE=true
```

---

## מה נמחק?

הקבצים הבאים הוסרו כי הם לא נחוצים יותר:
- ❌ `src/components/PDFPagePreview.jsx` - קומפוננט להצגת PDF
- ❌ `public/assets/library/` - תיקיית PDF (אופציונלי למחוק)

---

## שינויים בקוד

### `src/lib/library-loader.js`
- סורק רק תיקיות thumbnails
- כל תיקייה = ספר
- ספירת תמונות = מספר עמודים

### `src/app/api/book/[...path]/route.js`
- מחשב מספר עמודים מספירת תמונות
- לא תלוי יותר ב-PDF

### `src/app/api/page-content/route.js`
- שם הספר = שם התיקייה (לא `.pdf`)

---

## בדיקה מקומית

### 1. וודא שיש תמונות
```bash
dir public\thumbnails
```

### 2. הרץ את השרת
```bash
npm run dev
```

### 3. פתח את הספרייה
```
http://localhost:3000/library
```

אתה אמור לראות את הספרים שיש להם תמונות.

---

## פתרון בעיות

### בעיה: "לא נמצאו ספרים"
**פתרון:**
1. בדוק ש-`public/thumbnails/` קיימת
2. בדוק שיש תיקיות בפנים
3. בדוק שיש תמונות בתיקיות

### בעיה: "לא נמצאו תמונות עבור ספר זה"
**פתרון:**
1. בדוק ששם התיקייה תואם לשם הספר
2. בדוק שהתמונות בפורמט נתמך (jpg/png/webp)
3. בדוק ששמות הקבצים תקינים (`page-1.jpg`)

### בעיה: "התמונות נמחקות ב-Vercel"
**פתרון:**
1. הרץ `node scripts/upload-thumbnails-to-blob.js`
2. הוסף `USE_BLOB_STORAGE=true` ל-Vercel Environment Variables
3. פרוס מחדש

---

## סיכום

✅ המערכת עובדת רק עם תמונות
✅ אין צורך ב-PDF
✅ קל להוסיף ספרים חדשים
✅ תומך ב-Blob Storage לייצור
✅ עובד מקומית עם קבצים רגילים

**זה הכל! המערכת פשוטה ויעילה יותר.**
