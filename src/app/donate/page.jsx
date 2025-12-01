'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import OtzariaSoftwareHeader from '@/components/OtzariaSoftwareHeader'
import OtzariaSoftwareFooter from '@/components/OtzariaSoftwareFooter'

export default function DonatePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    message: '',
    memorial: false,
    memorialText: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // כאן תוכל להוסיף לוגיקה לשליחת הטופס
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const benefits = [
    {
      icon: 'lock_open',
      title: 'נגישות',
      description: 'הפיכת ספרים נדירים לזמינים לכל אדם בעולם'
    },
    {
      icon: 'shield',
      title: 'שימור',
      description: 'הגנה על טקסטים מפני אובדן או נזק פיזי'
    },
    {
      icon: 'groups',
      title: 'שיתוף',
      description: 'יצירת קהילה של לומדים ועורכים'
    },
    {
      icon: 'check_circle',
      title: 'דיוק',
      description: 'עריכה משותפת מבטיחה טקסטים מדויקים יותר'
    }
  ]

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
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="material-symbols-outlined text-7xl text-primary mb-4 block"
            >
              volunteer_activism
            </motion.span>
            <h1 className="text-5xl font-bold text-primary-dark mb-4" style={{ fontFamily: 'FrankRuehl, serif' }}>
              תרמו לפרויקט אוצריא
            </h1>
            <p className="text-xl text-on-surface/70">
              עזרו לנו להמשיך לפתח ולשפר את המאגר התורני הגדול בעולם
            </p>
          </motion.div>

          {/* Quick Donate Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-2xl p-8 mb-8"
          >
            <h2 className="text-3xl font-bold text-primary-dark mb-6">תרומה מהירה</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <a
                href="https://www.matara.pro/nedarimplus/online/?S=ejco"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center gap-4 p-6 bg-blue-50 border-4 border-blue-400 rounded-xl hover:bg-blue-100 transition-all hover:scale-[1.02]"
              >
                <span className="material-symbols-outlined text-5xl text-blue-600">payments</span>
                <div className="text-right flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-1">נדרים פלוס</h3>
                  <p className="text-sm text-blue-700">תרומה מאובטחת דרך נדרים פלוס</p>
                </div>
                <span className="material-symbols-outlined text-blue-600">arrow_back</span>
              </a>
            </div>
          </motion.div>

          {/* Donate Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-strong rounded-2xl p-8 mb-8"
          >
            <h2 className="text-3xl font-bold text-primary-dark mb-4">טופס תרומה</h2>
            <p className="text-on-surface/70 mb-6">
              מלאו את הפרטים ונחזור אליכם בהקדם
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-on-surface font-medium mb-2">
                    שם מלא <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-surface-variant rounded-lg focus:border-primary focus:outline-none transition-colors bg-surface"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-medium mb-2">
                    אימייל <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-surface-variant rounded-lg focus:border-primary focus:outline-none transition-colors bg-surface"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-on-surface font-medium mb-2">
                    טלפון
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-surface-variant rounded-lg focus:border-primary focus:outline-none transition-colors bg-surface"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-medium mb-2">
                    סכום תרומה
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="₪"
                    className="w-full px-4 py-3 border-2 border-surface-variant rounded-lg focus:border-primary focus:outline-none transition-colors bg-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-medium mb-2">
                  הודעה
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-surface-variant rounded-lg focus:border-primary focus:outline-none transition-colors bg-surface resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="memorial"
                    checked={formData.memorial}
                    onChange={handleChange}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                  <span className="text-on-surface">רוצה להנציח את התרומה לע"נ או לזכות</span>
                </label>

                {formData.memorial && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <input
                      type="text"
                      name="memorialText"
                      value={formData.memorialText}
                      onChange={handleChange}
                      placeholder="טקסט ההנצחה"
                      className="w-full px-4 py-3 border-2 border-surface-variant rounded-lg focus:border-primary focus:outline-none transition-colors bg-surface"
                    />
                  </motion.div>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-lg hover:bg-accent transition-all shadow-lg hover:shadow-xl font-bold text-lg"
              >
                <span className="material-symbols-outlined">send</span>
                <span>שלח טופס</span>
              </button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-green-100 text-green-800 rounded-lg"
                >
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                  <span className="font-medium">הטופס נשלח בהצלחה! נחזור אליך בהקדם.</span>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Why Donate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-strong rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-primary-dark mb-6">למה לתרום?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-surface-variant rounded-xl hover:shadow-lg transition-shadow"
                >
                  <span className="material-symbols-outlined text-5xl text-primary mb-3 block">
                    {benefit.icon}
                  </span>
                  <h3 className="text-xl font-bold text-on-surface mb-2">{benefit.title}</h3>
                  <p className="text-on-surface/70">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <OtzariaSoftwareFooter />
    </div>
  )
}
