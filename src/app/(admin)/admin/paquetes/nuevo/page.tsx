"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Interface basada en el Schema de Mongoose
interface PackageFormData {
  name: string;
  slug: string;
  basePrice: number;
  description: string;
  seo: {
    h1: string;
    h2: string;
    metaDescription: string;
  };
}

export default function NuevoPaquetePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, setValue, reset } = useForm<PackageFormData>();

  // Generador automático de slug basado en el título H1
  const generateSlug = () => {
    const h1Value = watch("seo.h1");
    if (h1Value) {
      const slug = h1Value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", slug);
    }
  };

  const onSubmit = async (data: PackageFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/paquetes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success("Paquete y Rich Snippets creados con éxito");
        reset();
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      toast.error("Ocurrió un error al guardar en la base de datos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-white mb-6">Crear Nuevo Montaje (Optimizado)</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Bloque 1: Datos Base */}
        <div className="bg-[#020617] border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-semibold text-amber-500 border-b border-slate-800 pb-2">1. Datos Comerciales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Nombre Interno del Paquete</label>
              <input 
                {...register("name", { required: true })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                placeholder="Ej. Paquete Extintor Humo 2026"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Precio Base de Reserva (MXN)</label>
              <input 
                type="number"
                {...register("basePrice", { required: true, valueAsNumber: true })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                placeholder="2500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Descripción del Servicio (Ventas)</label>
            <textarea 
              {...register("description", { required: true })}
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
              placeholder="Describe qué incluye el montaje, tiempos de instalación..."
            />
          </div>
        </div>

        {/* Bloque 2: Optimización SEO */}
        <div className="bg-[#020617] border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-semibold text-emerald-500 border-b border-slate-800 pb-2">2. Optimización SEO y Rich Snippets</h3>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">H1 (Título Principal para Google)</label>
            <div className="flex gap-2">
              <input 
                {...register("seo.h1", { required: true })}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="Ej. Extintor de Polvo Holi para Revelación de Género en CDMX"
              />
              <button 
                type="button" 
                onClick={generateSlug}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
              >
                Generar URL
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">URL amigable (Slug)</label>
            <input 
              {...register("slug", { required: true })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-emerald-400 font-mono text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="extintor-polvo-revelacion-genero-cdmx"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Meta Description (150-160 caracteres)</label>
            <textarea 
              {...register("seo.metaDescription", { required: true })}
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
              placeholder="Sorprende a todos con nuestro montaje de..."
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Guardando Montaje y JSON-LD...' : 'Crear y Publicar Montaje'}
        </button>
      </form>
    </div>
  );
}