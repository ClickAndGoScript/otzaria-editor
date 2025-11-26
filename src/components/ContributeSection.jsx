import Link from 'next/link'

export default function ContributeSection() {
  return (
    <section id="contribute" className="py-20 px-4 bg-gradient-to-b from-background to-surface/30">
      <div className="container mx-auto max-w-6xl">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-on-surface">
            החשיבות של הוספת ספרים חדשים
          </h2>
          <p className="text-xl text-on-surface/70 max-w-3xl mx-auto">
            כל ספר שמתווסף לאוצריא הוא לבנה נוספת במבנה הדיגיטלי של מורשת ישראל
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass p-6 rounded-xl hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl text-primary">lock_open</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-on-surface">נגישות</h3>
            <p className="text-on-surface/70">
              הפיכת ספרים נדירים לזמינים לכל אדם בעולם
            </p>
          </div>

          <div className="glass p-6 rounded-xl hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl text-primary">shield</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-on-surface">שימור</h3>
            <p className="text-on-surface/70">
              הגנה על טקסטים מפני אובדן או נזק פיזי
            </p>
          </div>

          <div className="glass p-6 rounded-xl hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl text-primary">groups</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-on-surface">שיתוף</h3>
            <p className="text-on-surface/70">
              יצירת קהילה של לומדים ועורכים
            </p>
          </div>

          <div className="glass p-6 rounded-xl hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl text-primary">check_circle</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-on-surface">דיוק</h3>
            <p className="text-on-surface/70">
              עריכה משותפת מבטיחה טקסטים מדויקים יותר
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-strong p-8 md:p-12 rounded-2xl text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">
            מוכנים לתרום לפרויקט?
          </h3>
          <p className="text-lg text-on-surface/70 mb-8 max-w-2xl mx-auto">
            ספרים רבים עדיין אינם זמינים בפורמט דיגיטלי נגיש. כל תרומה עוזרת לשמר ולהנגיש את האוצר התורני לדורות הבאים.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/upload" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-lg text-lg font-medium hover:bg-accent transition-all hover:scale-105 shadow-lg w-full sm:w-auto"
            >
              <span className="material-symbols-outlined">add</span>
              <span>הוסף ספר חדש</span>
            </Link>
            <Link 
              href="/library" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-surface text-on-surface rounded-lg text-lg font-medium hover:bg-surface-variant transition-all border border-outline w-full sm:w-auto"
            >
              <span className="material-symbols-outlined">library_books</span>
              <span>עיין בספרייה</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
