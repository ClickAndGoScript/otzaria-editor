#!/usr/bin/env node

/**
 * סקריפט לבדיקת מוכנות לפריסה
 * הרצה: node scripts/check-deployment-ready.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 בודק מוכנות לפריסה...\n');
console.log('═'.repeat(60));

let allGood = true;
const warnings = [];
const errors = [];

// בדיקה 1: קיום קובץ .env.local
console.log('\n1️⃣  בודק קובץ .env.local...');
if (!fs.existsSync('.env.local')) {
  errors.push('❌ קובץ .env.local לא קיים!');
  allGood = false;
} else {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  // בדיקת NEXTAUTH_SECRET
  if (!envContent.includes('NEXTAUTH_SECRET=')) {
    errors.push('❌ NEXTAUTH_SECRET לא מוגדר ב-.env.local');
    allGood = false;
  } else if (envContent.includes('your-secret-key-change-this-in-production')) {
    errors.push('❌ NEXTAUTH_SECRET עדיין מכיל את הערך ברירת המחדל!');
    errors.push('   הרץ: npm run generate-secret');
    allGood = false;
  } else {
    console.log('   ✅ NEXTAUTH_SECRET מוגדר');
  }
  
  // בדיקת NEXTAUTH_URL
  if (!envContent.includes('NEXTAUTH_URL=')) {
    warnings.push('⚠️  NEXTAUTH_URL לא מוגדר');
  } else {
    console.log('   ✅ NEXTAUTH_URL מוגדר');
  }
  
  // בדיקת DATABASE_URL
  if (!envContent.includes('DATABASE_URL=')) {
    errors.push('❌ DATABASE_URL לא מוגדר');
    allGood = false;
  } else if (envContent.includes('file:./dev.db')) {
    warnings.push('⚠️  DATABASE_URL משתמש ב-SQLite (file:./dev.db)');
    warnings.push('   זה לא יעבוד ב-Vercel/Netlify!');
    warnings.push('   שקול MongoDB Atlas או Vercel Postgres');
  } else {
    console.log('   ✅ DATABASE_URL מוגדר');
  }
}

// בדיקה 2: package.json
console.log('\n2️⃣  בודק package.json...');
if (!fs.existsSync('package.json')) {
  errors.push('❌ package.json לא קיים!');
  allGood = false;
} else {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!pkg.scripts || !pkg.scripts.build) {
    errors.push('❌ סקריפט build לא מוגדר ב-package.json');
    allGood = false;
  } else {
    console.log('   ✅ סקריפט build קיים');
  }
  
  if (!pkg.scripts || !pkg.scripts.start) {
    errors.push('❌ סקריפט start לא מוגדר ב-package.json');
    allGood = false;
  } else {
    console.log('   ✅ סקריפט start קיים');
  }
}

// בדיקה 3: .gitignore
console.log('\n3️⃣  בודק .gitignore...');
if (!fs.existsSync('.gitignore')) {
  warnings.push('⚠️  .gitignore לא קיים');
} else {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  
  if (!gitignoreContent.includes('.env')) {
    errors.push('❌ .env לא מוגדר ב-.gitignore!');
    errors.push('   זה מסוכן - קבצי סביבה עלולים להיחשף!');
    allGood = false;
  } else {
    console.log('   ✅ קבצי .env מוגנים');
  }
  
  if (!gitignoreContent.includes('node_modules')) {
    warnings.push('⚠️  node_modules לא ב-.gitignore');
  } else {
    console.log('   ✅ node_modules מוגן');
  }
}

// בדיקה 4: next.config.js
console.log('\n4️⃣  בודק next.config.js...');
if (!fs.existsSync('next.config.js')) {
  warnings.push('⚠️  next.config.js לא קיים (אופציונלי)');
} else {
  console.log('   ✅ next.config.js קיים');
}

// סיכום
console.log('\n' + '═'.repeat(60));
console.log('\n📊 סיכום:\n');

if (errors.length > 0) {
  console.log('🚨 שגיאות קריטיות:\n');
  errors.forEach(err => console.log('   ' + err));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  אזהרות:\n');
  warnings.forEach(warn => console.log('   ' + warn));
  console.log('');
}

if (allGood && warnings.length === 0) {
  console.log('✅ הכל נראה טוב! האתר מוכן לפריסה.\n');
  console.log('📝 צעדים הבאים:');
  console.log('   1. הרץ: npm run build');
  console.log('   2. בדוק שאין שגיאות');
  console.log('   3. פרוס עם: vercel או העלה ל-Netlify\n');
} else if (allGood) {
  console.log('✅ אין שגיאות קריטיות, אבל יש כמה אזהרות.\n');
  console.log('📝 מומלץ לטפל באזהרות לפני הפריסה.\n');
} else {
  console.log('❌ יש שגיאות שצריך לתקן לפני הפריסה!\n');
  console.log('📖 קרא את DEPLOYMENT_CHECKLIST.md למידע נוסף.\n');
  process.exit(1);
}

console.log('═'.repeat(60) + '\n');
