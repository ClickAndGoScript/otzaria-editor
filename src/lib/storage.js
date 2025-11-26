// ממשק אחיד לאחסון - משתמש ב-Backblaze B2
import * as r2Storage from './r2-storage.js'

// ייצוא מחדש של כל הפונקציות מ-r2-storage
export const saveJSON = r2Storage.saveJSON
export const readJSON = r2Storage.readJSON
export const saveText = r2Storage.saveText
export const readText = r2Storage.readText
export const deleteFile = r2Storage.deleteFile
export const listFiles = r2Storage.listFiles
export const fileExists = r2Storage.fileExists
export const saveImage = r2Storage.saveImage
export const getImageUrl = r2Storage.getImageUrl
