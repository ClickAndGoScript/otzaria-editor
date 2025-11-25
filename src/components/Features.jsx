export default function Features() {
  const features = [
    {
      icon: 'auto_stories',
      title: 'מאגר עצום',
      description: 'אלפי ספרי קודש זמינים לעריכה ולקריאה'
    },
    {
      icon: 'edit_note',
      title: 'עריכה משותפת',
      description: 'עבדו יחד עם עורכים אחרים בזמן אמת'
    },
    {
      icon: 'search',
      title: 'חיפוש מתקדם',
      description: 'מצאו כל פסוק, מאמר או מושג בקלות'
    },
    {
      icon: 'cloud_done',
      title: 'גיבוי אוטומטי',
      description: 'כל שינוי נשמר ומתועד באופן אוטומטי'
    },
    {
      icon: 'verified',
      title: 'דיוק מקסימלי',
      description: 'מערכת בקרת איכות מתקדמת לטקסטים מדויקים'
    },
    {
      icon: 'public',
      title: 'נגיש לכולם',
      description: 'גישה חופשית ממכשיר כלשהו, בכל מקום'
    }
  ]

  return (
    <section id="features" className="py-20 px-4 bg-surface">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-on-surface">
          למה לבחור באוצריא?
        </h2>
        <p className="text-center text-on-surface/70 mb-12 max-w-2xl mx-auto">
          פלטפורמה מתקדמת המשלבת טכנולוגיה חדישה עם כבוד למסורת
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass p-6 rounded-xl hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <span className="material-symbols-outlined text-6xl text-primary mb-4 block">
                {feature.icon}
              </span>
              <h3 className="text-xl font-bold mb-2 text-on-surface">
                {feature.title}
              </h3>
              <p className="text-on-surface/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
