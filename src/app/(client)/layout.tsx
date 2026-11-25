import { ReactNode } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar Transparente / Premium */}
      <nav className="absolute top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white tracking-widest">
            REVELACIÓN<span className="text-amber-500">.MX</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/paquetes" className="text-sm font-medium text-slate-200 hover:text-amber-500 transition-colors">
              Paquetes
            </Link>
            <Link href="/admin" className="text-sm font-medium text-slate-200 hover:text-amber-500 transition-colors">
              Acceso Privado
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido Dinámico */}
      <main className="flex-1">
        {children}
      </main>

      {/* Botón Flotante de WhatsApp (Bot Evolution/Groq) */}
      <a 
        href="https://wa.me/525549636386?text=Hola,%20me%20interesa%20un%20paquete%20de%20revelación" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-emerald-400 hover:scale-110 transition-all z-50"
      >
        <MessageCircle size={28} />
      </a>

      {/* Footer Minimalista */}
      <footer className="bg-slate-950 text-slate-400 py-8 text-center text-sm">
        <p>© 2026 Revelación MX. Operando en Ciudad de México y Área Metropolitana.</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="/legal" className="hover:text-white">Términos y Condiciones</Link>
          <Link href="/legal" className="hover:text-white">Aviso de Privacidad</Link>
        </div>
      </footer>
    </div>
  );
}