import Link from 'next/link';
import { Sparkles, CalendarCheck, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Hero Section con Video de Fondo */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Placeholder para tu video hero en Cloudinary */}
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="https://res.cloudinary.com/tu-nube/video/upload/q_auto,f_auto/v1/hero-revelacion" type="video/mp4" />
        </video>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 text-amber-400 font-semibold tracking-wider text-sm mb-6 backdrop-blur-md border border-amber-500/30">
            EL EVENTO MÁS IMPORTANTE DE TU VIDA
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            La Sorpresa Perfecta, <br className="hidden md:block"/>Sin Estrés.
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-10 font-medium drop-shadow-md">
            Montajes de pirotecnia fría, humo denso y explosiones de color a domicilio en CDMX. Nosotros nos encargamos de todo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/paquetes" 
              className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(217,119,6,0.4)]"
            >
              Ver Paquetes y Precios
            </Link>
          </div>
        </div>
      </section>

      {/* Propuesta de Valor (El Flujo del Guardián) */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">¿Cómo funciona la magia?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Nuestro sistema patentado garantiza que la sorpresa sea 100% real hasta el momento de la explosión.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <CalendarCheck size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Reserva tu Fecha</h3>
              <p className="text-slate-600">Elige tu paquete, selecciona la fecha y aparta con el 50% (Aceptamos Meses Sin Intereses).</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Enlace Confidencial</h3>
              <p className="text-slate-600">Te daremos un link secreto para que tu doctor suba el ultrasonido directo a nuestro sistema. Cero spoilers.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <Sparkles size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. El Gran Día</h3>
              <p className="text-slate-600">Nuestra cuadrilla llega, monta la pirotecnia y configura el color secreto. Tú solo dedícate a disfrutar.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}