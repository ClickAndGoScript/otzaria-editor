#!/usr/bin/env python3
"""
סקריפט להמרת PDF לתמונות JPG
מיועד לספריית אוצריא

שימוש:
    python convert_pdf_to_images.py "שם_הספר.pdf"
    python convert_pdf_to_images.py --all  # להמיר את כל הספרים
"""

import os
import sys
import json
from pathlib import Path

try:
    import fitz  # PyMuPDF
    USE_PYMUPDF = True
except ImportError:
    USE_PYMUPDF = False
    try:
        from pdf2image import convert_from_path
        from PIL import Image
    except ImportError:
        print("❌ שגיאה: לא נמצאה ספריית המרה")
        print("התקן אחת מהאפשרויות הבאות:")
        print("  pip install PyMuPDF Pillow  (מומלץ)")
        print("  pip install pdf2image Pillow  (דורש Poppler)")
        sys.exit(1)

# נתיבים
LIBRARY_PATH = Path(__file__).parent.parent / "public" / "assets" / "library"
THUMBNAILS_PATH = Path(__file__).parent.parent / "public" / "thumbnails"

def create_meta_file(pdf_path, num_pages):
    """
    יוצר קובץ meta.json עם מספר העמודים
    """
    meta_path = str(pdf_path) + '.meta.json'
    meta_data = {
        "pages": num_pages
    }
    
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(meta_data, f, ensure_ascii=False, indent=2)
    
    print(f"   📄 נוצר קובץ meta: {num_pages} עמודים")

def convert_pdf_to_images_pymupdf(pdf_path, output_dir, zoom=2.0, quality=85):
    """
    ממיר PDF לתמונות JPG באמצעות PyMuPDF
    
    Args:
        pdf_path: נתיב לקובץ PDF
        output_dir: תיקיית פלט
        zoom: זום (2.0 = 150 DPI בערך)
        quality: איכות JPG (ברירת מחדל: 85)
    """
    print(f"📖 ממיר: {pdf_path.name}")
    print(f"   🔧 משתמש ב-PyMuPDF")
    
    # צור תיקיית פלט
    output_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # פתח PDF
        print(f"   טוען PDF...")
        doc = fitz.open(pdf_path)
        total_pages = len(doc)
        print(f"   נמצאו {total_pages} עמודים")
        
        # צור קובץ meta
        create_meta_file(pdf_path, total_pages)
        
        # המר כל עמוד
        for page_num in range(total_pages):
            page = doc[page_num]
            
            # צור מטריצת זום
            mat = fitz.Matrix(zoom, zoom)
            
            # רנדר לתמונה
            pix = page.get_pixmap(matrix=mat)
            
            # שמור כ-JPG
            output_path = output_dir / f"page-{page_num + 1}.jpg"
            pix.save(output_path, "jpeg", jpg_quality=quality)
            
            # הצג התקדמות
            percent = int(((page_num + 1) / total_pages) * 100)
            print(f"   [{percent:3d}%] עמוד {page_num + 1}/{total_pages}", end='\r')
        
        doc.close()
        
        print(f"\n✅ הושלם! נוצרו {total_pages} תמונות")
        print(f"   📁 נשמר ב: {output_dir}")
        
        # חשב גודל
        total_size = sum(f.stat().st_size for f in output_dir.glob("*.jpg"))
        size_mb = total_size / (1024 * 1024)
        print(f"   💾 גודל כולל: {size_mb:.1f} MB")
        
        return True
        
    except Exception as e:
        print(f"\n❌ שגיאה: {e}")
        return False

def convert_pdf_to_images_pdf2image(pdf_path, output_dir, dpi=150, quality=85):
    """
    ממיר PDF לתמונות JPG באמצעות pdf2image
    
    Args:
        pdf_path: נתיב לקובץ PDF
        output_dir: תיקיית פלט
        dpi: רזולוציה (ברירת מחדל: 150)
        quality: איכות JPG (ברירת מחדל: 85)
    """
    print(f"📖 ממיר: {pdf_path.name}")
    print(f"   🔧 משתמש ב-pdf2image")
    
    # צור תיקיית פלט
    output_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # המר PDF לתמונות
        print(f"   טוען PDF...")
        images = convert_from_path(
            pdf_path,
            dpi=dpi,
            fmt='jpeg'
        )
        
        total_pages = len(images)
        print(f"   נמצאו {total_pages} עמודים")
        
        # צור קובץ meta
        create_meta_file(pdf_path, total_pages)
        
        # שמור כל תמונה
        for i, image in enumerate(images, start=1):
            output_path = output_dir / f"page-{i}.jpg"
            
            # שמור עם דחיסה
            image.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            # הצג התקדמות
            percent = int((i / total_pages) * 100)
            print(f"   [{percent:3d}%] עמוד {i}/{total_pages}", end='\r')
        
        print(f"\n✅ הושלם! נוצרו {total_pages} תמונות")
        print(f"   📁 נשמר ב: {output_dir}")
        
        # חשב גודל
        total_size = sum(f.stat().st_size for f in output_dir.glob("*.jpg"))
        size_mb = total_size / (1024 * 1024)
        print(f"   💾 גודל כולל: {size_mb:.1f} MB")
        
        return True
        
    except Exception as e:
        print(f"\n❌ שגיאה: {e}")
        return False

def convert_pdf_to_images(pdf_path, output_dir, quality=85):
    """
    ממיר PDF לתמונות JPG - בוחר אוטומטית את השיטה הזמינה
    """
    if USE_PYMUPDF:
        return convert_pdf_to_images_pymupdf(pdf_path, output_dir, zoom=2.0, quality=quality)
    else:
        return convert_pdf_to_images_pdf2image(pdf_path, output_dir, dpi=150, quality=quality)

def find_all_pdfs(library_path):
    """מוצא את כל קבצי ה-PDF בספרייה"""
    pdfs = []
    for root, dirs, files in os.walk(library_path):
        for file in files:
            if file.endswith('.pdf'):
                pdf_path = Path(root) / file
                relative_path = pdf_path.relative_to(library_path)
                pdfs.append((pdf_path, relative_path))
    return pdfs

def convert_single_book(book_name):
    """ממיר ספר בודד"""
    # חפש את הספר
    pdf_path = None
    relative_path = None
    
    for root, dirs, files in os.walk(LIBRARY_PATH):
        for file in files:
            if file == book_name or file == f"{book_name}.pdf":
                pdf_path = Path(root) / file
                relative_path = pdf_path.relative_to(LIBRARY_PATH)
                break
        if pdf_path:
            break
    
    if not pdf_path or not pdf_path.exists():
        print(f"❌ הספר '{book_name}' לא נמצא")
        print(f"   חפש ב: {LIBRARY_PATH}")
        return False
    
    # צור תיקיית פלט
    book_name_without_ext = relative_path.stem
    output_dir = THUMBNAILS_PATH / relative_path.parent / book_name_without_ext
    
    # המר
    return convert_pdf_to_images(pdf_path, output_dir)

def convert_all_books():
    """ממיר את כל הספרים בספרייה"""
    print("🔍 מחפש קבצי PDF...")
    pdfs = find_all_pdfs(LIBRARY_PATH)
    
    if not pdfs:
        print("❌ לא נמצאו קבצי PDF")
        return
    
    print(f"📚 נמצאו {len(pdfs)} ספרים\n")
    
    success_count = 0
    for i, (pdf_path, relative_path) in enumerate(pdfs, start=1):
        print(f"\n[{i}/{len(pdfs)}] {relative_path}")
        print("-" * 60)
        
        # צור תיקיית פלט
        book_name_without_ext = relative_path.stem
        output_dir = THUMBNAILS_PATH / relative_path.parent / book_name_without_ext
        
        # בדוק אם כבר קיימות תמונות
        if output_dir.exists():
            existing_images = len(list(output_dir.glob("page-*.jpg")))
            if existing_images > 0:
                print(f"⚠️  כבר קיימות {existing_images} תמונות")
                response = input("   להמיר מחדש? (y/n): ").lower()
                if response != 'y':
                    print("   דילוג...")
                    continue
        
        # המר
        if convert_pdf_to_images(pdf_path, output_dir):
            success_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ הושלם! הומרו {success_count}/{len(pdfs)} ספרים")

def main():
    """פונקציה ראשית"""
    print("=" * 60)
    print("📸 המרת PDF לתמונות - ספריית אוצריא")
    print("=" * 60)
    print()
    
    # בדוק ארגומנטים
    if len(sys.argv) < 2:
        print("שימוש:")
        print(f"  python {sys.argv[0]} <שם_ספר.pdf>")
        print(f"  python {sys.argv[0]} --all")
        print()
        print("דוגמאות:")
        print(f"  python {sys.argv[0]} 'בראשית.pdf'")
        print(f"  python {sys.argv[0]} --all")
        sys.exit(1)
    
    # בדוק אם התיקיות קיימות
    if not LIBRARY_PATH.exists():
        print(f"❌ תיקיית הספרייה לא נמצאה: {LIBRARY_PATH}")
        sys.exit(1)
    
    # המר
    if sys.argv[1] == "--all":
        convert_all_books()
    else:
        book_name = sys.argv[1]
        convert_single_book(book_name)

if __name__ == "__main__":
    main()
