import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
        <div className="relative max-w-5xl mx-auto text-center space-y-8 mt-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            El secreto mejor guardado,<br className="hidden md:block" /> hasta el último segundo.
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Nos coordinamos directamente con tu médico para que tú también te sorprendas. 
            Elige la experiencia, nosotros armamos la magia en tu domicilio.
          </p>
          <div className="pt-8">
            <Link 
              href="/paquetes" 
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 hover:scale-105 transition-all shadow-xl"
            >
              <Sparkles size={24} />
              Ver Experiencias
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4 text-center md:text-left bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
              <ShieldCheck size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">100% Sorpresa</h3>
            <p className="text-slate-600">
              Te damos un link secreto para que tu médico suba el resultado confidencialmente. Nadie lo sabrá antes de tiempo.
            </p>
          </div>
          
          <div className="space-y-4 text-center md:text-left bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
              <Sparkles size={32} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Montaje Premium</h3>
            <p className="text-slate-600">
              Llegamos a tu domicilio en CDMX, montamos todo el escenario impecable y nos retiramos sin dejar rastro.
            </p>
          </div>

          <div className="space-y-4 text-center md:text-left bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="bg-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
              <Heart size={32} className="text-rose-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Inolvidable</h3>
            <p className="text-slate-600">
              Materiales de la más alta calidad y un diseño espectacular para unas fotos que durarán toda la vida.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Footer */}
      <section className="bg-slate-100 py-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-200">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">¿Listos para descubrirlo?</h2>
          <p className="text-lg text-slate-600 mb-8">Reserva tu fecha hoy mismo con solo el 50% de anticipo.</p>
          <Link 
            href="/paquetes" 
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors hover:scale-105 transform"
          >
            Elegir mi paquete <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}