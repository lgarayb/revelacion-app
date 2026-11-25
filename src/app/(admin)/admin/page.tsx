import { 
  TrendingUp, 
  MapPin, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Torre de Control .Live</h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Monitoreo Activo • Actualizado hace un momento
          </p>
        </div>
      </div>

      {/* Tarjetas de Métricas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#020617] border border-slate-800 p-6 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Ventas Hoy (Anticipos)</p>
            <h3 className="text-2xl font-bold text-white">$14,500.00</h3>
          </div>
        </div>
        
        <div className="bg-[#020617] border border-slate-800 p-6 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Montajes en Curso</p>
            <h3 className="text-2xl font-bold text-white">3 Cuadrillas</h3>
          </div>
        </div>

        <div className="bg-[#020617] border border-slate-800 p-6 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Ticket Promedio</p>
            <h3 className="text-2xl font-bold text-white">$8,250.00</h3>
          </div>
        </div>
      </div>

      {/* Lista de Eventos del Día */}
      <h3 className="text-lg font-semibold text-white mt-8 mb-4 border-b border-slate-800 pb-2">
        Operaciones de Hoy
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tarjeta de Evento (Ejemplo estático para que veas el diseño) */}
        <div className="bg-[#020617] border border-slate-800 rounded-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full mb-2">
                  EN CAMINO
                </span>
                <h4 className="text-lg font-bold text-white">Paquete Cielo VIP</h4>
                <p className="text-slate-400 text-sm">Cliente: Luis Garay</p>
              </div>
              <div className="text-right">
                <p className="text-slate-300 font-mono flex items-center gap-2">
                  <Clock size={16} className="text-slate-500" />
                  18:30 hrs
                </p>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <p className="text-sm text-slate-300">
                <span className="font-bold text-white">Destino:</span> Jardín Borda, Cuernavaca
              </p>
              <p className="text-sm text-slate-300 mt-1">
                <span className="font-bold text-white">Cuadrilla:</span> Equipo Alfa (Camioneta 1)
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition-colors">
                Rastrear GPS
              </button>
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition-colors">
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}