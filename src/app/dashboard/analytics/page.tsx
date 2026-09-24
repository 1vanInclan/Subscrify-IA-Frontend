'use client';

import { useEffect, useState } from 'react';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { PieChart as PieIcon, TrendingUp, DollarSign, Award, CreditCard } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#6366f1'];

export default function AnalyticsPage() {
  const { subscriptions, fetchSubscriptions, loading } = useSubscriptionStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500 text-sm font-medium">
        Cargando analítica...
      </div>
    );
  }

  // Cálculos de métricas
  const totalMonthlyCost = subscriptions.reduce((acc, sub) => acc + Number(sub.price || 0), 0);
  const totalAnnualCost = totalMonthlyCost * 12;
  const averageCost = subscriptions.length > 0 ? totalMonthlyCost / subscriptions.length : 0;

  // Servicio más costoso
  const mostExpensive = subscriptions.length > 0 
    ? [...subscriptions].sort((a, b) => Number(b.price) - Number(a.price))[0] 
    : null;

  // Agrupar y normalizar categorías para evitar duplicados por minúsculas/mayúsculas
  const categoryDataMap = subscriptions.reduce((acc, sub) => {
    const cat = (sub.category || 'General').trim().toUpperCase();
    acc[cat] = (acc[cat] || 0) + Number(sub.price || 0);
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryDataMap).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }));

  // Datos para el gráfico de barras por servicio
  const topServicesData = [...subscriptions]
    .sort((a, b) => Number(b.price) - Number(a.price))
    .map((sub) => ({
      name: sub.name,
      precio: Number(sub.price),
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">Gastos y Analítica</h1>
        <p className="text-xs text-zinc-400">Desglose financiero y proyección de tus suscripciones</p>
      </div>

      {/* Tarjetas Bento de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 space-y-2 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Proyección Anual</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-50">
            ${totalAnnualCost.toFixed(2)} <span className="text-xs font-normal text-zinc-500">USD/año</span>
          </p>
          <p className="text-xs text-zinc-500">Estimado manteniendo servicios actuales</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 space-y-2 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Costo Promedio</span>
            <DollarSign className="w-4 h-4 text-zinc-500" />
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-50">
            ${averageCost.toFixed(2)} <span className="text-xs font-normal text-zinc-500">USD</span>
          </p>
          <p className="text-xs text-zinc-500">Por suscripción contratada</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 space-y-2 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Mayor Gasto</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold tracking-tight text-zinc-50 truncate">
            {mostExpensive ? mostExpensive.name : 'N/A'}
          </p>
          <p className="text-xs text-zinc-400">
            {mostExpensive ? `$${mostExpensive.price} USD / mes` : 'Sin datos'}
          </p>
        </div>
      </div>

      {/* Secciones de Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* PieChart: Distribución por Categoría */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Gasto por Categoría</h2>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                  itemStyle={{ color: '#f4f4f5' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            {categoryChartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.name}:</span>
                <span className="font-semibold text-zinc-200">${entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BarChart: Comparativa de Servicios */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Top Servicios por Costo</h2>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topServicesData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" stroke="#52525b" fontSize={11} tickLine={false} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#a1a1aa" 
                  fontSize={11} 
                  tickLine={false} 
                  width={110} 
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                />
                <Bar dataKey="precio" fill="#f4f4f5" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}