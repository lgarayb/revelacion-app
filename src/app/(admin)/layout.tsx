"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Map,
  CalendarDays,
  PackageSearch,
  Boxes,
  Bot,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    iconColor: "text-amber-500",
    exact: true,
  },
  {
    href: "/admin/live",
    label: "Torre de Control",
    icon: Map,
    iconColor: "text-emerald-400",
  },
  {
    href: "/admin/calendario",
    label: "Calendario",
    icon: CalendarDays,
    iconColor: "text-blue-400",
  },
  {
    href: "/admin/paquetes",
    label: "Catálogo & SEO",
    icon: PackageSearch,
    iconColor: "text-purple-400",
  },
  {
    href: "/admin/inventario",
    label: "Inventario",
    icon: Boxes,
    iconColor: "text-cyan-400",
  },
  {
    href: "/admin/agente-ia",
    label: "Agente IA (Groq)",
    icon: Bot,
    iconColor: "text-rose-400",
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans">
      {/* Sidebar Oscuro */}
      <aside className="w-64 bg-[#020617] border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-20 flex items-center justify-center border-b border-slate-800">
            <Link href="/admin" className="text-xl font-bold text-white tracking-wider">
              REVELACIÓN<span className="text-amber-500">.ADMIN</span>
            </Link>
          </div>

          <nav className="p-4 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    active
                      ? "bg-slate-800 text-white font-semibold"
                      : "hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <Icon size={20} className={item.iconColor} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-950 hover:text-red-400 transition-colors text-left"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-20 bg-[#0f172a] border-b border-slate-800 flex items-center px-8 justify-between shrink-0">
          <h2 className="text-lg font-semibold text-white">
            Panel de Control Operativo
          </h2>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
              ADMIN
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}