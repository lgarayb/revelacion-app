import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Map, 
  CalendarDays, 
  PackageSearch, 
  Bot, 
  LogOut 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans">
      
      {/* Sidebar Oscuro */}
      <aside className="w-64 bg-[#020617] border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="h-20 flex items-center justify-center border-b border-slate-800">
            <h1 className="text-xl font-bold text-white tracking-wider">
              REVELACIÓN<span className="text-amber-500">.ADMIN</span>
            </h1>
          </div>
          
          <nav className="p-4 space-y-2">
            <Link href="/admin" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <LayoutDashboard size={20} className="text-amber-500" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/admin/live" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <span className="font-medium">Torre de Control</span>
            </Link>
            <Link href="/admin/calendario" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <CalendarDays size={20} className="text-blue-400" />
              <span className="font-medium">Calendario</span>
            </Link>
            <Link href="/admin/paquetes" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <PackageSearch size={20} className="text-purple-400" />
              <span className="font-medium">Catálogo & SEO</span>
            </Link>
            <Link href="/admin/agente-ia" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <Bot size={20} className="text-rose-400" />
              <span className="font-medium">Agente IA (Groq)</span>
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-950 hover:text-red-400 transition-colors text-left">
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-[#0f172a] border-b border-slate-800 flex items-center px-8 justify-between">
          <h2 className="text-lg font-semibold text-white">Panel de Control Operativo</h2>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
              ADMIN
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>

    </div>
  );
}