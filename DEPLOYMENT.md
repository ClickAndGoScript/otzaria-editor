# 🚀 מדריך פריסה - ספריית אוצריא

## התחלה מהירה (5 דקות)

### שלב 1: צור מפתח סודי
לחץ פעמיים על: `generate-secret.bat`

העתק את השורה שמתחילה ב-`NEXTAUTH_SECRET=`

### שלב 2: עדכן .env.local
פתח את הקובץ `.env.local` והדבק את המפתח במקום `your-secret-key-change-this-in-production`

### שלב 3: בדוק ובנה
לחץ פעמיים על: `full-check.bat`

אם הכל עבר בהצלחה - אתה מוכן לפרוס!

---

## מסד נתונים (חובה לייצור!)

הקובץ `file:./dev.db` לא יעבוד ב-Vercel. בחר אחת מהאפשרויות:

### MongoDB Atlas (מומלץ - חינמי)
1. https://www.mongodb.com/cloud/atlas → צור חשבון
2. Create Cluster (M0 Free)
3. Database Access → Add User
4. Network Access → Add IP → Allow Access from Anywhere (0.0.0.0/0)
5. Connect → Connect your application → Copy connection string
6. החלף `<password>` בסיסמה שלך
7. עדכן ב-.env.local:
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/otzaria
```

### Vercel Postgres (קל מאוד)
1. אחרי שתפרוס ל-Vercel
2. בדף הפרויקט: Storage → Create Database → Postgres
3. זהו! מתחבר אוטומטית

---

## פריסה ל-Vercel

### התקנה ראשונית (פעם אחת):
```bash
npm i -g vercel
vercel login
```

### פריסה:
```bash
vercel
```

### הגדר משתני סביבה:
1. לך ל: https://vercel.com/dashboard
2. בחר את הפרויקט → Settings → Environment Variables
3. הוסף:
   - `NEXTAUTH_URL` = `https://your-project.vercel.app`
   - `NEXTAUTH_SECRET` = המפתח שיצרת
   - `DATABASE_URL` = כתובת מסד הנתונים

### פרוס מחדש:
```bash
vercel --prod
```

---

## קבצי BAT זמינים

| קובץ | תיאור |
|------|-------|
| `menu.bat` | תפריט אינטראקטיבי עם כל האפשרויות |
| `start.bat` | הפעלת שרת פיתוח |
| `generate-secret.bat` | יצירת NEXTAUTH_SECRET |
| `check-deploy.bat` | בדיקת מוכנות לפריסה |
| `full-check.bat` | בדיקה + בנייה |
| `build.bat` | בניית גרסת ייצור |

---

## פתרון בעיות נפוצות

### "Invalid NEXTAUTH_SECRET"
- ודא שהמפתח מוגדר ב-Vercel Environment Variables
- פרוס מחדש: `vercel --prod`

### "Database connection failed"
- ב-MongoDB Atlas: Network Access → Add `0.0.0.0/0`
- בדוק את ה-Connection String
- ודא שהסיסמה נכונה

### "Build failed"
- הרץ `full-check.bat` מקומית לראות את השגיאה
- תקן את השגיאות ונסה שוב

---

## רשימת בדיקה

- [ ] הרצתי `generate-secret.bat`
- [ ] עדכנתי את NEXTAUTH_SECRET ב-.env.local
- [ ] הגדרתי מסד נתונים (לא file:./dev.db)
- [ ] הרצתי `full-check.bat` בהצלחה
- [ ] פרסתי ל-Vercel
- [ ] הוספתי משתני סביבה ב-Vercel
- [ ] פרסתי מחדש עם `vercel --prod`
- [ ] בדקתי שהאתר עובד

---

## עזרה נוספת

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
