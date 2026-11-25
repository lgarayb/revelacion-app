"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Calendar as CalendarIcon, MapPin, Clock, RefreshCw, Truck } from "lucide-react";

interface BookingItem {
  _id: string;
  clientName?: string;
  packageName?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  status?: string;
  totalAmount?: number;
}

const FALLBACK_BOOKINGS: BookingItem[] = [
  {
    _id: "evt-101",
    clientName: "Luis Garay",
    packageName: "Paquete Cielo VIP",
    eventDate: "2026-11-25",
    eventTime: "18:30",
    location: "Jardín Borda, Cuernavaca",
    status: "en_ruta",
    totalAmount: 14500,
  },
  {
    _id: "evt-102",
    clientName: "Valeria Mendoza",
    packageName: "Extintor Polvo Holi Revelación",
    eventDate: "2026-11-26",
    eventTime: "15:00",
    location: "Coyoacán, CDMX",
    status: "confirmado",
    totalAmount: 6800,
  },
  {
    _id: "evt-103",
    clientName: "Ricardo Torres",
    packageName: "Montaje Humo & Confeti Premium",
    eventDate: "2026-11-28",
    eventTime: "17:00",
    location: "Interlomas, Huixquilucan",
    status: "pendiente",
    totalAmount: 11200,
  },
];

export default function AdminCalendarioPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setBookings(list.length > 0 ? list : FALLBACK_BOOKINGS);
      } else {
        setBookings(FALLBACK_BOOKINGS);
      }
    } catch {
      toast.error("No se pudo consultar /api/bookings, mostrando agenda base");
      setBookings(FALLBACK_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter(
          (b) => (b.status || "pendiente").toLowerCase() === statusFilter
        );

  const formatMXN = (amount?: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const badgeStyle = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "en_ruta":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "confirmado":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-amber-500" />
            Calendario de Eventos y Reservas
          </h2>
          <p className="text-sm text-slate-400">
            Revisa montajes programados, horarios de salida y acceso rápido a cuadrilla.
          </p>
        </div>

        <button
          type="button"
          onClick={loadBookings}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl hover:bg-slate-800 transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Sincronizar
        </button>
      </div>

      {/* Filtros de estado */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "Todos" },
          { key: "en_ruta", label: "En ruta" },
          { key: "confirmado", label: "Confirmados" },
          { key: "pendiente", label: "Pendientes" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === tab.key
                ? "bg-amber-600 text-white"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-[#020617] border border-slate-800 rounded-xl p-8 text-center text-slate-400">
          Cargando agenda de eventos...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-[#020617] border border-slate-800 rounded-xl p-8 text-center text-slate-400">
          No hay eventos con este filtro.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-[#020617] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeStyle(
                      booking.status
                    )}`}
                  >
                    {(booking.status || "pendiente").toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {booking.eventDate || "Fecha por definir"}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {booking.packageName || "Montaje Revelación"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cliente: {booking.clientName || "Por asignar"}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-300 pt-1">
                  {booking.eventTime && (
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Hora de montaje: {booking.eventTime} hrs
                    </p>
                  )}
                  {booking.location && (
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {booking.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-sm font-bold text-white">
                  {formatMXN(booking.totalAmount)}
                </span>

                <Link
                  href={`/cuadrilla/${booking._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-amber-400"
                >
                  <Truck className="w-3.5 h-3.5" />
                  Abrir Cuadrilla
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}