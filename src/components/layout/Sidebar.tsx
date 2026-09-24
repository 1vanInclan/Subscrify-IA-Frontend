'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  PieChart, 
  CalendarDays, 
  LogOut, 
  CreditCard 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Suscripciones', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Gastos y Analítica', href: '/dashboard/analytics', icon: PieChart },
  { name: 'Calendario de Pagos', href: '/dashboard/calendar', icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const publicRoutes = ['/login', '/register', '/'];
  if (publicRoutes.includes(pathname)) {
    return null;
  }

  return (
    <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950 flex flex-col justify-between min-h-screen p-4 shrink-0">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950 font-bold">
            S
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-zinc-100">Subscrify</h1>
            <p className="text-[11px] text-zinc-500 font-medium">Subscription Control</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800/80 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-100' : 'text-zinc-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout Section */}
      <div className="border-t border-zinc-800/80 pt-4 space-y-3">
        <div className="px-2">
          <p className="text-xs font-semibold text-zinc-200 truncate">{user?.email || 'Usuario'}</p>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Plan Free</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-zinc-900/80 rounded-xl text-xs"
          onClick={() => {
            logout();
            router.push('/login');
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}