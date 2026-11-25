"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export interface PackageFormData {
  name: string;
  slug: string;
  category?: string;
  basePrice: number;
  depositPrice?: number;
  description: string;
  featured?: boolean;
  isActive?: boolean;
  seo: {
    h1: string;
    h2?: string;
    metaDescription: string;
  };
}

function toSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NuevoPaquetePage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PackageFormData>({
    defaultValues: {
      category: "Revelación de Género",
      featured: false,
      isActive: true,
      seo: {
        h1: "",
        h2: "",
        metaDescription: "",
      },
    },
  });

  const h1Value = watch("seo.h1");
  const metaDescValue = watch("seo.metaDescription") || "";

  const handleGenerateSlug = () => {
    if (!h1Value) {
      toast.error("Primero escribe el título H1");
      return;
    }
    setValue("slug", toSlug(h1Value), { shouldValidate: true });
  };

  const onSubmit = async (data: PackageFormData) => {
    setIsLoading(true);
    try {
      const normalizedPayload = {
        ...data,
        slug: toSlug(data.slug || data.seo.h1 || data.name),
        seoTitle: data.seo.h1,
        seoDescription: data.seo.metaDescription,
      };

      const response = await fetch("/api/paquetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedPayload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Paquete y datos SEO guardados en MongoDB");
        reset();
      } else {
        toast.error(result.error || "No se pudo guardar el paquete");
      }
    } catch {
      toast.error("Ocurrió un error al guardar en la base de datos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-white mb-6">
        Crear Nuevo Montaje (Optimizado)
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Bloque 1: Datos Base */}
        <div className="bg-[#020617] border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-semibold text-amber-500 border-b border-slate-800 pb-2">
            1. Datos Comerciales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Nombre Interno del Paquete
              </label>
              <input
                {...register("name", { required: "El nombre es obligatorio" })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                placeholder="Ej. Paquete Extintor Humo 2026"
              />
              {errors.name && (
                <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Precio Base de Reserva (MXN)
              </label>
              <input
                type="number"
                step="any"
                {...register("basePrice", {
                  required: "El precio base es obligatorio",
                  valueAsNumber: true,
                  min: { value: 0, message: "No puede ser negativo" },
                })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                placeholder="2500"
              />
              {errors.basePrice && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.basePrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Categoría
              </label>
              <input
                {...register("category")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                placeholder="Ej. Revelación de Género"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Anticipo sugerido (MXN, opcional)
              </label>
              <input
                type="number"
                step="any"
                {...register("depositPrice", { valueAsNumber: true })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                placeholder="1000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Descripción del Servicio (Ventas)
            </label>
            <textarea
              {...register("description", {
                required: "La descripción es obligatoria",
              })}
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
              placeholder="Describe qué incluye el montaje, tiempos de instalación..."
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-6 pt-1 text-sm text-slate-300">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("featured")}
                className="rounded border-slate-700 bg-slate-900 text-amber-500"
              />
              Destacar en portada / catálogo
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isActive")}
                className="rounded border-slate-700 bg-slate-900 text-amber-500"
              />
              Publicado y activo
            </label>
          </div>
        </div>

        {/* Bloque 2: Optimización SEO */}
        <div className="bg-[#020617] border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-semibold text-emerald-500 border-b border-slate-800 pb-2">
            2. Optimización SEO y Rich Snippets
          </h3>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              H1 (Título Principal para Google)
            </label>
            <div className="flex gap-2">
              <input
                {...register("seo.h1", { required: "El H1 es obligatorio" })}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="Ej. Extintor de Polvo Holi para Revelación de Género en CDMX"
              />
              <button
                type="button"
                onClick={handleGenerateSlug}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Generar URL
              </button>
            </div>
            {errors.seo?.h1 && (
              <p className="text-xs text-rose-400 mt-1">{errors.seo.h1.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              H2 / Subtítulo SEO (Opcional)
            </label>
            <input
              {...register("seo.h2")}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
              placeholder="Ej. Montaje profesional con entrega y apoyo en sitio"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              URL amigable (Slug)
            </label>
            <input
              {...register("slug", { required: "El slug es obligatorio" })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-emerald-400 font-mono text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="extintor-polvo-revelacion-genero-cdmx"
            />
            {errors.slug && (
              <p className="text-xs text-rose-400 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-slate-400">
                Meta Description (150-160 caracteres)
              </label>
              <span
                className={`text-xs font-mono ${
                  metaDescValue.length > 160
                    ? "text-amber-400"
                    : "text-slate-500"
                }`}
              >
                {metaDescValue.length}/160
              </span>
            </div>
            <textarea
              {...register("seo.metaDescription", {
                required: "La meta description es obligatoria",
              })}
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
              placeholder="Sorprende a todos con nuestro montaje de..."
            />
            {errors.seo?.metaDescription && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.seo.metaDescription.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          {isLoading
            ? "Guardando Montaje y JSON-LD..."
            : "Crear y Publicar Montaje"}
        </button>
      </form>
    </div>
  );
}