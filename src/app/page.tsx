import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  ArrowRight, 
  Lock, 
  CalendarCheck, 
  Truck, 
  CheckCircle2,
  MapPin
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-amber-200 selection:text-amber-900">
      
      {/* Hero Section - Premium Dark Mode con Halos Rosa/Azul */}
      <section className="relative bg-[#020617] text-white pt-32 pb-40 px-4 overflow-hidden flex flex-col justify-center min-h-[90vh]">
        {/* Efectos de luz difuminada (Gender Reveal Vibe) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-rose-500/20 rounded-full blur-[128px] opacity-70 animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-500/20 rounded-full blur-[128px] opacity-70 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-slate-300 tracking-wide uppercase">
              Montajes Premium en CDMX y Área Metropolitana
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1]">
            El secreto mejor guardado, <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-white to-sky-400">
              hasta el último segundo.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            Nos coordinamos directamente con tu médico en estricta confidencialidad. 
            Tú eliges el montaje, <strong className="text-white font-medium">nosotros orquestamos la magia en tu domicilio</strong> para que tú también te sorprendas.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link 
              href="/paquetes" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
            >
              Ver Catálogo y Precios
              <ArrowRight size={20} />
            </Link>
            <p className="text-sm text-slate-500 sm:hidden">Reserva con solo el 50% de anticipo</p>
          </div>
        </div>
        
        {/* Trust bar overlay */}
        <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-white/5 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 md:gap-16 text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2"><MapPin size={18} className="text-emerald-400"/> Cobertura CDMX y EdoMex</div>
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-amber-400"/> Pagos Protegidos</div>
            <div className="flex items-center gap-2"><Lock size={18} className="text-sky-400"/> 100% Confidencial</div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona - El "Link Secreto" */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            ¿Cómo funciona la magia?
          </h2>
          <p className="text-lg text-slate-600">
            Diseñamos un proceso a prueba de errores para que los futuros papás no tengan que preocuparse por nada, ni siquiera por saber el resultado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Línea conectora (solo en desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 z-0"></div>

          <div className="relative z-10 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center space-y-5 hover:border-amber-400 transition-colors group">
            <div className="w-20 h-20 mx-auto bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-amber-50 group-hover:border-amber-200">
              <CalendarCheck size={36} className="text-slate-800 group-hover:text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">1. Reserva tu Fecha</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Elige tu montaje favorito en nuestro catálogo online y aparta tu día con solo el 50% de anticipo mediante pago seguro.
            </p>
          </div>

          <div className="relative z-10 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 text-center space-y-5 transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              Nuestro Secreto
            </div>
            <div className="w-20 h-20 mx-auto bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock size={36} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">2. El Link Secreto</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Te daremos un enlace único. Tu médico o laboratorio subirá el resultado directamente a nuestro sistema encriptado. <strong className="text-slate-900">Nadie más lo verá.</strong>
            </p>
          </div>

          <div className="relative z-10 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center space-y-5 hover:border-emerald-400 transition-colors group">
            <div className="w-20 h-20 mx-auto bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-emerald-50 group-hover:border-emerald-200">
              <Truck size={36} className="text-slate-800 group-hover:text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">3. La Revelación</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nuestra cuadrilla llega a tu evento, realiza el montaje impecable y prepara todo para que el color estalle en el momento perfecto.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition (Por qué elegirnos) */}
      <section className="bg-slate-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              No vendemos humo, <br />
              <span className="text-amber-400">creamos memorias.</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Sabemos que este es uno de los momentos más importantes de tu vida. Por eso no dejamos nada al azar. Desde la puntualidad hasta la intensidad del color.
            </p>
            <ul className="space-y-4">
              {[
                'Logística y montaje profesional en sitio',
                'Materiales premium (polvo holi no tóxico, extintores seguros)',
                'Coordinación directa y confidencial con tu médico',
                'Limpieza posterior al evento (opcional según paquete)'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 lg:p-12 space-y-8 shadow-2xl">
            <div className="space-y-4">
              <div className="bg-slate-900/50 w-16 h-16 rounded-2xl flex items-center justify-center">
                <Heart size={32} className="text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Fotos que duran toda la vida</h3>
              <p className="text-slate-400">
                El contraste de nuestros colores, la densidad del humo y la estética de nuestros extintores están diseñados específicamente para verse increíbles en cámara.
              </p>
            </div>
            <Link 
              href="/paquetes" 
              className="inline-flex items-center gap-2 text-amber-400 font-bold hover:text-amber-300 transition-colors"
            >
              Ver galería de montajes <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Footer - Cierre de Ventas */}
      <section className="bg-slate-50 py-32 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-[2rem] p-10 md:p-16 text-center shadow-2xl border border-slate-100 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-100 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              ¿Listos para descubrirlo?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Nuestra agenda de fin de semana se llena rápido. Asegura tu montaje hoy mismo y deja la logística en nuestras manos.
            </p>
            <div className="pt-4">
              <Link 
                href="/paquetes" 
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-amber-500 transition-all shadow-xl hover:shadow-amber-600/30 hover:-translate-y-1"
              >
                Elegir mi paquete y reservar
                <ArrowRight size={20} />
              </Link>
              <p className="mt-4 text-sm text-slate-500 flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> Reserva segura. Cancela hasta 7 días antes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}