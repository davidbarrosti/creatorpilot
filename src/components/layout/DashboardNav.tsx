"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MODULES = [
  { href: "/dashboard/radar", label: "Radar", icon: "🎯" },
  { href: "/dashboard/brief", label: "Briefing", icon: "🎬" },
  { href: "/dashboard/collabs", label: "Collabs", icon: "🤝" },
  { href: "/dashboard/performance", label: "Performance", icon: "📈" },
  { href: "/dashboard/calendar", label: "Calendário", icon: "📅" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden w-56 shrink-0 flex-col gap-1 border-r border-slate-200 p-4 md:flex">
        <span className="mb-4 px-2 text-lg font-bold">CreatorPilot</span>
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              pathname.startsWith(m.href)
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {m.icon} {m.label}
          </Link>
        ))}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-slate-200 bg-white md:hidden">
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
              pathname.startsWith(m.href) ? "text-slate-900" : "text-slate-400"
            }`}
          >
            <span>{m.icon}</span>
            {m.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
