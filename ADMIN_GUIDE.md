# מדריך פאנל הניהול

## 🔒 אבטחה

**האתר כעת מוגן לחלוטין!**

- כל הדפים דורשים התחברות (מלבד דף הבית והרשמה)
- דף הניהול זמין **רק למנהלים**
- 3 שכבות אבטחה: Middleware, Server-Side, API
- אי אפשר לעקוף את ההגנה

## גישה לפאנל הניהול

פאנל הניהול זמין רק למשתמשים עם הרשאות מנהל (role: 'admin').

### כניסה לפאנל
1. התחבר למערכת עם משתמש מנהל
2. בדשבורד, לחץ על "פאנל ניהול"
3. או גש ישירות ל: `/admin`

**הגנה:** משתמש רגיל שינסה לגשת יועבר אוטומטית לדשבורד.

## תכונות הפאנל

### 1. ניהול משתמשים
- **צפייה**: רשימה מלאה של כל המשתמשים במערכת
- **עריכה**: שינוי שם משתמש ותפקיד (משתמש/מנהל)
- **מחיקה**: הסרת משתמשים מהמערכת (לא ניתן למחוק את עצמך)
- **סטטיסטיקות**: נקודות, עמודים שהושלמו, תאריך הצטרפות

### 2. ניהול ספרים
- **צפייה**: רשימת כל הספרים במערכת
- **מחיקה**: הסרת ספרים (כולל כל התמונות והנתונים)
- **סטטיסטיקות**: מספר עמודים, אחוז השלמה

### 3. סטטיסטיקות כלליות
- סה"כ משתמשים, ספרים, עמודים ונקודות
- אחוז השלמת עמודים במערכת
- ממוצע נקודות למשתמש
- טבלת משתמשים מובילים

## הרשאות API

כל ה-API endpoints של הניהול מוגנים ודורשים:
1. משתמש מחובר (session)
2. תפקיד מנהל (role: 'admin')

### Endpoints זמינים:

#### מחיקת משתמש
```
DELETE /api/admin/users/delete
Body: { userId: string }
```

#### עדכון משתמש
```
PUT /api/admin/users/update
Body: { userId: string, updates: { name?, role? } }
```

#### מחיקת ספר
```
DELETE /api/admin/books/delete
Body: { bookPath: string }
```

## הפיכת משתמש למנהל

לשינוי משתמש קיים למנהל, ערוך את הקובץ `data/users.json`:

```json
{
  "id": "...",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin",  // שנה מ-"user" ל-"admin"
  "createdAt": "..."
}
```

## אבטחה

- כל הפעולות מתועדות בקונסול
- לא ניתן למחוק את עצמך כמנהל
- מחיקת ספר מסירה את כל הקבצים הקשורים
- מחיקת משתמש היא פעולה בלתי הפיכה

## טיפים

1. **גיבוי**: גבה את תיקיית `data/` לפני מחיקות גדולות
2. **בדיקה**: בדוק את הסטטיסטיקות לפני מחיקת משתמשים
3. **תקשורת**: הודע למשתמשים לפני מחיקת חשבונם
