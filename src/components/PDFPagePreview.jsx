'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// הגדר את ה-worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function PDFPagePreview({ pdfUrl, pageNumber, className = '' }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  return (
    <div className={`relative ${className}`}>
      <Document
        file={pdfUrl}
        onLoadSuccess={() => setLoading(false)}
        onLoadError={(error) => {
          console.error('Error loading PDF:', error)
          setError('שגיאה בטעינת PDF')
          setLoading(false)
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">
              progress_activity
            </span>
          </div>
        }
      >
        <Page
          pageNumber={pageNumber}
          width={200}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="pdf-page-preview"
        />
      </Document>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <span className="material-symbols-outlined text-4xl text-on-surface/30">
            description
          </span>
        </div>
      )}
    </div>
  )
}
