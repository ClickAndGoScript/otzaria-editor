# איך להוסיף ספרים לספריית אוצריא

## שלב 1: הוסף את קובץ ה-PDF

העתק את קובץ ה-PDF לתיקייה:
```
public/assets/library/
```

לדוגמה:
```
public/assets/library/בראשית.pdf
```

או בתוך תיקיות:
```
public/assets/library/תנך/תורה/בראשית.pdf
```

## שלב 2: צור קובץ מטא-דאטה

ליד כל PDF, צור קובץ עם אותו שם + `.meta.json`

**דוגמה:** אם יש לך `בראשית.pdf`, צור `בראשית.pdf.meta.json`

### תוכן הקובץ:

```json
{
  "pages": 250,
  "title": "ספר בראשית",
  "description": "ספר בראשית עם פירוש רש\"י"
}
```

**חשוב:** 
- `pages` - מספר העמודים האמיתי ב-PDF (חובה!)
- `title` - שם הספר (אופציונלי)
- `description` - תיאור (אופציונלי)

## שלב 3: רענן את הדפדפן

המערכת תזהה אוטומטית את הספר החדש!

---

## דוגמאות מלאות:

### דוגמה 1: ספר בודד

**קובץ:** `public/assets/library/משנה ברכות.pdf`

**מטא-דאטה:** `public/assets/library/משנה ברכות.pdf.meta.json`
```json
{
  "pages": 180
}
```

### דוגמה 2: ספרים בתיקיות

**קובץ:** `public/assets/library/תלמוד/בבלי/ברכות.pdf`

**מטא-דאטה:** `public/assets/library/תלמוד/בבלי/ברכות.pdf.meta.json`
```json
{
  "pages": 320,
  "title": "מסכת ברכות",
  "description": "תלמוד בבלי מסכת ברכות"
}
```

---

## איך למצוא את מספר העמודים?

1. פתח את ה-PDF בתוכנת קריאה (Adobe, Chrome, וכו')
2. עבור לעמוד האחרון
3. רשום את המספר
4. שים אותו בקובץ המטא-דאטה

---

## אם לא תיצור קובץ מטא-דאטה?

המערכת תעריך את מספר העמודים לפי גודל הקובץ (לא מדויק).

**מומלץ מאוד ליצור קובץ מטא-דאטה לכל PDF!**

---

**בהצלחה! 🎉**
