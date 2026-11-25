import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border-t-4 border-emerald-500">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">¡Reserva Confirmada!</h1>
        <p className="text-slate-600 mb-8">
          Hemos recibido tu anticipo con éxito. La fecha ha sido bloqueada en nuestro sistema operativo.
        </p>

        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-500" />
            Siguientes Pasos:
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="font-bold text-slate-900">1.</span>
              Revisa tu correo. Te hemos enviado el recibo de pago y el <strong className="text-amber-600">Link Confidencial</strong>.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-slate-900">2.</span>
              Comparte ese link exclusivamente con tu ginecólogo o familiar que sabe el resultado.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-slate-900">3.</span>
              Nuestra cuadrilla te contactará por WhatsApp 24 horas antes del evento para afinar detalles de llegada.
            </li>
          </ul>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
        >
          Volver al Inicio <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}