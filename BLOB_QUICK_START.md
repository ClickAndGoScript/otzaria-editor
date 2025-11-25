# מדריך מהיר - מעבר ל-Vercel Blob Storage

## למה צריך את זה?

האתר שלך לא שומר נתונים ב-Vercel כי הוא משתמש בקבצים מקומיים (`data/`).
ב-Vercel, קבצים נמחקים אחרי כל deployment.

**הפתרון:** Vercel Blob Storage - שומר קבצים לצמיתות בענן.

---

## התחלה מהירה (10 דקות)

### שלב 1: קבל את BLOB_READ_WRITE_TOKEN

1. לך ל: https://vercel.com/dashboard
2. בחר את הפרויקט: **otzariaeditor**
3. **Settings** → **Environment Variables**
4. מצא **BLOB_READ_WRITE_TOKEN**
5. לחץ על העין 👁️ לראות את הערך
6. העתק את הערך (מתחיל ב-`vercel_blob_rw_...`)

### שלב 2: הוסף ל-.env.local

פתח את `.env.local` והוסף:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_ABC123XYZ...
```

(הדבק את הערך שהעתקת)

### שלב 3: הרץ את הסקריפט

```bash
setup-blob-storage.bat
```

הסקריפט יעשה הכל אוטומטית:
- ✅ יתקין את @vercel/blob
- ✅ יעלה את כל הנתונים
- ✅ יעדכן את הקוד
- ✅ יפרוס ל-Vercel

### זהו! 🎉

---

## אם משהו לא עובד

### בעיה: "BLOB_READ_WRITE_TOKEN לא מוגדר"

**פתרון:**
1. בדוק ש-Blob Store מחובר לפרויקט ב-Vercel
2. וודא שהעתקת את הערך המלא (כולל `vercel_blob_rw_`)
3. אין רווחים לפני או אחרי הערך

### בעיה: "Upload failed"

**פתרון:**
1. בדוק את החיבור לאינטרנט
2. וודא שה-Token נכון
3. נסה שוב: `node scripts/upload-to-blob.js`

### בעיה: "Build failed"

**פתרון:**
1. יש גיבוי אוטומטי ב-`backup_api_*`
2. הסקריפט ישחזר אוטומטית
3. דווח על השגיאה

---

## מה קורה מאחורי הקלעים?

### לפני:
```javascript
// שמירה מקומית - נמחק ב-Vercel
fs.writeFileSync('data/users.json', JSON.stringify(users))
```

### אחרי:
```javascript
// שמירה ב-Blob - נשמר לצמיתות
await saveJSON('data/users.json', users)
```

---

## עלויות

- **חינמי:** עד 1GB
- **אחרי:** $0.15/GB

הפרויקט שלך כנראה יישאר חינמי (users.json + pages + content = ~100MB)

---

## שאלות נפוצות

**ש: האם הנתונים המקומיים נמחקים?**
ת: לא, הם נשארים ב-`data/`. הסקריפט רק מעתיק אותם ל-Blob.

**ש: מה אם אני רוצה לחזור לקבצים מקומיים?**
ת: יש גיבוי אוטומטי ב-`backup_api_*`. פשוט תשחזר ממנו.

**ש: האם צריך להעלות מחדש אחרי כל שינוי?**
ת: לא! אחרי המעבר, הכל אוטומטי. הקוד שומר ישירות ל-Blob.

**ש: איך אני רואה את הקבצים ב-Blob?**
ת: Vercel Dashboard → Storage → otzariaeditor-blob → Browse

---

## תמיכה

אם יש בעיות, בדוק את:
- `backup_api_*` - גיבוי של הקוד
- `data/` - הנתונים המקומיים (לא נמחקו)
- Vercel Logs - לוגים של השרת

---

## סיכום

| לפני | אחרי |
|------|------|
| ❌ נתונים נמחקים | ✅ נתונים נשמרים |
| ❌ לא עובד ב-Vercel | ✅ עובד מושלם |
| ❌ צריך DB חיצוני | ✅ הכל ב-Vercel |

**הרץ:** `setup-blob-storage.bat` **ותהנה!** 🚀
