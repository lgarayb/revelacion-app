"use client";

import { useState } from 'react';
import { CreditCard, Wallet, Lock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CheckoutPage({ params }: { params: { packageId: string } }) {
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [loadingMP, setLoadingMP] = useState(false);
  
  // En producción, este email lo obtienes del formulario del paso 1 (Zustand o Contexto)
  const mockClientEmail = "cliente@ejemplo.com"; 

  const handleMercadoPago = async () => {
    setLoadingMP(true);
    try {
      const res = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: params.packageId, clientEmail: mockClientEmail }),
      });
      const data = await res.json();
      
      if (data.init_point) {
        window.location.href = data.init_point; // Redirige al checkout de Mercado Pago
      } else {
        toast.error("Error al conectar con Mercado Pago");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoadingMP(false);
    }
  };

  const handleStripe = async () => {
    setLoadingStripe(true);
    // Aquí implementas Stripe Elements. Primero llamas a /api/stripe/create-intent 
    // y luego renderizas el elemento de tarjeta para cobrar.
    toast.success("Abriendo pasarela de Tarjeta/MSI...");
    setTimeout(() => setLoadingStripe(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 flex justify-center">
      <Toaster />
      <div className="w-full max-w-lg">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Asegura tu Fecha</h1>
          <p className="text-slate-500">Anticipo del 50% requerido para bloquear disponibilidad.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase">Total a Pagar Hoy</p>
              <h2 className="text-4xl font-black text-slate-900">$1,250<span className="text-lg text-slate-500 font-medium">.00 MXN</span></h2>
            </div>
          </div>

          <h3 className="font-semibold text-slate-700 mb-4">Elige tu método de pago</h3>

          {/* Opción 1: Stripe (Tarjetas / MSI) */}
          <button 
            onClick={handleStripe}
            disabled={loadingMP || loadingStripe}
            className="w-full relative flex items-center p-4 border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-4 group-hover:scale-110 transition-transform">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900">Tarjeta de Crédito / Débito</p>
              <p className="text-sm text-slate-500">Aceptamos Meses Sin Intereses</p>
            </div>
          </button>

          {/* Opción 2: Mercado Pago (SPEI / Oxxo / Saldo) */}
          <button 
            onClick={handleMercadoPago}
            disabled={loadingMP || loadingStripe}
            className="w-full relative flex items-center p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-4 group-hover:scale-110 transition-transform">
              <Wallet size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900">Mercado Pago</p>
              <p className="text-sm text-slate-500">Saldo, Transferencia o Efectivo Oxxo</p>
            </div>
          </button>

          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs mt-6">
            <Lock size={14} /> Pagos seguros y encriptados de extremo a extremo.
          </div>
        </div>
      </div>
    </div>
  );
}