#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
שרת Flask מקומי להמרת PDF לתמונות והעלאה לגיטהאב
רץ על localhost:5000

תכונות:
- המרת PDF לתמונות JPG (PyMuPDF)
- העלאה אוטומטית ל-GitHub Releases (עם requests)
- תמיכה במספר קבצי PDF לספר אחד
- מעקב אחר התקדמות בזמן אמת
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import json
import tempfile
import shutil
from pathlib import Path
import threading
import time
import hashlib
import requests

# כבה אימות SSL
requests.packages.urllib3.disable_warnings()

# ייבוא PyMuPDF
try:
    import fitz
except ImportError:
    print("❌ שגיאה: לא נמצאה ספריית PyMuPDF")
    print("התקן: pip install PyMuPDF")
    sys.exit(1)

# ייבוא dotenv
try:
    from dotenv import load_dotenv
    load_dotenv('.env.local')
except ImportError:
    print("⚠️  Warning: python-dotenv not installed")

app = Flask(__name__)
CORS(app)

# משתני סביבה
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
GITHUB_OWNER = os.getenv('GITHUB_OWNER')
GITHUB_REPO = os.getenv('GITHUB_REPO')
RELEASE_TAG = 'thumbnails-v2'

# מאגר למעקב אחר משימות
jobs = {}

def generate_book_id(book_name):
    """יוצר ID ייחודי מהשם העברי"""
    hash_obj = hashlib.md5(book_name.encode('utf-8'))
    return f"book_{hash_obj.hexdigest()[:8]}"

def convert_pdfs_to_images(pdf_paths, output_dir, job_id, zoom=2.0, quality=85):
    """ממיר מספר קבצי PDF לתמונות עם מספור רציף"""
    try:
        jobs[job_id]['status'] = 'converting'
        jobs[job_id]['message'] = 'סופר עמודים...'
        
        # ספור סה"כ עמודים מכל הקבצים
        total_pages = 0
        for pdf_path in pdf_paths:
            doc = fitz.open(pdf_path)
            total_pages += len(doc)
            doc.close()
        
        jobs[job_id]['total_pages'] = total_pages
        jobs[job_id]['message'] = f'נמצאו {total_pages} עמודים ב-{len(pdf_paths)} קבצים'
        
        os.makedirs(output_dir, exist_ok=True)
        
        page_number = 1  # מספור רציף
        
        for pdf_path in pdf_paths:
            doc = fitz.open(pdf_path)
            
            for page_idx in range(len(doc)):
                page = doc[page_idx]
                mat = fitz.Matrix(zoom, zoom)
                pix = page.get_pixmap(matrix=mat)
                
                output_path = os.path.join(output_dir, f"page-{page_number}.jpg")
                pix.save(output_path, "jpeg", jpg_quality=quality)
                
                jobs[job_id]['converted_pages'] = page_number
                jobs[job_id]['message'] = f'ממיר עמוד {page_number}/{total_pages}'
                
                page_number += 1
            
            doc.close()
        
        jobs[job_id]['status'] = 'converted'
        jobs[job_id]['message'] = f'המרה הושלמה - {total_pages} עמודים'
        return True
        
    except Exception as e:
        jobs[job_id]['status'] = 'error'
        jobs[job_id]['error'] = str(e)
        return False


def upload_to_github_requests(output_dir, book_id, book_name, job_id):
    """מעלה תמונות לגיטהאב באמצעות requests (בלי SSL verification)"""
    try:
        jobs[job_id]['status'] = 'uploading'
        jobs[job_id]['message'] = 'מתחבר לגיטהאב...'
        
        headers = {
            'Authorization': f'token {GITHUB_TOKEN}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        # מצא או צור release
        jobs[job_id]['message'] = 'מחפש release...'
        
        # נסה למצוא release קיים
        releases_url = f'https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/releases'
        resp = requests.get(releases_url, headers=headers, verify=False)
        
        release_id = None
        upload_url = None
        
        if resp.status_code == 200:
            releases = resp.json()
            for rel in releases:
                if rel['tag_name'] == RELEASE_TAG:
                    release_id = rel['id']
                    upload_url = rel['upload_url'].replace('{?name,label}', '')
                    jobs[job_id]['message'] = f'נמצא release: {RELEASE_TAG}'
                    break
        
        # אם לא נמצא, צור חדש
        if not release_id:
            jobs[job_id]['message'] = f'יוצר release חדש: {RELEASE_TAG}'
            create_data = {
                'tag_name': RELEASE_TAG,
                'name': 'Thumbnails Storage v2',
                'body': 'Storage for book thumbnails',
                'draft': False,
                'prerelease': False
            }
            resp = requests.post(releases_url, headers=headers, json=create_data, verify=False)
            if resp.status_code in [200, 201]:
                rel = resp.json()
                release_id = rel['id']
                upload_url = rel['upload_url'].replace('{?name,label}', '')
            else:
                raise Exception(f'Failed to create release: {resp.text}')
        
        # קבל רשימת assets קיימים
        assets_url = f'https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/releases/{release_id}/assets'
        resp = requests.get(assets_url, headers=headers, verify=False)
        existing_assets = set()
        if resp.status_code == 200:
            for asset in resp.json():
                existing_assets.add(asset['name'])
        
        # העלה תמונות
        image_files = sorted([f for f in os.listdir(output_dir) if f.endswith('.jpg')])
        total_images = len(image_files)
        
        jobs[job_id]['total_images'] = total_images
        jobs[job_id]['uploaded_images'] = 0
        
        for i, filename in enumerate(image_files, start=1):
            asset_name = f"{book_id}_{filename}"
            
            # דלג אם כבר קיים
            if asset_name in existing_assets:
                jobs[job_id]['message'] = f'מדלג על {filename} (כבר קיים)'
                jobs[job_id]['uploaded_images'] = i
                continue
            
            file_path = os.path.join(output_dir, filename)
            jobs[job_id]['message'] = f'מעלה {filename} ({i}/{total_images})'
            
            # העלה את הקובץ
            with open(file_path, 'rb') as f:
                upload_headers = {
                    'Authorization': f'token {GITHUB_TOKEN}',
                    'Content-Type': 'image/jpeg'
                }
                upload_resp = requests.post(
                    f'{upload_url}?name={asset_name}',
                    headers=upload_headers,
                    data=f.read(),
                    verify=False
                )
                
                if upload_resp.status_code not in [200, 201]:
                    print(f'Warning: Failed to upload {asset_name}: {upload_resp.status_code}')
            
            jobs[job_id]['uploaded_images'] = i
            time.sleep(0.3)  # המתנה קצרה
        
        jobs[job_id]['status'] = 'uploaded'
        jobs[job_id]['message'] = f'העלאה הושלמה - {total_images} תמונות'
        return True
        
    except Exception as e:
        jobs[job_id]['status'] = 'error'
        jobs[job_id]['error'] = f'שגיאה בהעלאה: {str(e)}'
        return False

def save_mapping(book_id, book_name, total_pages, job_id):
    """שומר מיפוי לקובץ מקומי"""
    try:
        jobs[job_id]['status'] = 'saving'
        jobs[job_id]['message'] = 'שומר מיפוי...'
        
        # שמור מיפוי מקומי
        mapping_file = 'data/book-mapping-local.json'
        os.makedirs('data', exist_ok=True)
        
        mapping = {}
        if os.path.exists(mapping_file):
            with open(mapping_file, 'r', encoding='utf-8') as f:
                mapping = json.load(f)
        
        mapping[book_id] = {
            'name': book_name,
            'totalPages': total_pages,
            'createdAt': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        with open(mapping_file, 'w', encoding='utf-8') as f:
            json.dump(mapping, f, ensure_ascii=False, indent=2)
        
        jobs[job_id]['status'] = 'completed'
        jobs[job_id]['message'] = 'התהליך הושלם בהצלחה!'
        jobs[job_id]['book_id'] = book_id
        jobs[job_id]['total_pages'] = total_pages
        return True
        
    except Exception as e:
        jobs[job_id]['status'] = 'error'
        jobs[job_id]['error'] = f'שגיאה בשמירה: {str(e)}'
        return False


def process_pdfs(pdf_paths, book_name, job_id):
    """מעבד מספר קבצי PDF - המרה, העלאה ושמירה"""
    temp_dir = None
    try:
        temp_dir = tempfile.mkdtemp()
        
        # המר את כל ה-PDFs לתמונות
        success = convert_pdfs_to_images(pdf_paths, temp_dir, job_id)
        if not success:
            return
        
        # צור ID לספר
        book_id = generate_book_id(book_name)
        jobs[job_id]['book_id'] = book_id
        
        # העלה לגיטהאב
        success = upload_to_github_requests(temp_dir, book_id, book_name, job_id)
        if not success:
            return
        
        # שמור מיפוי
        total_pages = jobs[job_id].get('total_pages', 0)
        save_mapping(book_id, book_name, total_pages, job_id)
        
    except Exception as e:
        jobs[job_id]['status'] = 'error'
        jobs[job_id]['error'] = str(e)
    finally:
        # נקה תיקייה זמנית
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        # נקה קבצי PDF זמניים
        for pdf_path in pdf_paths:
            if os.path.exists(pdf_path):
                os.remove(pdf_path)

@app.route('/health', methods=['GET'])
def health():
    """בדיקת בריאות השרת"""
    return jsonify({
        'status': 'ok',
        'message': 'Server is running',
        'github_configured': bool(GITHUB_TOKEN and GITHUB_OWNER and GITHUB_REPO)
    })

@app.route('/convert', methods=['POST'])
def convert():
    """מקבל PDF (או מספר PDFs) ומתחיל תהליך המרה"""
    try:
        # בדוק אם יש קבצים
        pdf_files = request.files.getlist('pdf')
        if not pdf_files or len(pdf_files) == 0:
            # נסה גם בשם יחיד
            if 'pdf' in request.files:
                pdf_files = [request.files['pdf']]
            else:
                return jsonify({'success': False, 'error': 'חסר קובץ PDF'}), 400
        
        book_name = request.form.get('bookName')
        if not book_name:
            return jsonify({'success': False, 'error': 'חסר שם ספר'}), 400
        
        # שמור את כל ה-PDFs זמנית
        temp_pdf_paths = []
        for i, pdf_file in enumerate(pdf_files):
            if pdf_file.filename == '':
                continue
            temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            pdf_file.save(temp_pdf.name)
            temp_pdf.close()
            temp_pdf_paths.append(temp_pdf.name)
        
        if len(temp_pdf_paths) == 0:
            return jsonify({'success': False, 'error': 'לא נבחרו קבצים'}), 400
        
        # צור job ID
        job_id = hashlib.md5(f"{book_name}{time.time()}".encode()).hexdigest()
        
        # אתחל job
        jobs[job_id] = {
            'status': 'pending',
            'book_name': book_name,
            'pdf_count': len(temp_pdf_paths),
            'message': f'ממתין להתחלה... ({len(temp_pdf_paths)} קבצים)',
            'created_at': time.time()
        }
        
        # התחל תהליך ברקע
        thread = threading.Thread(
            target=process_pdfs,
            args=(temp_pdf_paths, book_name, job_id)
        )
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'success': True,
            'job_id': job_id,
            'message': f'התהליך התחיל ({len(temp_pdf_paths)} קבצים)'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/status/<job_id>', methods=['GET'])
def status(job_id):
    """מחזיר סטטוס של משימה"""
    if job_id not in jobs:
        return jsonify({'success': False, 'error': 'משימה לא נמצאה'}), 404
    
    return jsonify({
        'success': True,
        'job': jobs[job_id]
    })

@app.route('/jobs', methods=['GET'])
def list_jobs():
    """מחזיר רשימת כל המשימות"""
    return jsonify({
        'success': True,
        'jobs': jobs
    })

if __name__ == '__main__':
    print('=' * 60)
    print('🚀 שרת המרת PDF מקומי')
    print('=' * 60)
    print(f'📍 כתובת: http://localhost:5000')
    print(f'🔑 GitHub: {GITHUB_OWNER}/{GITHUB_REPO}')
    print(f'📦 תומך במספר קבצי PDF לספר אחד')
    print('=' * 60)
    print()
    
    app.run(host='0.0.0.0', port=5000, debug=True)
