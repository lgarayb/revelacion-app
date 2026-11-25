"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Plus, ExternalLink, Sparkles, RefreshCw } from "lucide-react";

interface PackageSeo {
  h1?: string;
  h2?: string;
  metaDescription?: string;
}

interface PackageItem {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  basePrice: number;
  depositPrice?: number;
  isActive: boolean;
  featured?: boolean;
  seo?: PackageSeo;
  createdAt?: string;
}

export default function AdminPaquetesPage() {
  const [paquetes, setPaquetes] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPaquetes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/paquetes?all=true", { cache: "no-store" });
      const data = await res.json();

      if (res.ok && data.success) {
        setPaquetes(Array.isArray(data.data) ? data.data : []);
      } else {
        toast.error(data.error || "No se pudieron cargar los paquetes");
      }
    } catch {
      toast.error("Error de red al consultar paquetes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaquetes();
  }, []);

  const formatMXN = (amount: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Catálogo y Montajes
          </h2>
          <p className="text-sm text-slate-400">
            Administra los paquetes activos, precios base, slugs y configuración SEO.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadPaquetes}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl hover:bg-slate-800 transition-colors text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>

          <Link
            href="/admin/paquetes/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo Montaje
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#020617] border border-slate-800 rounded-xl p-8 text-center text-slate-400">
          Cargando paquetes desde MongoDB...
        </div>
      ) : paquetes.length === 0 ? (
        <div className="bg-[#020617] border border-slate-800 rounded-xl p-10 text-center space-y-4">
          <p className="text-slate-300 font-medium">
            Aún no hay paquetes registrados en la base de datos.
          </p>
          <Link
            href="/admin/paquetes/nuevo"
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Crear primer paquete
          </Link>
        </div>
      ) : (
        <div className="bg-[#020617] border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                  <th className="py-3.5 px-4 font-semibold">Paquete / H1 SEO</th>
                  <th className="py-3.5 px-4 font-semibold">Slug</th>
                  <th className="py-3.5 px-4 font-semibold">Precio Base</th>
                  <th className="py-3.5 px-4 font-semibold">Estado</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {paquetes.map((pkg) => (
                  <tr
                    key={pkg._id}
                    className="hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {pkg.name}
                        </span>
                        {pkg.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <Sparkles className="w-3 h-3" />
                            Destacado
                          </span>
                        )}
                      </div>
                      {pkg.seo?.h1 && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          H1: {pkg.seo.h1}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-emerald-400">
                      /paquetes/{pkg.slug}
                    </td>

                    <td className="py-4 px-4 font-semibold text-white">
                      {formatMXN(pkg.basePrice)}
                    </td>

                    <td className="py-4 px-4">
                      {pkg.isActive ? (
                        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          Inactivo
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        <Link
                          href={`/paquetes/${pkg.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
                        >
                          Ver ficha
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/reservar/${pkg._id}`}
                          className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                        >
                          Reservar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}