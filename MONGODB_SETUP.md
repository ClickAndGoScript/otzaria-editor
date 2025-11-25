# הגדרת MongoDB Atlas (חינמי)

## שלב 1: הרשמה
1. לך ל: https://www.mongodb.com/cloud/atlas/register
2. הירשם עם Google/GitHub או אימייל
3. בחר **Free** (M0)

## שלב 2: יצירת Cluster
1. בחר **Create a deployment**
2. בחר **M0 Free** (512MB חינם)
3. בחר **Provider**: AWS
4. בחר **Region**: קרוב אליך (Europe - Frankfurt)
5. שם ל-Cluster: `otzaria-cluster`
6. לחץ **Create Deployment**

## שלב 3: יצירת משתמש
1. תראה מסך "Security Quickstart"
2. **Username**: `otzaria-user`
3. **Password**: צור סיסמה חזקה (שמור אותה!)
4. לחץ **Create Database User**

## שלב 4: הגדרת גישה
1. במסך "Where would you like to connect from?"
2. בחר **My Local Environment**
3. **IP Address**: הקלד `0.0.0.0/0` (גישה מכל מקום)
4. **Description**: `Allow all`
5. לחץ **Add Entry**
6. לחץ **Finish and Close**

## שלב 5: קבלת Connection String
1. לחץ על **Connect** (ליד שם ה-Cluster)
2. בחר **Drivers**
3. בחר **Node.js** וגרסה **6.8 or later**
4. העתק את ה-**Connection String**:
   ```
   mongodb+srv://otzaria-user:<password>@otzaria-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## שלב 6: עדכון משתני סביבה ב-Vercel

1. לך ל: https://vercel.com/dashboard
2. בחר את הפרויקט **otzariaeditor**
3. **Settings** → **Environment Variables**
4. הוסף משתנה חדש:
   - **Name**: `DATABASE_URL`
   - **Value**: ה-Connection String (החלף `<password>` בסיסמה שיצרת!)
   - **Environments**: בחר את כל 3 (Production, Preview, Development)
5. לחץ **Save**

## שלב 7: הוסף עוד משתני סביבה

הוסף גם:

1. **NEXTAUTH_URL**
   - Value: `https://otzariaeditor.vercel.app`
   - Environments: Production

2. **NEXTAUTH_SECRET**
   - Value: `uXtB7d2N+lJDKvsENu2y8sXsmfrfa1qH2XsIiQN8X9k`
   - Environments: כל 3

## שלב 8: פריסה מחדש

הרץ: `deploy-vercel.bat` ובחר **3** (Production)

---

## ✅ סיימת!

האתר שלך יהיה חי עם מסד נתונים עובד ב:
**https://otzariaeditor.vercel.app**

---

## דוגמה ל-Connection String מלא:
```
mongodb+srv://otzaria-user:MyPassword123@otzaria-cluster.abc123.mongodb.net/otzaria?retryWrites=true&w=majority
```

**שים לב:**
- החלף `<password>` בסיסמה האמיתית
- אם הסיסמה מכילה תווים מיוחדים (@, :, /, וכו'), צריך לעשות URL encoding
