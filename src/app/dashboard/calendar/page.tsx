'use client';

import { useEffect, useState } from 'react';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { CalendarDays, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function CalendarPage() {
  const { subscriptions, fetchSubscriptions, loading } = useSubscriptionStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500 text-sm font-medium">
        Cargando calendario...
      </div>
    );
  }

  // Helper para calcular días restantes hasta el próximo pago
  const getDaysUntilNextBilling = (billingDateStr: string) => {
    const today = new Date();
    const billingDate = new Date(billingDateStr);
    
    // Normalizar a día actual del mes en curso
    const nextPayment = new Date(today.getFullYear(), today.getMonth(), billingDate.getDate());
    
    // Si la fecha ya pasó este mes, calcular para el próximo mes
    if (nextPayment < today && today.getDate() !== billingDate.getDate()) {
      nextPayment.setMonth(nextPayment.getMonth() + 1);
    }

    const diffTime = nextPayment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 0 ? 0 : diffDays;
  };

  // Ordenar suscripciones por proximidad de fecha de pago
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    const daysA = getDaysUntilNextBilling(a.nextBillingDate || a.createdAt);
    const daysB = getDaysUntilNextBilling(b.nextBillingDate || b.createdAt);
    return daysA - daysB;
  });

  const upcomingSoonCount = sortedSubscriptions.filter(
    (sub) => getDaysUntilNextBilling(sub.nextBillingDate || sub.createdAt) <= 7
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">Calendario de Pagos</h1>
        <p className="text-xs text-zinc-400">Cronograma de cobros para el ciclo mensual actual</p>
      </div>

      {/* Banner de Estado Rápido */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">
              {upcomingSoonCount > 0
                ? `${upcomingSoonCount} ${upcomingSoonCount === 1 ? 'cobro próximo' : 'cobros próximos'} este ciclo`
                : 'Sin cobros inmediatos'}
            </h2>
            <p className="text-xs text-zinc-500">
              {upcomingSoonCount > 0
                ? 'Tienes pagos agendados en los próximos 7 días.'
                : 'Todos tus pagos están al día y distribuidos en el mes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Cronograma de Suscripciones */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-200">Línea de Tiempo de Cobros</h2>

        <div className="space-y-3">
          {sortedSubscriptions.map((sub) => {
            const daysLeft = getDaysUntilNextBilling(sub.nextBillingDate || sub.createdAt);
            const isUrgent = daysLeft <= 3;
            const isWarning = daysLeft > 3 && daysLeft <= 7;

            return (
              <div
                key={sub.id}
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/60 hover:bg-zinc-800/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-200">
                    {sub.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">{sub.name}</h3>
                    <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-semibold rounded-md bg-zinc-800 text-zinc-400">
                      {sub.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Badge de Días Restantes */}
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isUrgent ? (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      ) : isWarning ? (
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      <span
                        className={`text-xs font-semibold ${
                          isUrgent
                            ? 'text-amber-400'
                            : isWarning
                            ? 'text-blue-400'
                            : 'text-zinc-400'
                        }`}
                      >
                        {daysLeft === 0
                          ? 'Cobra Hoy'
                          : daysLeft === 1
                          ? 'Mañana'
                          : `En ${daysLeft} días`}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                      Cobro mensual
                    </p>
                  </div>

                  {/* Precio */}
                  <div className="text-right min-w-[70px]">
                    <p className="text-base font-extrabold text-zinc-100">
                      ${Number(sub.price).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-zinc-500 uppercase">USD</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}