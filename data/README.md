# תיקיית Data - מבנה ותיעוד

תיקייה זו מכילה את כל הנתונים של המערכת.

## מבנה התיקייה

```
data/
├── pages/              # סטטוס עמודים לכל ספר
│   ├── ספר1.json
│   ├── ספר2.json
│   └── ...
├── content/            # תוכן עמודים ערוכים
│   ├── ספר1_page_1.txt
│   ├── ספר1_page_2.txt
│   └── ...
├── users.json          # רשימת משתמשים
└── .gitignore          # קבצים שלא להעלות ל-Git
```

## קבצי סטטוס עמודים (pages/)

כל ספר יש לו קובץ JSON עם מערך של עמודים.

### מבנה העמוד:
```json
{
  "number": 1,                    // מספר העמוד
  "status": "available",          // סטטוס: available / in-progress / completed
  "claimedBy": null,              // שם המשתמש שתפס את העמוד
  "claimedById": null,            // ID של המשתמש
  "claimedAt": null,              // תאריך תפיסה (ISO 8601)
  "completedAt": null,            // תאריך השלמה (ISO 8601)
  "thumbnail": "/thumbnails/..."  // נתיב לתמונת העמוד
}
```

### סטטוסים אפשריים:
- **available** - העמוד זמין לעריכה
- **in-progress** - העמוד בטיפול של משתמש
- **completed** - העמוד הושלם

### דוגמה מלאה:
```json
[
  {
    "number": 1,
    "status": "completed",
    "claimedBy": "יוסי כהן",
    "claimedById": "1764024411215",
    "claimedAt": "2025-11-25T10:30:00.000Z",
    "completedAt": "2025-11-25T11:45:00.000Z",
    "thumbnail": "/thumbnails/אילת השחר שמות/page-1.jpg"
  },
  {
    "number": 2,
    "status": "in-progress",
    "claimedBy": "שרה לוי",
    "claimedById": "1764024411216",
    "claimedAt": "2025-11-25T12:00:00.000Z",
    "completedAt": null,
    "thumbnail": "/thumbnails/אילת השחר שמות/page-2.jpg"
  },
  {
    "number": 3,
    "status": "available",
    "claimedBy": null,
    "claimedById": null,
    "claimedAt": null,
    "completedAt": null,
    "thumbnail": "/thumbnails/אילת השחר שמות/page-3.jpg"
  }
]
```

## קבצי תוכן (content/)

כל עמוד שנערך נשמר בקובץ טקסט נפרד.

### שם הקובץ:
```
[שם_ספר]_page_[מספר].txt
```

תווים מיוחדים מוחלפים ב-underscore (_).

### תוכן - טור אחד:
```
זה הטקסט שהוקלד בעמוד...
יכול להיות מספר שורות
ועם תגי HTML כמו <b>מודגש</b>
```

### תוכן - שני טורים:
```
=== טור ימין ===
טקסט הטור הימני
שורה 1
שורה 2

=== טור שמאל ===
טקסט הטור השמאלי
שורה 1
שורה 2
```

## קובץ משתמשים (users.json)

מכיל רשימת כל המשתמשים במערכת.

### מבנה:
```json
[
  {
    "id": "1764024411215",
    "email": "user@example.com",
    "password": "$2b$12$...",      // סיסמה מוצפנת
    "name": "יוסי כהן",
    "role": "user",                 // user / admin
    "createdAt": "2025-11-24T22:46:51.215Z"
  }
]
```

## גיבוי והחזרה

### גיבוי ידני:
```bash
# Windows
xcopy /E /I data data_backup_%date%

# Linux/Mac
cp -r data data_backup_$(date +%Y%m%d)
```

### גיבוי אוטומטי (מומלץ):
הוסף ל-cron או Task Scheduler:
```bash
# כל יום ב-2 בלילה
0 2 * * * cd /path/to/project && cp -r data data_backup_$(date +\%Y\%m\%d)
```

### החזרת גיבוי:
```bash
# Windows
xcopy /E /I data_backup_20251125 data

# Linux/Mac
cp -r data_backup_20251125/* data/
```

## אבטחה

### הרשאות קבצים (Linux/Mac):
```bash
chmod 755 data
chmod 644 data/*.json
chmod 644 data/pages/*.json
chmod 644 data/content/*.txt
```

### .gitignore
הקובץ `.gitignore` מוודא שנתונים רגישים לא מועלים ל-Git:
```
# תוכן עמודים (יכול להיות גדול)
content/*.txt

# משתמשים (מכיל סיסמאות)
users.json

# גיבויים
*_backup_*
```

## תחזוקה

### ניקוי קבצים ישנים:
```bash
# מחק קבצי תוכן של עמודים שהושלמו לפני 30 יום
find data/content -name "*.txt" -mtime +30 -delete
```

### בדיקת תקינות:
```bash
# בדוק שכל קבצי JSON תקינים
for file in data/pages/*.json; do
  echo "Checking $file"
  python -m json.tool "$file" > /dev/null || echo "ERROR in $file"
done
```

### סטטיסטיקות:
```bash
# ספור עמודים לפי סטטוס
grep -h "status" data/pages/*.json | sort | uniq -c
```

## שאלות נפוצות

**ש: מה קורה אם קובץ JSON מתקלקל?**
ת: המערכת תיצור אותו מחדש עם ערכי ברירת מחדל. אם יש גיבוי, אפשר לשחזר ממנו.

**ש: האם אפשר לערוך את הקבצים ידנית?**
ת: כן, אבל זהירות! וודא שה-JSON תקין. מומלץ לעשות גיבוי לפני.

**ש: כמה מקום תופסת התיקייה?**
ת: תלוי בכמות הספרים והעמודים. בממוצע:
- קובץ סטטוס: ~1KB לכל 10 עמודים
- קובץ תוכן: ~1-5KB לעמוד
- סה"כ: ~100MB ל-1000 עמודים ערוכים

**ש: האם צריך לגבות את התמונות (thumbnails)?**
ת: התמונות נמצאות ב-`public/thumbnails/` ולא ב-`data/`. מומלץ לגבות גם אותן.
