"use client";

import { useState } from 'react';
import { UploadCloud, CheckCircle, Baby } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SecretoDoctorPage({ params }: { params: { token: string } }) {
  const [selectedGender, setSelectedGender] = useState<'niño' | 'niña' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedGender) {
      toast.error("Por favor selecciona el sexo del bebé");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/secreto/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: params.token,
          gender: selectedGender,
          // Aquí integrarías la URL de Cloudinary si el doctor sube la foto del ultrasonido
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        toast.error("Hubo un error al guardar la información. Intenta de nuevo.");
      }
    } catch (error) {
      toast.error("Error de conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Información Guardada!</h2>
          <p className="text-slate-600">
            El secreto está a salvo con nosotros. Ya puedes cerrar esta ventana. Los papás tendrán una sorpresa inolvidable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-md w-full border-t-4 border-amber-500">
        <div className="text-center mb-8">
          <Baby size={48} className="text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-slate-900">Portal Confidencial</h1>
          <p className="text-slate-500 text-sm mt-2">
            Ingresa el resultado para el evento. Esta información está encriptada y los padres NO tendrán acceso a ella.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 text-center">¿Cuál es el sexo del bebé?</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedGender('niña')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${
                  selectedGender === 'niña' 
                    ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-md scale-105' 
                    : 'border-slate-200 text-slate-500 hover:border-pink-200'
                }`}
              >
                Es Niña 💖
              </button>
              <button
                onClick={() => setSelectedGender('niño')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${
                  selectedGender === 'niño' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-105' 
                    : 'border-slate-200 text-slate-500 hover:border-blue-200'
                }`}
              >
                Es Niño 💙
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedGender}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting ? 'Guardando Secreto...' : 'Confirmar y Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}