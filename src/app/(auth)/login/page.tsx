'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, PieChart, BellRing, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 -m-8 flex text-zinc-100 overflow-x-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 border-r border-zinc-800/60 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black overflow-hidden">
        
        {/* Glows sutiles de fondo */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold shadow-lg">
            <Sparkles className="w-5 h-5 fill-zinc-950" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Subscrify</span>
        </div>

        <div className="relative z-10 max-w-lg my-auto space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gestión inteligente impulsada por IA</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Bienvenido de nuevo a tu centro de control.
            </h1>
            <p className="text-zinc-400 text-sm xl:text-base leading-relaxed">
              Inicia sesión para revisar el estado de tus suscripciones, próximos pagos y recomendaciones de ahorro activas.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                <PieChart className="w-4 h-4" />
              </div>
              <span>Analítica y gráficos interactivos de consumo mensual.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 shrink-0">
                <BellRing className="w-4 h-4" />
              </div>
              <span>Calendario de pagos y alertas de renovación.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Asistente de IA para optimización y recomendación de planes.</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} Subscrify. Todos los derechos reservados.
        </div>
      </div>

      {/* LADO DERECHO: Formulario de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* Logo visible solo en mobile */}
          <div className="flex items-center gap-2 lg:hidden mb-6">
            <div className="h-9 w-9 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 fill-zinc-950" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Subscrify</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Iniciar Sesión
            </h2>
            <p className="text-xs text-zinc-400">
              Ingresa tu correo y contraseña para acceder a Subscrify
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-500/10 p-3.5 text-xs text-red-400 border border-red-500/20 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-zinc-300">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/80 border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-zinc-300">
                  Contraseña
                </Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/80 border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700 transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-zinc-400">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="font-semibold text-zinc-200 hover:text-white underline underline-offset-4">
                Regístrate gratis
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}