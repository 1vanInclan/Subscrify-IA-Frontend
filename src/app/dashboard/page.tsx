'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateSubscriptionModal } from '@/components/subscriptions/CreateSubscriptionModal';
import { EditSubscriptionModal } from '@/components/subscriptions/EditSubscriptionModal';
import { DeleteSubscriptionDialog } from '@/components/subscriptions/DeleteSubscriptionDialog';
import { SubscriptionIcon } from '@/components/subscriptions/SubscriptionsIcon';
import { CreditCard, DollarSign, LogOut, Search, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const { subscriptions, loading, error, fetchSubscriptions } = useSubscriptionStore();
  const [isMounted, setIsMounted] = useState(false);

  // Estados para búsqueda y filtrado por categoría
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const storedToken = token || localStorage.getItem('auth-storage');
      if (!token && !storedToken) {
        router.push('/login');
      } else {
        fetchSubscriptions();
      }
    }
  }, [isMounted, token, router, fetchSubscriptions]);

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500 font-medium">
        Cargando interfaz...
      </div>
    );
  }

  // Métricas del Bento Grid
  const totalMonthlyCost = subscriptions.reduce((acc, sub) => acc + Number(sub.price || 0), 0);
  const activeCount = subscriptions.length;

  // Lista única de categorías
  const categories = [
    'ALL',
    ...Array.from(
      new Set(
        subscriptions
          .map((sub) => sub.category?.toUpperCase())
          .filter(Boolean) as string[]
      )
    ),
  ];

  // Filtro dinámico de suscripciones
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.category && sub.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' ||
      sub.category?.toUpperCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans selection:bg-zinc-800">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Top Navbar Header */}
        {/* <header className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950 font-bold">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">Subscrify</h1>
              <p className="text-xs text-zinc-400">{user?.email || 'Panel de control'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreateSubscriptionModal />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-xl"
              onClick={() => { logout(); router.push('/login'); }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </header> */}

        {/* Bento Grid: Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 space-y-2 backdrop-blur-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium uppercase tracking-wider">Gasto Mensual Total</span>
              <DollarSign className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-zinc-50">
              ${totalMonthlyCost.toFixed(2)} <span className="text-xs font-normal text-zinc-500">USD</span>
            </p>
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> Calculado sobre {activeCount} servicios
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 space-y-2 backdrop-blur-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium uppercase tracking-wider">Suscripciones Activas</span>
              <CreditCard className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-zinc-50">{activeCount}</p>
            <p className="text-xs text-zinc-500">Servicios contratados actualmente</p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 space-y-2 backdrop-blur-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium uppercase tracking-wider">Acción Rápida</span>
            </div>
            <p className="text-xs text-zinc-400">¿Agregaste un nuevo servicio recientemente?</p>
            <CreateSubscriptionModal />
          </div>
        </div>

        {/* Listado Principal con Filtros */}
        <div className="space-y-4 pt-2">
          {/* Header del listado con Búsqueda y Categorías */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-200">Mis Servicios</h2>
              <span className="text-xs text-zinc-500">{filteredSubscriptions.length} de {subscriptions.length}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Buscador */}
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <Input
                  placeholder="Buscar servicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 bg-zinc-900/60 border-zinc-800 text-xs text-zinc-100 rounded-xl placeholder:text-zinc-500 focus:border-zinc-700"
                />
              </div>

              {/* Categorías */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-zinc-100 text-zinc-950 font-semibold'
                        : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800/80 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    {cat === 'ALL' ? 'Todas' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Renderizado Condicional */}
          {loading && subscriptions.length === 0 ? (
            <div className="flex items-center justify-center py-16 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 text-zinc-500 text-sm">
              Cargando suscripciones...
            </div>
          ) : error ? (
            <div className="p-4 border border-red-500/20 bg-red-500/10 text-red-400 text-sm rounded-2xl">
              {error}
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 py-12 text-center space-y-3">
              <p className="text-sm text-zinc-500">No se encontraron suscripciones.</p>
              {subscriptions.length === 0 && <CreateSubscriptionModal />}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4 hover:border-zinc-700/80 hover:bg-zinc-900/80 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <SubscriptionIcon name={sub.name} category={sub.category} />
                      <div>
                        <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                          {sub.name}
                        </h3>
                        <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/40">
                          {sub.category || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Acciones flotantes en Hover (Editar / Eliminar) */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <EditSubscriptionModal subscription={sub} />
                      <DeleteSubscriptionDialog id={sub.id} name={sub.name} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/50 flex items-baseline justify-between">
                    <div>
                      <p className="text-2xl font-bold tracking-tight text-zinc-50">
                        ${sub.price}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {sub.currency} / {sub.billingPeriod?.toLowerCase()}
                      </p>
                    </div>

                    {sub.nextBillingDate && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">Próximo cobro</p>
                        <p className="text-xs font-medium text-zinc-300">
                          {new Date(sub.nextBillingDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}