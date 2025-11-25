import Link from 'next/link'

export default function ContributeSection() {
  return (
    <section id="contribute" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="glass-strong p-8 md:p-12 rounded-2xl">
            <h2 className="text-4xl font-bold mb-6 text-on-surface text-center">
              החשיבות של הוספת ספרים חדשים
            </h2>
            
            <div className="space-y-6 text-lg text-on-surface/80">
              <p className="leading-relaxed">
                כל ספר שמתווסף לאוצריא הוא לבנה נוספת במבנה הדיגיטלי של מורשת ישראל. 
                ספרים רבים עדיין אינם זמינים בפורמט דיגיטלי נגיש, וכל תרומה עוזרת לשמר 
                ולהנגיש את האוצר התורני לדורות הבאים.
              </p>
              
              <div className="bg-primary-container p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  למה זה חשוב?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-3xl text-primary">lock_open</span>
                    <span><strong>נגישות:</strong> הפיכת ספרים נדירים לזמינים לכל אדם בעולם</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-3xl text-primary">shield</span>
                    <span><strong>שימור:</strong> הגנה על טקסטים מפני אובדן או נזק פיזי</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-3xl text-primary">groups</span>
                    <span><strong>שיתוף:</strong> יצירת קהילה של לומדים ועורכים</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-3xl text-primary">check_circle</span>
                    <span><strong>דיוק:</strong> עריכה משותפת מבטיחה טקסטים מדויקים יותר</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-center mt-8">
                <Link href="/upload" className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-lg text-lg font-medium hover:bg-accent transition-all hover:scale-105 shadow-lg mx-auto w-fit">
                  <span className="material-symbols-outlined">add</span>
                  <span>הוסף ספר חדש</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
