'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import OtzariaSoftwareHeader from '@/components/OtzariaSoftwareHeader'
import OtzariaSoftwareFooter from '@/components/OtzariaSoftwareFooter'

export default function DocsPage() {
  const [openSections, setOpenSections] = useState(['installation', 'usage'])

  const toggleSection = (section) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const tutorials = [
    {
      href: '/docs/installation',
      icon: 'install_desktop',
      title: 'מדריך הפעלת תוכנת אוצריא',
      description: 'הוראות מפורטות להתקנה, הפעלה והוספת ספרייה - כולל טיפים ואפשרויות מתקדמות'
    },
    {
      href: '/docs/search',
      icon: 'search',
      title: 'מדריך חיפוש באוצריא',
      description: 'למד כיצד לחפש ביעילות - חיפוש מדויק, מקורב, סינון ספרים, והשלמת אותיות'
    },
    {
      href: '/docs/development',
      icon: 'code',
      title: 'מדריך פיתוח - עריכת אוצריא',
      description: 'למד כיצד לערוך ולשפר את תוכנת אוצריא בעצמך - גם ללא ידע מעמיק בתכנות'
    },
    {
      href: '/docs/dicta',
      icon: 'edit',
      title: 'מדריך לטיפול בספרי דיקטה',
      description: 'הדרכה מפורטת ליצירת כותרות וניווט בספרים - כולל כלים אוטומטיים והדגמות מעשיות'
    }
  ]

  return (
    <div className="min-h-screen">
      <OtzariaSoftwareHeader />

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="glass-strong rounded-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-primary-dark mb-4">תוכן עניינים</h3>
                <nav className="space-y-2">
                  <div>
                    <button
                      onClick={() => toggleSection('installation')}
                      className="flex items-center justify-between w-full text-right p-2 hover:bg-surface-variant rounded-lg transition-colors"
                    >
                      <span className="font-medium">התקנה</span>
                      <motion.span
                        animate={{ rotate: openSections.includes('installation') ? 180 : 0 }}
                        className="material-symbols-outlined text-sm"
                      >
                        expand_more
                      </motion.span>
                    </button>
                    {openSections.includes('installation') && (
                      <div className="mr-4 mt-2 space-y-1">
                        <a href="#windows" className="block p-2 text-sm text-on-surface/70 hover:text-primary transition-colors">Windows</a>
                        <a href="#linux" className="block p-2 text-sm text-on-surface/70 hover:text-primary transition-colors">Linux</a>
                        <a href="#android" className="block p-2 text-sm text-on-surface/70 hover:text-primary transition-colors">Android</a>
                        <a href="#ios" className="block p-2 text-sm text-on-surface/70 hover:text-primary transition-colors">iOS</a>
                        <a href="#macos" className="block p-2 text-sm text-on-surface/70 hover:text-primary transition-colors">macOS</a>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => toggleSection('usage')}
                      className="flex items-center justify-between w-full text-right p-2 hover:bg-surface-variant rounded-lg transition-colors"
                    >
                      <span className="font-medium">שימוש בסיסי</span>
                      <motion.span
                        animate={{ rotate: openSections.includes('usage') ? 180 : 0 }}
                        className="material-symbols-outlined text-sm"
                      >
                        expand_more
                      </motion.span>
                    </button>
                    {openSections.includes('usage') && (
                      <div className="mr-4 mt-2 space-y-1">
                        <a href="#library" className="block p-2 text-sm text-on-surface/70 hover:text-primary transition-colors">דפדוף בספרייה</a>
                        <a href="#search" className="block p-2 text-sm text-on-surface/70 hover:text-primary transition-colors">חיפוש</a>
                        <a href="#reading" className="block p-2 text-sm text-on-surface/70 hover:text-primary transition-colors">קריאה</a>
                        <a href="#bookmarks" className="block p-2 text-sm text-on-surface/70 hover:text-primary transition-colors">סימניות</a>
                      </div>
                    )}
                  </div>

                  <a href="#features" className="block p-2 hover:bg-surface-variant rounded-lg transition-colors font-medium">תכונות מתקדמות</a>
                  <a href="#settings" className="block p-2 hover:bg-surface-variant rounded-lg transition-colors font-medium">הגדרות</a>
                  <a href="#tutorials" className="block p-2 hover:bg-surface-variant rounded-lg transition-colors font-medium">מדריכים נוספים</a>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <article className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-xl p-8 mb-8"
              >
                <h1 className="text-4xl font-bold text-primary-dark mb-6" style={{ fontFamily: 'FrankRuehl, serif' }}>
                  מדריך למשתמש
                </h1>

                {/* Installation Section */}
                <section id="installation" className="mb-12">
                  <h2 className="text-3xl font-bold text-primary-dark mb-4">התקנה</h2>
                  <p className="text-lg text-on-surface/80 mb-6">
                    אוצריא זמינה למגוון פלטפורמות. בחר את ההוראות המתאימות למערכת שלך:
                  </p>

                  {/* Windows */}
                  <div id="windows" className="mb-8 p-6 bg-surface-variant rounded-xl">
                    <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">desktop_windows</span>
                      Windows
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-surface rounded-lg">
                        <h4 className="font-bold text-lg mb-2">דרישות מקדימות</h4>
                        <p>ודא ש-Visual C++ Redistributable מותקן במחשב שלך.</p>
                        <p>אם לא, הורד אותו מ<a href="https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">כאן</a>.</p>
                      </div>
                      <div className="p-4 bg-surface rounded-lg">
                        <h4 className="font-bold text-lg mb-2">שלבי ההתקנה</h4>
                        <ol className="list-decimal mr-6 space-y-2">
                          <li>הורד את קובץ ה-.exe מעמוד ה-Releases</li>
                          <li>הספרייה כלולה בקובץ ההתקנה</li>
                          <li>הפעל את הקובץ והמתן להתקנה</li>
                          <li>פתח את התוכנה והתחל ללמוד!</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Linux */}
                  <div id="linux" className="mb-8 p-6 bg-surface-variant rounded-xl">
                    <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">computer</span>
                      Linux
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-surface rounded-lg">
                        <h4 className="font-bold text-lg mb-2">דרישות מקדימות</h4>
                        <p className="mb-2">התקן את החבילות הנדרשות:</p>
                        <pre className="bg-gray-800 text-white p-3 rounded overflow-x-auto text-sm">
                          <code>sudo apt-get install libgtk-3-0 libblkid1 liblzma5</code>
                        </pre>
                      </div>
                      <div className="p-4 bg-surface rounded-lg">
                        <h4 className="font-bold text-lg mb-2">שלבי ההתקנה</h4>
                        <ol className="list-decimal mr-6 space-y-2">
                          <li>הורד את הקובץ המתאים ל-Linux מעמוד ה-Releases</li>
                          <li>חלץ את הקובץ</li>
                          <li>הפעל את Otzaria</li>
                          <li>בהפעלה הראשונה תתבקש להוריד את הספרייה</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Android */}
                  <div id="android" className="mb-8 p-6 bg-surface-variant rounded-xl">
                    <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">phone_android</span>
                      Android
                    </h3>
                    <div className="p-4 bg-surface rounded-lg">
                      <h4 className="font-bold text-lg mb-2">התקנה מ-Google Play</h4>
                      <ol className="list-decimal mr-6 space-y-2">
                        <li>היכנס ל<a href="https://play.google.com/store/apps/details?id=com.mendelg.otzaria" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Play</a></li>
                        <li>לחץ על "התקן"</li>
                        <li>פתח את האפליקציה</li>
                        <li>בהפעלה הראשונה תתבקש להוריד את הספרייה</li>
                      </ol>
                    </div>
                  </div>

                  {/* iOS */}
                  <div id="ios" className="mb-8 p-6 bg-surface-variant rounded-xl">
                    <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">phone_iphone</span>
                      iOS
                    </h3>
                    <div className="p-4 bg-surface rounded-lg">
                      <h4 className="font-bold text-lg mb-2">התקנה מ-App Store</h4>
                      <ol className="list-decimal mr-6 space-y-2">
                        <li>היכנס ל<a href="https://apps.apple.com/us/app/otzaria/id6738098031" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">App Store</a></li>
                        <li>לחץ על "הורד"</li>
                        <li>פתח את האפליקציה</li>
                        <li>בהפעלה הראשונה תתבקש להוריד את הספרייה</li>
                      </ol>
                    </div>
                  </div>

                  {/* macOS */}
                  <div id="macos" className="mb-8 p-6 bg-surface-variant rounded-xl">
                    <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">laptop_mac</span>
                      macOS
                    </h3>
                    <div className="p-4 bg-surface rounded-lg">
                      <h4 className="font-bold text-lg mb-2">שלבי ההתקנה</h4>
                      <ol className="list-decimal mr-6 space-y-2">
                        <li>הורד את הקובץ המתאים ל-macOS מעמוד ה-Releases</li>
                        <li>הפעל את האפליקציה תוך לחיצה על מקש Ctrl</li>
                        <li>בהפעלה הראשונה תתבקש להוריד את הספרייה</li>
                      </ol>
                    </div>
                  </div>
                </section>

                {/* Usage Section */}
                <section id="usage" className="mb-12">
                  <h2 className="text-3xl font-bold text-primary-dark mb-6">שימוש בסיסי</h2>

                  <div id="library" className="mb-8 p-6 bg-surface-variant rounded-xl">
                    <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">library_books</span>
                      דפדוף בספרייה
                    </h3>
                    <p className="mb-4">הספרייה מאורגנת בקטגוריות ברורות:</p>
                    <ul className="list-disc mr-6 space-y-2">
                      <li><strong>תנ"ך</strong> - חמישה חומשי תורה, נביאים וכתובים</li>
                      <li><strong>משנה ותלמוד</strong> - בבלי וירושלמי</li>
                      <li><strong>הלכה</strong> - משנה תורה, שולחן ערוך ועוד</li>
                      <li><strong>מדרש</strong> - מדרשי חז"ל</li>
                      <li><strong>קבלה וחסידות</strong> - ספרי קבלה וחסידות</li>
                    </ul>
                    <div className="mt-4 p-4 bg-orange-50 border-r-4 border-orange-400 rounded">
                      <p className="text-orange-900"><strong>טיפ:</strong> השתמש בשדה החיפוש בראש הספרייה כדי למצוא ספר מסוים במהירות.</p>
                    </div>
                  </div>

                  <div id="search" className="mb-8 p-6 bg-surface-variant rounded-xl">
                    <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">search</span>
                      חיפוש
                    </h3>
                    <p className="mb-4">מנוע החיפוש של אוצריא מאפשר חיפוש מהיר ומדויק:</p>
                    <ul className="list-disc mr-6 space-y-2">
                      <li>חיפוש טקסט חופשי בכל הספרייה</li>
                      <li>סינון לפי קטגוריות ונושאים</li>
                      <li>חיפוש חלקי מילים, ללא קידומות, סיומות, ועוד!</li>
                      <li>תוצאות מהירות עם הדגשת המילים שנמצאו</li>
                    </ul>
                    <div className="mt-4 p-4 bg-orange-50 border-r-4 border-orange-400 rounded">
                      <p className="text-orange-900"><strong>טיפ:</strong> השתמש בקיצור המקשים Ctrl+Q לפתיחת חלון חיפוש חדש</p>
                    </div>
                  </div>

                  <div id="reading" className="mb-8 p-6 bg-surface-variant rounded-xl">
                    <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">menu_book</span>
                      קריאה
                    </h3>
                    <p className="mb-4">חוויית קריאה נוחה ומותאמת אישית:</p>
                    <ul className="list-disc mr-6 space-y-2">
                      <li>התאמת גודל וגופן הטקסט</li>
                      <li>מצב כהה לקריאה נוחה בלילה</li>
                      <li>פתיחת מספר ספרים במקביל</li>
                      <li>העתקה עם כותרות הספר</li>
                    </ul>
                  </div>

                  <div id="bookmarks" className="mb-8 p-6 bg-surface-variant rounded-xl">
                    <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">bookmark</span>
                      סימניות והיסטוריה
                    </h3>
                    <p className="mb-4">שמור את המקומות החשובים לך:</p>
                    <ul className="list-disc mr-6 space-y-2">
                      <li>הוסף סימניות לדפים שאתה חוזר אליהם</li>
                      <li>צפה בהיסטוריית הלימוד שלך</li>
                      <li>חזור במהירות למקומות שביקרת בהם</li>
                    </ul>
                  </div>
                </section>

                {/* Features Section */}
                <section id="features" className="mb-12">
                  <h2 className="text-3xl font-bold text-primary-dark mb-6">תכונות מתקדמות</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: 'שולחנות עבודה', desc: 'ארגן את הספרים שלך בשולחנות עבודה שונים' },
                      { title: 'דף יומי', desc: 'גישה מהירה לדף היומי בגמרא' },
                      { title: 'הערות אישיות', desc: 'הוסף הערות אישיות לטקסטים' },
                      { title: 'גימטריות', desc: 'כלי לחישוב גימטריות בשיטות שונות' },
                      { title: 'גיבוי ושחזור', desc: 'גבה את כל ההגדרות והסימניות שלך' }
                    ].map((feature, i) => (
                      <div key={i} className="p-4 bg-surface-variant rounded-lg">
                        <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                        <p className="text-on-surface/70">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Settings Section */}
                <section id="settings" className="mb-12">
                  <h2 className="text-3xl font-bold text-primary-dark mb-6">הגדרות</h2>
                  <p className="mb-6">התאם את אוצריא לצרכים שלך:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: 'הגדרות עיצוב', items: ['מצב כהה/בהיר', 'בחירת צבע בסיס', 'מסך מלא'] },
                      { title: 'הגדרות קריאה', items: ['גודל וגופן הטקסט', 'הצגת/הסתרת ניקוד וטעמים', 'ריווח בין שורות'] },
                      { title: 'הגדרות ספרייה', items: ['הצגת/הסתרת ספרים חיצוניים', 'סינכרון אוטומטי', 'עדכון אינדקס חיפוש'] },
                      { title: 'קיצורי מקשים', items: ['התאמה אישית של קיצורי דרך', 'ניווט מהיר בין מסכים', 'פתיחה וסגירה של ספרים'] }
                    ].map((setting, i) => (
                      <div key={i} className="p-4 bg-surface-variant rounded-lg">
                        <h4 className="font-bold text-lg mb-3">{setting.title}</h4>
                        <ul className="list-disc mr-6 space-y-1 text-sm">
                          {setting.items.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Tutorials Section */}
                <section id="tutorials" className="mb-12">
                  <h2 className="text-3xl font-bold text-primary-dark mb-6">מדריכים נוספים</h2>
                  <p className="mb-6">מדריכים מפורטים למשתמשים, עורכים ומפתחים:</p>
                  <div className="space-y-4">
                    {tutorials.map((tutorial, i) => (
                      <Link
                        key={i}
                        href={tutorial.href}
                        className="flex items-center gap-4 p-6 bg-surface-variant hover:bg-surface rounded-xl transition-all hover:shadow-lg border-r-4 border-primary group"
                      >
                        <span className="material-symbols-outlined text-5xl text-primary group-hover:scale-110 transition-transform">
                          {tutorial.icon}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-primary-dark mb-2">{tutorial.title}</h4>
                          <p className="text-on-surface/70">{tutorial.description}</p>
                        </div>
                        <span className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold text-sm">
                          היכנס
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Help Section */}
                <section className="p-6 bg-gradient-to-br from-primary-container to-secondary-container rounded-xl border-4 border-primary">
                  <h2 className="text-2xl font-bold text-primary-dark mb-4">זקוק לעזרה נוספת?</h2>
                  <p className="mb-6">אם נתקלת בבעיה או שיש לך שאלה:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { href: 'https://github.com/sivan22/otzaria/issues', icon: 'bug_report', title: 'דווח על באג', desc: 'מצאת בעיה? ספר לנו' },
                      { href: 'https://github.com/sivan22/otzaria/wiki', icon: 'menu_book', title: 'Wiki', desc: 'מדריכים מפורטים נוספים' },
                      { href: 'https://github.com/sivan22/otzaria', icon: 'code', title: 'GitHub', desc: 'קוד המקור והקהילה' }
                    ].map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 p-4 bg-surface hover:bg-surface-variant rounded-lg transition-all text-center"
                      >
                        <span className="material-symbols-outlined text-4xl text-primary">{link.icon}</span>
                        <strong className="text-lg">{link.title}</strong>
                        <p className="text-sm text-on-surface/70">{link.desc}</p>
                      </a>
                    ))}
                  </div>
                </section>
              </motion.div>
            </article>
          </div>
        </div>
      </main>

      <OtzariaSoftwareFooter />
    </div>
  )
}
