'use client';

import { useState } from 'react';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateSubscriptionModal() {
  const [open, setOpen] = useState(false);
  const { createSubscription } = useSubscriptionStore();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingPeriod, setBillingPeriod] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [category, setCategory] = useState('STREAMING');
  const [nextBillingDate, setNextBillingDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createSubscription({
        name,
        price: parseFloat(price),
        currency: 'USD',
        billingPeriod,
        category,
        nextBillingDate,
      });
      setOpen(false);
      setName('');
      setPrice('');
    } catch (err) {
      // Manejado en el store
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'default' })}>
        + Nueva Suscripción
      </DialogTrigger>
      <DialogContent className="border-border bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Suscripción</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Servicio</Label>
            <Input
              id="name"
              placeholder="Ej: Netflix, Spotify..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="15.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Periodo</Label>
              <select
                id="period"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={billingPeriod}
                onChange={(e) => setBillingPeriod(e.target.value as 'MONTHLY' | 'YEARLY')}
              >
                <option value="MONTHLY">Mensual</option>
                <option value="YEARLY">Anual</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <select
                id="category"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="STREAMING">Streaming</option>
                <option value="SOFTWARE">Software</option>
                <option value="GAMING">Gaming</option>
                <option value="UTILITIES">Servicios</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextBillingDate">Próximo Cobro</Label>
            <Input
              id="nextBillingDate"
              type="date"
              value={nextBillingDate}
              onChange={(e) => setNextBillingDate(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Suscripción'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}