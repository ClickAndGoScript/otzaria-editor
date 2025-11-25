# יומן שינויים - מעבר לשמירה בשרת

## גרסה 2.0.0 - 25 נובמבר 2025

### 🎉 שינויים מרכזיים

#### מעבר מ-localStorage לשרת
המערכת עברה משמירת נתונים בדפדפן (localStorage) לשמירה מרכזית בשרת.

**לפני:**
- כל משתמש ראה רק את הנתונים שלו
- נתונים נמחקו בניקוי דפדפן
- אין סנכרון בין משתמשים

**אחרי:**
- כל המשתמשים רואים את אותו מצב
- נתונים נשמרים בשרת באופן קבוע
- סנכרון אוטומטי בין משתמשים

### 📁 מבנה קבצים חדש

#### `data/pages/[ספר].json`
סטטוס של כל עמוד בכל ספר:
- מי תפס את העמוד
- מתי נתפס
- האם הושלם

#### `data/content/[ספר]_page_[מספר].txt`
תוכן עמודים ערוכים:
- טקסט שהוקלד
- תמיכה בטור אחד או שני טורים

### 🔧 שינויים טכניים

#### קבצים ששונו:
- `src/app/book/[...path]/page.jsx` - הוסרה תלות ב-localStorage
- `src/app/edit/[bookPath]/[pageNumber]/page.jsx` - שמירה אוטומטית לשרת
- `src/app/api/book/[...path]/route.js` - API לניהול סטטוס עמודים
- `src/app/api/page-content/route.js` - API לשמירת תוכן

#### קבצים חדשים:
- `scripts/migrate-localstorage.js` - סקריפט להעברת נתונים ישנים
- `scripts/data-management.js` - כלי ניהול נתונים
- `data/README.md` - תיעוד מבנה הנתונים
- `MIGRATION_GUIDE.md` - מדריך מעבר למשתמשים

### 🚀 פיצ'רים חדשים

#### 1. סנכרון בזמן אמת
כשמשתמש תופס עמוד, כל המשתמשים רואים את זה מיד.

#### 2. שמירה אוטומטית
טקסט נשמר אוטומטית כל 2 שניות בזמן הקלדה.

#### 3. מניעת התנגשויות
אם עמוד תפוס, משתמש אחר לא יכול לתפוס אותו.

#### 4. כלי ניהול
```bash
npm run data:stats    # סטטיסטיקות
npm run data:list     # רשימת ספרים
npm run data:export   # ייצוא דוח
```

### 📊 API Endpoints חדשים

#### תפיסת עמוד
```
POST /api/book/[bookPath]
{
  "action": "claim",
  "pageNumber": 5,
  "userId": "123",
  "userName": "יוסי"
}
```

#### סימון כהושלם
```
POST /api/book/[bookPath]
{
  "action": "complete",
  "pageNumber": 5,
  "userId": "123"
}
```

#### שמירת תוכן
```
POST /api/page-content
{
  "bookPath": "...",
  "pageNumber": 5,
  "content": "...",
  "twoColumns": false
}
```

### 🔒 אבטחה

- סיסמאות מוצפנות ב-bcrypt
- אימות משתמש בכל פעולה
- בדיקת הרשאות לפני עדכון

### 📦 גיבוי

מומלץ לגבות את `data/` באופן קבוע:
```bash
# Windows
xcopy /E /I data data_backup_%date%

# Linux/Mac
cp -r data data_backup_$(date +%Y%m%d)
```

### 🔄 מעבר מגרסה קודמת

אם יש לך נתונים ב-localStorage:

1. פתח את האתר
2. פתח Console (F12)
3. הרץ את `scripts/migrate-localstorage.js`
4. עקוב אחרי ההוראות

### ⚠️ Breaking Changes

- **localStorage לא בשימוש יותר** - כל הנתונים בשרת
- **נדרש חיבור לאינטרנט** - לא ניתן לעבוד אופליין
- **API חדש** - אם יש אינטגרציות חיצוניות, צריך לעדכן

### 🐛 תיקוני באגים

- תוקן: עמודים "תקועים" בסטטוס in-progress
- תוקן: אובדן נתונים בניקוי דפדפן
- תוקן: חוסר סנכרון בין משתמשים

### 📝 תיעוד

- `MIGRATION_GUIDE.md` - מדריך מעבר מפורט
- `data/README.md` - תיעוד מבנה נתונים
- `scripts/` - סקריפטים עם הערות מפורטות

### 🎯 ביצועים

- שמירה אוטומטית עם debounce (2 שניות)
- טעינה מהירה יותר של סטטוס עמודים
- קבצי JSON קטנים ומהירים

### 🔮 תכנון עתידי

- [ ] WebSocket לעדכונים בזמן אמת
- [ ] היסטוריית שינויים לכל עמוד
- [ ] ייצוא לפורמטים שונים (PDF, DOCX)
- [ ] גיבוי אוטומטי לענן
- [ ] ממשק ניהול מתקדם

### 🙏 תודות

תודה לכל המשתמשים שדיווחו על בעיות עם localStorage!

---

## גרסה 1.0.0 - נובמבר 2025

### גרסה ראשונית
- מערכת ניהול ספרים
- עריכת עמודים
- שמירה ב-localStorage
- אימות משתמשים
