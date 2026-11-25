"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Calendar as CalendarIcon, MapPin, User, Phone, Mail } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  eventAddress: string;
  eventDate: string;
}

export default function AgendarPage({ params }: { params: { packageId: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>();

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: params.packageId,
          clientInfo: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            eventAddress: data.eventAddress,
          },
          eventDate: data.eventDate
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirigimos a la página de pago que ya construimos, pasando el ID de la reserva por URL
        router.push(`/reservar/${params.packageId}/pago?bookingId=${result.bookingId}`);
      } else {
        toast.error(`Error: ${result.error}`);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Error de conexión. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <Toaster position="top-center" />
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-slate-900 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Detalles del Evento</h1>
          <p className="text-slate-400 text-sm">Paso 1 de 2: Información de Logística</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          
          {/* Datos Personales */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2">Tus Datos</h3>
            
            <div className="relative">
              <User className="absolute top-3.5 left-3 text-slate-400" size={20} />
              <input 
                {...register("name", { required: true })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 p-3 focus:border-amber-500 focus:outline-none"
                placeholder="Nombre Completo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Phone className="absolute top-3.5 left-3 text-slate-400" size={20} />
                <input 
                  {...register("phone", { required: true })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 p-3 focus:border-amber-500 focus:outline-none"
                  placeholder="WhatsApp"
                />
              </div>
              <div className="relative">
                <Mail className="absolute top-3.5 left-3 text-slate-400" size={20} />
                <input 
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 p-3 focus:border-amber-500 focus:outline-none"
                  placeholder="Correo Electrónico"
                />
              </div>
            </div>
          </div>

          {/* Logística */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2">Logística</h3>
            
            <div className="relative">
              <MapPin className="absolute top-3.5 left-3 text-slate-400" size={20} />
              <input 
                {...register("eventAddress", { required: true })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 p-3 focus:border-amber-500 focus:outline-none"
                placeholder="Dirección completa del evento (Jardín/Salón)"
              />
            </div>

            <div className="relative">
              <CalendarIcon className="absolute top-3.5 left-3 text-slate-400" size={20} />
              <input 
                type="datetime-local"
                {...register("eventDate", { required: true })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 p-3 focus:border-amber-500 focus:outline-none text-slate-700"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-lg shadow-lg"
          >
            {isLoading ? 'Guardando...' : 'Continuar al Pago'}
          </button>
        </form>

      </div>
    </div>
  );
}