"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  TrendingUp,
  MapPin,
  CheckCircle2,
  Clock,
  Plus,
  Package as PackageIcon,
} from "lucide-react";

interface TodayOperation {
  id: string;
  badge: string;
  packageName: string;
  clientName: string;
  time: string;
  destination: string;
  crew: string;
  amount: number;
  phone?: string;
}

const DEFAULT_OPERATIONS: TodayOperation[] = [
  {
    id: "evt-101",
    badge: "EN CAMINO",
    packageName: "Paquete Cielo VIP",
    clientName: "Luis Garay",
    time: "18:30 hrs",
    destination: "Jardín Borda, Cuernavaca",
    crew: "Equipo Alfa (Camioneta 1)",
    amount: 14500,
    phone: "525500000000",
  },
];

export default function AdminDashboard() {
  const [packagesCount, setPackagesCount] = useState<number>(0);
  const [operations, setOperations] = useState<TodayOperation[]>(DEFAULT_OPERATIONS);
  const [salesToday, setSalesToday] = useState<number>(14500);
  const [avgTicket, setAvgTicket] = useState<number>(8250);
  const [activeCrews, setActiveCrews] = useState<number>(3);

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      try {
        const [pkgRes, bookRes] = await Promise.all([
          fetch("/api/paquetes?all=true", { cache: "no-store" }),
          fetch("/api/bookings", { cache: "no-store" }),
        ]);

        if (pkgRes.ok) {
          const pkgJson = await pkgRes.json();
          const list = Array.isArray(pkgJson?.data) ? pkgJson.data : [];
          if (mounted) {
            setPackagesCount(list.length);
            if (list.length > 0) {
              const totalBase = list.reduce(
                (acc: number, item: any) => acc + (Number(item?.basePrice) || 0),
                0
              );
              setAvgTicket(Math.round(totalBase / list.length));
            }
          }
        }

        if (bookRes.ok) {
          const bookJson = await bookRes.json();
          const bookings = Array.isArray(bookJson)
            ? bookJson
            : Array.isArray(bookJson?.data)
            ? bookJson.data
            : [];

          if (mounted && bookings.length > 0) {
            const totalSales = bookings.reduce(
              (acc: number, b: any) =>
                acc + (Number(b?.depositPaid ?? b?.totalAmount ?? b?.amount) || 0),
              0
            );
            if (totalSales > 0) setSalesToday(totalSales);

            const mappedOps: TodayOperation[] = bookings.slice(0, 4).map((b: any, idx: number) => ({
              id: String(b?._id || `evt-${idx + 1}`),
              badge: String(b?.status || "EN CAMINO").toUpperCase(),
              packageName: b?.packageName || b?.package?.name || "Montaje Revelación",
              clientName: b?.clientName || b?.customerName || "Cliente",
              time: b?.eventTime ? `${b.eventTime} hrs` : "18:30 hrs",
              destination: b?.location || b?.address || "Por confirmar",
              crew: b?.crew || "Equipo Alfa (Camioneta 1)",
              amount: Number(b?.totalAmount ?? b?.amount ?? 8250) || 8250,
              phone: b?.clientPhone || b?.phone || "",
            }));

            setOperations(mappedOps);
            setActiveCrews(mappedOps.length);
          }
        }
      } catch {
        // Mantiene valores base de operación en caso de error de red
      }
    }

    loadDashboardData();
    return () => {
      mounted = false;
    };
  }, []);

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(val || 0);

  const handleTrackGps = (destination: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      destination
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success(`Abriendo ruta GPS: ${destination}`);
  };

  const handleWhatsApp = (op: TodayOperation) => {
    const cleanPhone = (op.phone || "").replace(/\D/g, "");
    const text = encodeURIComponent(
      `Hola ${op.clientName}, te contactamos de Revelación sobre tu montaje (${op.packageName}) en ${op.destination}.`
    );
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Torre de Control .Live</h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Monitoreo Activo • {packagesCount} paquetes en catálogo
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/paquetes"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
          >
            <PackageIcon className="w-4 h-4 text-amber-400" />
            Ver Paquetes
          </Link>
          <Link
            href="/admin/paquetes/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Montaje
          </Link>
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
            <h3 className="text-2xl font-bold text-white">{formatMoney(salesToday)}</h3>
          </div>
        </div>

        <div className="bg-[#020617] border border-slate-800 p-6 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Montajes en Curso</p>
            <h3 className="text-2xl font-bold text-white">{activeCrews} Cuadrillas</h3>
          </div>
        </div>

        <div className="bg-[#020617] border border-slate-800 p-6 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Ticket Promedio</p>
            <h3 className="text-2xl font-bold text-white">{formatMoney(avgTicket)}</h3>
          </div>
        </div>
      </div>

      {/* Lista de Eventos del Día */}
      <h3 className="text-lg font-semibold text-white mt-8 mb-4 border-b border-slate-800 pb-2">
        Operaciones de Hoy
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {operations.map((op) => (
          <div
            key={op.id}
            className="bg-[#020617] border border-slate-800 rounded-xl overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full mb-2">
                    {op.badge}
                  </span>
                  <h4 className="text-lg font-bold text-white">{op.packageName}</h4>
                  <p className="text-slate-400 text-sm">Cliente: {op.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-300 font-mono flex items-center gap-2">
                    <Clock size={16} className="text-slate-500" />
                    {op.time}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-white">Destino:</span> {op.destination}
                </p>
                <p className="text-sm text-slate-300 mt-1">
                  <span className="font-bold text-white">Cuadrilla:</span> {op.crew}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleTrackGps(op.destination)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Rastrear GPS
                </button>
                <button
                  type="button"
                  onClick={() => handleWhatsApp(op)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}