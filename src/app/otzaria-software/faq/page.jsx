'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import OtzariaSoftwareHeader from '@/components/OtzariaSoftwareHeader'
import OtzariaSoftwareFooter from '@/components/OtzariaSoftwareFooter'

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [openQuestion, setOpenQuestion] = useState(null)

  const categories = [
    { id: 'all', label: 'הכל' },
    { id: 'general', label: 'כללי' },
    { id: 'installation', label: 'התקנה' },
    { id: 'usage', label: 'שימוש' },
    { id: 'technical', label: 'טכני' }
  ]

  const faqs = [
    {
      id: 1,
      category: 'general',
      question: 'מהי תוכנת אוצריא ומה היא מציעה?',
      answer: 'אוצריא היא תוכנה חינמית ופתוחה המספקת גישה למאגר תורני רחב עם ממשק מודרני ומהיר. התוכנה מיועדת לשימוש במחשב אישי או במכשיר נייד, ומאפשרת לימוד תורה בקלות ובנוחות בכל מקום.'
    },
    {
      id: 2,
      category: 'general',
      question: 'כמה ספרים כלולים במאגר?',
      answer: 'המאגר כולל כ-7,200 ספרים תורניים, הכוללים תנ"ך ומפרשיו, משנה ומפרשיה, תלמודים בבלי וירושלמי עם ראשונים ואחרונים, ספרי הלכה כולל טושו"ע וכל נושאי הכלים, ספרי מחשבה ומוסר וקבלה.'
    },
    {
      id: 3,
      category: 'installation',
      question: 'איך מתקינים את התוכנה?',
      answer: 'ההתקנה פשוטה ומהירה. הורד את הקובץ המתאים למערכת ההפעלה שלך מדף ההורדות, הפעל את הקובץ ועקוב אחר ההוראות על המסך. בהפעלה הראשונה תתבקש להוריד את מאגר הספרים.'
    },
    {
      id: 4,
      category: 'usage',
      question: 'האם אפשר להוסיף ספרים משלי?',
      answer: 'כן! אוצריא תומכת בהוספת ספרים בפורמטים TXT, DOCX ו-PDF. פשוט העתק את הקבצים לתיקיית הספרייה ותוכל להשתמש בהם מיד.'
    },
    {
      id: 5,
      category: 'technical',
      question: 'מהן דרישות המערכת להפעלת התוכנה?',
      answer: 'התוכנה דורשת מערכת הפעלה מודרנית: Windows 10 ומעלה, macOS 10.14 ומעלה, או הפצת Linux עדכנית. למכשירים ניידים: Android 5.0 ומעלה או iOS 12 ומעלה. מומלץ לפחות 4GB זיכרון RAM ו-5GB שטח פנוי.'
    },
    {
      id: 6,
      category: 'general',
      question: 'האם התוכנה באמת חינמית לחלוטין?',
      answer: 'כן! התוכנה חינמית לחלוטין ותישאר כזו לעד. הקוד גם פתוח ונגיש לכולם. אנחנו מאמינים שגישה לתורה צריכה להיות זמינה לכולם ללא עלות.'
    }
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen">
      <OtzariaSoftwareHeader />

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 glass-strong rounded-2xl p-12 border-4 border-primary"
          >
            <span className="material-symbols-outlined text-7xl text-primary mb-4 block">
              help_center
            </span>
            <h1 className="text-5xl font-bold text-primary-dark mb-4" style={{ fontFamily: 'FrankRuehl, serif' }}>
              שאלות נפוצות
            </h1>
            <p className="text-xl text-on-surface/70">
              מצא תשובות לשאלות הנפוצות ביותר על אוצריא
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-8"
          >
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="חפש שאלה..."
              className="w-full pr-14 pl-4 py-4 border-2 border-surface-variant rounded-xl focus:border-primary focus:outline-none transition-colors bg-surface text-lg"
            />
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 flex-wrap justify-center mb-8"
          >
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-primary text-on-primary shadow-lg'
                    : 'bg-surface text-on-surface hover:bg-surface-variant border-2 border-surface-variant'
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 mb-12"
          >
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="glass rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenQuestion(openQuestion === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-right hover:bg-surface-variant/50 transition-colors"
                >
                  <span className="text-lg font-bold text-on-surface flex-1">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: openQuestion === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="material-symbols-outlined text-primary text-2xl flex-shrink-0 mr-4"
                  >
                    expand_more
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openQuestion === faq.id ? 'auto' : 0,
                    opacity: openQuestion === faq.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-on-surface/80 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 glass rounded-xl">
                <span className="material-symbols-outlined text-6xl text-on-surface/30 mb-4 block">
                  search_off
                </span>
                <p className="text-lg text-on-surface/70">לא נמצאו תוצאות</p>
              </div>
            )}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center glass-strong rounded-2xl p-12 border-4 border-primary"
          >
            <h2 className="text-3xl font-bold text-primary-dark mb-4">
              לא מצאת את מה שחיפשת?
            </h2>
            <p className="text-xl text-on-surface/70 mb-6">
              צור איתנו קשר ונשמח לעזור לך
            </p>
            <a
              href="mailto:otzaria.1@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-lg hover:bg-accent transition-all shadow-lg hover:shadow-xl font-bold text-lg"
            >
              <span className="material-symbols-outlined">mail</span>
              <span>שלח לנו מייל</span>
            </a>
          </motion.div>
        </div>
      </main>

      <OtzariaSoftwareFooter />
    </div>
  )
}
