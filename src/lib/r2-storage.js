import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { logger } from './logger.js'

// יצירת Backblaze B2 Client
const r2Client = new S3Client({
  region: 'us-east-005',
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
})

const BUCKET_NAME = process.env.B2_BUCKET_NAME || 'otzaria'
const R2_PREFIX = 'dev/'

// שמירת קובץ JSON
export async function saveJSON(path, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    const key = R2_PREFIX + path
    
    await r2Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: jsonString,
      ContentType: 'application/json',
    }))
    
    logger.log(`✅ Saved JSON to R2: ${key}`)
    
    // גיבוי לקבצי pages
    if (path.includes('data/pages/')) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const backupKey = key.replace('.json', `_backup_${timestamp}.json`)
        
        await r2Client.send(new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: backupKey,
          Body: jsonString,
          ContentType: 'application/json',
        }))
        
        logger.log(`✅ Backup saved: ${backupKey}`)
      } catch (backupError) {
        logger.warn('⚠️  Failed to save backup:', backupError)
      }
    }
    
    return { url: `https://f005.backblazeb2.com/file/${BUCKET_NAME}/${key}` }
  } catch (error) {
    logger.error('❌ Error saving JSON to R2:', error)
    throw error
  }
}

// קריאת קובץ JSON
export async function readJSON(path) {
  try {
    const key = R2_PREFIX + path
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    
    const response = await r2Client.send(command)
    const bodyString = await response.Body.transformToString()
    const data = JSON.parse(bodyString)
    
    logger.log(`✅ Loaded JSON from R2: ${key}`)
    return data
  } catch (error) {
    // אם הקובץ לא נמצא, נסה גיבוי
    if (error.name === 'NoSuchKey' && path.includes('data/pages/')) {
      logger.warn(`⚠️  Main file not found: ${path}, searching for backup...`)
      
      try {
        const backupPrefix = R2_PREFIX + path.replace('.json', '_backup_')
        const listCommand = new ListObjectsV2Command({
          Bucket: BUCKET_NAME,
          Prefix: backupPrefix,
        })
        
        const listResponse = await r2Client.send(listCommand)
        
        if (listResponse.Contents && listResponse.Contents.length > 0) {
          // מיין לפי תאריך (הכי חדש קודם)
          const sortedBackups = listResponse.Contents.sort((a, b) => 
            new Date(b.LastModified) - new Date(a.LastModified)
          )
          
          const latestBackup = sortedBackups[0]
          logger.log(`📦 Found ${sortedBackups.length} backups, using latest: ${latestBackup.Key}`)
          
          const getCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: latestBackup.Key,
          })
          
          const backupResponse = await r2Client.send(getCommand)
          const backupString = await backupResponse.Body.transformToString()
          const data = JSON.parse(backupString)
          
          // שחזר את הקובץ הראשי
          await saveJSON(path, data)
          return data
        }
      } catch (backupError) {
        logger.error('❌ Error loading backup:', backupError)
      }
    }
    
    logger.warn(`❌ No file or backup found for: ${path}`)
    return null
  }
}

// שמירת קובץ טקסט
export async function saveText(path, content) {
  try {
    const key = R2_PREFIX + path
    
    await r2Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: content,
      ContentType: 'text/plain; charset=utf-8',
    }))
    
    logger.log(`✅ Saved text to R2: ${key}`)
    return { url: `https://f005.backblazeb2.com/file/${BUCKET_NAME}/${key}` }
  } catch (error) {
    logger.error('Error saving text to R2:', error)
    throw error
  }
}

// קריאת קובץ טקסט
export async function readText(path) {
  try {
    const key = R2_PREFIX + path
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    
    const response = await r2Client.send(command)
    const text = await response.Body.transformToString()
    
    return text
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return null
    }
    logger.error('Error reading text from R2:', error)
    return null
  }
}

// מחיקת קובץ
export async function deleteFile(key) {
  try {
    await r2Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }))
    
    logger.log(`✅ Deleted from R2: ${key}`)
  } catch (error) {
    logger.error('Error deleting file from R2:', error)
  }
}

// רשימת קבצים
export async function listFiles(prefix) {
  try {
    const fullPrefix = R2_PREFIX + prefix
    logger.log('🔍 Listing files with prefix:', fullPrefix)
    
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: fullPrefix,
    })
    
    const response = await r2Client.send(command)
    
    const blobs = (response.Contents || []).map(item => ({
      pathname: item.Key,
      url: `https://f005.backblazeb2.com/file/${BUCKET_NAME}/${item.Key}`,
      size: item.Size,
      uploadedAt: item.LastModified,
    }))
    
    logger.log('📦 Found files:', blobs.length)
    return blobs
  } catch (error) {
    logger.error('Error listing files from R2:', error)
    return []
  }
}

// בדיקה אם קובץ קיים
export async function fileExists(path) {
  try {
    const key = R2_PREFIX + path
    
    await r2Client.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }))
    
    return true
  } catch (error) {
    return false
  }
}

// שמירת תמונה
export async function saveImage(path, imageBuffer, contentType = 'image/jpeg') {
  try {
    const key = R2_PREFIX + path
    
    await r2Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
    }))
    
    logger.log(`✅ Saved image to R2: ${key}`)
    return { url: `https://f005.backblazeb2.com/file/${BUCKET_NAME}/${key}` }
  } catch (error) {
    logger.error('Error saving image to R2:', error)
    throw error
  }
}

// קריאת URL של תמונה (Signed URL לבאקט פרטי)
export async function getImageUrl(path) {
  try {
    const key = R2_PREFIX + path
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    
    // יצירת Signed URL שתקף ל-7 ימים
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 604800 })
    return signedUrl
  } catch (error) {
    logger.error('Error getting image URL from R2:', error)
    return null
  }
}

// פונקציה ליצירת Signed URL לכל קובץ
export async function getSignedFileUrl(path, expiresIn = 604800) {
  try {
    const key = R2_PREFIX + path
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn })
    return signedUrl
  } catch (error) {
    logger.error('Error creating signed URL:', error)
    return null
  }
}
