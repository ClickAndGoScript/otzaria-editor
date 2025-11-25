# הגדרת Vercel Postgres (הכי קל!)

## למה Vercel Postgres?
- מתחבר אוטומטית לפרויקט שלך
- חינמי עד 256MB
- אפס הגדרות - עובד מיד
- מהיר מאוד

## שלבים:

### 1. צור Database ב-Vercel
1. לך ל: https://vercel.com/dashboard
2. בחר את הפרויקט שלך
3. לחץ על **Storage** (בתפריט העליון)
4. לחץ **Create Database**
5. בחר **Postgres**
6. שם: `otzaria-db`
7. Region: בחר קרוב אליך (Europe - Frankfurt)
8. לחץ **Create**

### 2. חבר לפרויקט
1. אחרי שנוצר ה-Database
2. לחץ **Connect Project**
3. בחר את הפרויקט שלך
4. לחץ **Connect**

### 3. Vercel יוסיף אוטומטית את משתני הסביבה:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- וכו'

### 4. עדכן את הקוד שלך להשתמש ב-Postgres

אם אתה משתמש ב-Prisma, עדכן את `DATABASE_URL`:
```
DATABASE_URL=${POSTGRES_PRISMA_URL}
```

### 5. הוסף משתני סביבה נוספים
ב-Settings → Environment Variables, ודא שיש:
- `NEXTAUTH_URL` = `https://your-project.vercel.app`
- `NEXTAUTH_SECRET` = המפתח שלך

### 6. Redeploy
```bash
vercel --prod
```

## ✅ זהו!

הדאטאבייס שלך עכשיו עובד ונשמר לצמיתות.

---

## בדיקה
1. לך לאתר שלך
2. נסה להירשם / להתחבר
3. הנתונים אמורים להישמר!

