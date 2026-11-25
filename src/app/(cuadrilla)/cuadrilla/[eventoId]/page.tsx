"use client";

import { useState } from 'react';
import { MapPin, Clock, EyeOff, Eye, CheckSquare, Flame } from 'lucide-react';

export default function CuadrillaApp({ params }: { params: { eventoId: string } }) {
  const [showColor, setShowColor] = useState(false);
  
  // En producción, estos datos vendrán del servidor vía fetch
  const eventData = {
    client: "Familia Garza",
    address: "Jardín Borda, Cuernavaca",
    time: "18:30 hrs",
    package: "Paquete Pirotecnia Fría 4 Tiempos",
    resolvedColor: "ROSA (Niña)",
    colorCode: "text-pink-600 bg-pink-100 border-pink-500",
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans pb-20">
      <header className="bg-slate-950 p-4 border-b border-slate-800 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="font-bold text-amber-500 flex items-center gap-2">
          <Flame size={20} /> CUADRILLA.LIVE
        </h1>
        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 text-xs font-bold rounded-full">
          EN CAMINO
        </span>
      </header>

      <main className="p-4 space-y-6">
        {/* Datos del Cliente y Ruta */}
        <section className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">{eventData.client}</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-slate-400 mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-300">Ubicación</p>
                <p className="text-white">{eventData.address}</p>
                <button className="text-blue-400 text-sm font-medium mt-1 hover:underline">
                  Abrir en Google Maps
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-300">Hora de Detonación</p>
                <p className="text-white text-lg">{eventData.time}</p>
              </div>
            </div>
          </div>
        </section>

        {/* El Secreto (Protegido) */}
        <section className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg text-center">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Color a Cargar</h3>
          
          {!showColor ? (
            <button 
              onClick={() => setShowColor(true)}
              className="w-full py-8 bg-slate-950 border border-slate-700 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-slate-900 transition-colors"
            >
              <EyeOff size={32} className="text-slate-500" />
              <span className="text-slate-400 font-medium">Tocar para revelar color</span>
              <span className="text-xs text-red-400 mt-2 block px-8">No abras esto hasta que estés armando las máquinas</span>
            </button>
          ) : (
            <div className={`w-full py-8 rounded-xl border-4 ${eventData.colorCode} flex flex-col items-center justify-center gap-2 animate-in zoom-in duration-300`}>
              <Eye size={32} />
              <span className="text-3xl font-black">{eventData.resolvedColor}</span>
              <button 
                onClick={() => setShowColor(false)}
                className="text-sm mt-4 underline opacity-80"
              >
                Ocultar
              </button>
            </div>
          )}
        </section>

        {/* Checklist Operativo */}
        <section className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckSquare size={20} className="text-amber-500" /> Montaje
          </h3>
          <p className="text-slate-300 mb-4">{eventData.package}</p>
          
          <button className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors shadow-lg">
            Marcar Montaje Completado
          </button>
        </section>
      </main>
    </div>
  );
}