"use client";

import { useState } from "react";
import Link from "next/link";
import { Radio, MapPin, Truck, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";

interface LiveCrewOperation {
  eventId: string;
  crewName: string;
  vehicle: string;
  packageName: string;
  clientName: string;
  destination: string;
  eta: string;
  status: "EN CAMINO" | "MONTANDO" | "COMPLETADO";
  lastUpdate: string;
}

const INITIAL_LIVE_OPS: LiveCrewOperation[] = [
  {
    eventId: "evt-101",
    crewName: "Equipo Alfa",
    vehicle: "Camioneta 1",
    packageName: "Paquete Cielo VIP",
    clientName: "Luis Garay",
    destination: "Jardín Borda, Cuernavaca",
    eta: "18:30 hrs",
    status: "EN CAMINO",
    lastUpdate: "Hace 2 min",
  },
  {
    eventId: "evt-104",
    crewName: "Equipo Bravo",
    vehicle: "Camioneta 2",
    packageName: "Extintor Humo Holi Revelación",
    clientName: "Daniela Reyes",
    destination: "Coyoacán, CDMX",
    eta: "16:00 hrs",
    status: "MONTANDO",
    lastUpdate: "Hace 5 min",
  },
  {
    eventId: "evt-099",
    crewName: "Equipo Charlie",
    vehicle: "Unidad Sur",
    packageName: "Montaje Revelación Clásico",
    clientName: "Fernando Silva",
    destination: "Lomas de Tecamachalco",
    eta: "12:30 hrs",
    status: "COMPLETADO",
    lastUpdate: "Hace 42 min",
  },
];

export default function AdminLivePage() {
  const [operations, setOperations] = useState<LiveCrewOperation[]>(INITIAL_LIVE_OPS);

  const cycleStatus = (eventId: string) => {
    const order: LiveCrewOperation["status"][] = [
      "EN CAMINO",
      "MONTANDO",
      "COMPLETADO",
    ];
    setOperations((prev) =>
      prev.map((op) => {
        if (op.eventId !== eventId) return op;
        const nextIdx = (order.indexOf(op.status) + 1) % order.length;
        return {
          ...op,
          status: order[nextIdx],
          lastUpdate: "Actualizado ahora",
        };
      })
    );
  };

  const statusBadge = (status: LiveCrewOperation["status"]) => {
    switch (status) {
      case "EN CAMINO":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "MONTANDO":
        return "bg-sky-500/15 text-sky-400 border-sky-500/30";
      case "COMPLETADO":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            Operaciones en Vivo (.Live)
          </h2>
          <p className="text-sm text-slate-400">
            Supervisa cuadrillas activas, cambia estados de montaje y abre la consola de campo.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {operations.filter((o) => o.status !== "COMPLETADO").length} cuadrillas activas
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {operations.map((op) => (
          <div
            key={op.eventId}
            className="bg-[#020617] border border-slate-800 rounded-xl p-5 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${statusBadge(
                      op.status
                    )}`}
                  >
                    {op.status}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ETA {op.eta} · {op.lastUpdate}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">
                  {op.packageName}
                </h3>
                <p className="text-xs text-slate-400">Cliente: {op.clientName}</p>
              </div>

              <button
                type="button"
                onClick={() => cycleStatus(op.eventId)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
              >
                Cambiar estado
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3.5 space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-slate-400">Destino:</strong> {op.destination}
                </span>
              </p>
              <p className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-slate-400">Cuadrilla:</strong> {op.crewName} ({op.vehicle})
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ID: {op.eventId}
              </span>

              <Link
                href={`/cuadrilla/${op.eventId}`}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors"
              >
                Vista Cuadrilla
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}