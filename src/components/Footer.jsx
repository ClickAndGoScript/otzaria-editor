import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface-variant py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="לוגו אוצריא" width={32} height={32} />
              <span className="text-lg font-bold text-primary">ספריית אוצריא</span>
            </div>
            <p className="text-on-surface/70">
              פלטפורמה משותפת לעריכה ושיתוף של ספרי קודש
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-on-surface">קישורים מהירים</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-on-surface/70 hover:text-primary transition-colors">
                  אודות
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-on-surface/70 hover:text-primary transition-colors">
                  יכולות
                </Link>
              </li>
              <li>
                <Link href="#contribute" className="text-on-surface/70 hover:text-primary transition-colors">
                  תרומת ספרים
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-on-surface">צור קשר</h3>
            <p className="text-on-surface/70">
              יש לך שאלות או הצעות? נשמח לשמוע ממך
            </p>
          </div>
        </div>
        
        <div className="border-t border-surface pt-8 text-center text-on-surface/60">
          <p>© {new Date().getFullYear()} ספריית אוצריא. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  )
}
