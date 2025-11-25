import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-primary-container via-background to-secondary-container opacity-50"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <Image 
              src="/logo.png" 
              alt="לוגו אוצריא" 
              width={120} 
              height={120}
              className="drop-shadow-lg"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-on-background">
            ספריית אוצריא
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-on-surface/80 leading-relaxed">
            פלטפורמה משותפת לעריכה ושיתוף של ספרי קודש
          </p>
          
          <p className="text-lg mb-12 text-on-surface/70 max-w-2xl mx-auto">
            הצטרפו למהפכה הדיגיטלית של ספרות התורה. ערכו, שתפו והוסיפו ספרים חדשים 
            למאגר הגדול ביותר של טקסטים תורניים מדויקים ונגישים לכולם.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/library" className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-lg text-lg font-medium hover:bg-accent transition-all hover:scale-105 shadow-lg">
              <span className="material-symbols-outlined">edit</span>
              <span>התחל לערוך עכשיו</span>
            </Link>
            <Link href="/library" className="flex items-center justify-center gap-2 px-8 py-4 glass border-2 border-primary text-primary rounded-lg text-lg font-medium hover:bg-primary-container transition-all">
              <span className="material-symbols-outlined">library_books</span>
              <span>עיין בספרייה</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
