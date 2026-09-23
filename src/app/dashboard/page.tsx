'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscrify</h1>
            <p className="text-muted-foreground">Panel de Control de Suscripciones</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </header>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>¡Bienvenido de vuelta!</CardTitle>
            <CardDescription>Sesión iniciada correctamente en el sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Usuario:</strong> {user?.email || 'Registrado'}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Estado del Token:</strong> Activo y guardado en LocalStorage
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}