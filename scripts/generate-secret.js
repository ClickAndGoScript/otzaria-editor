#!/usr/bin/env node

/**
 * סקריפט ליצירת NEXTAUTH_SECRET
 * הרצה: node scripts/generate-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 יצירת NEXTAUTH_SECRET\n');
console.log('═'.repeat(60));

// יצירת מפתח אקראי
const secret = crypto.randomBytes(32).toString('base64');

console.log('\n✅ המפתח שלך:\n');
console.log(`NEXTAUTH_SECRET=${secret}`);
console.log('\n' + '═'.repeat(60));
console.log('\n📋 הוראות:');
console.log('1. העתק את השורה למעלה');
console.log('2. הדבק אותה בקובץ .env.local');
console.log('3. אם אתה פורס לענן (Vercel/Netlify), הוסף גם שם במשתני סביבה');
console.log('\n⚠️  אל תשתף את המפתח הזה עם אף אחד!\n');
