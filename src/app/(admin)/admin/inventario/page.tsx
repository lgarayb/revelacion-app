"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Boxes, Plus, AlertTriangle, Minus, RotateCcw } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
}

const STORAGE_KEY = "revelacion_admin_inventario_v1";

const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Extintor Polvo Holi Rosa / Azul (Carga 2 kg)",
    sku: "EXT-HOLI-01",
    category: "Revelación de Género",
    quantity: 18,
    minStock: 6,
    unit: "pzas",
  },
  {
    id: "inv-2",
    name: "Cartucho Humo Frío / Efecto Escenario",
    sku: "HUMO-FX-02",
    category: "Efectos Especiales",
    quantity: 4,
    minStock: 5,
    unit: "cargas",
  },
  {
    id: "inv-3",
    name: "Kit Protección Cuadrilla (Guantes, Lentes, Cubrecalzado)",
    sku: "CUA-EPP-03",
    category: "Operación en Campo",
    quantity: 12,
    minStock: 4,
    unit: "kits",
  },
];

export default function AdminInventarioPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Revelación de Género");
  const [quantity, setQuantity] = useState(10);
  const [minStock, setMinStock] = useState(3);
  const [unit, setUnit] = useState("pzas");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
          setHydrated(true);
          return;
        }
      }
    } catch {
      // Si falla localStorage, usamos el catálogo base
    }
    setItems(INITIAL_ITEMS);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar errores de cuota
    }
  }, [items, hydrated]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Escribe el nombre del insumo");
      return;
    }

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: name.trim(),
      sku: (sku.trim() || `REV-${Math.floor(100 + Math.random() * 900)}`).toUpperCase(),
      category: category.trim() || "General",
      quantity: Math.max(0, Number(quantity) || 0),
      minStock: Math.max(0, Number(minStock) || 0),
      unit: unit.trim() || "pzas",
    };

    setItems((prev) => [newItem, ...prev]);
    setName("");
    setSku("");
    setQuantity(10);
    setMinStock(3);
    toast.success("Insumo agregado al inventario");
  };

  const adjustStock = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: nextQty };
      })
    );
  };

  const resetDemoData = () => {
    setItems(INITIAL_ITEMS);
    toast.success("Inventario restaurado a valores iniciales");
  };

  const lowStockCount = items.filter((i) => i.quantity <= i.minStock).length;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Boxes className="w-6 h-6 text-amber-500" />
            Inventario y Consumibles
          </h2>
          <p className="text-sm text-slate-400">
            Controla existencias para montajes y salidas de cuadrilla. Alertas activas:{" "}
            <span className="text-amber-400 font-semibold">{lowStockCount}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={resetDemoData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Restaurar base
        </button>
      </div>

      {/* Formulario rápido de alta */}
      <form
        onSubmit={handleAddItem}
        className="bg-[#020617] border border-slate-800 p-5 rounded-xl grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
      >
        <div className="md:col-span-2">
          <label className="block text-xs text-slate-400 mb-1">Insumo / Equipo</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Extintor Humo Azul 3kg"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">SKU</label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="EXT-AZUL-04"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Stock Inicial</label>
          <input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Mínimo Alerta</label>
          <input
            type="number"
            min={0}
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </form>

      {/* Tabla de existencias */}
      <div className="bg-[#020617] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">SKU</th>
                <th className="py-3.5 px-4 font-semibold">Insumo</th>
                <th className="py-3.5 px-4 font-semibold">Categoría</th>
                <th className="py-3.5 px-4 font-semibold">Existencia</th>
                <th className="py-3.5 px-4 font-semibold">Estado</th>
                <th className="py-3.5 px-4 font-semibold text-right">Ajuste rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {items.map((item) => {
                const isLow = item.quantity <= item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {item.quantity} <span className="text-slate-400 font-normal">{item.unit}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Reponer (mín. {item.minStock})
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Óptimo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => adjustStock(item.id, -1)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                          aria-label="Restar unidad"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustStock(item.id, 1)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                          aria-label="Sumar unidad"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}