'use client';

import { useState } from 'react';
import { Subscription } from '@/types';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditSubscriptionModalProps {
  subscription: Subscription;
}

export function EditSubscriptionModal({ subscription }: EditSubscriptionModalProps) {
  const [open, setOpen] = useState(false);
  const { updateSubscription, loading } = useSubscriptionStore();

  const [form, setForm] = useState({
    name: subscription.name,
    price: subscription.price,
    category: subscription.category || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSubscription(subscription.id, {
        name: form.name,
        price: Number(form.price),
        category: form.category,
      });
      toast.success(`Suscripción "${form.name}" actualizada`);
      setOpen(false);
    } catch {
      toast.error('Error al actualizar la suscripción');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight text-zinc-100">
            Editar Suscripción
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-medium text-zinc-400">Nombre del Servicio</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-zinc-100 mt-1.5 focus:border-zinc-700 rounded-xl"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-400">Precio</label>
              <Input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 mt-1.5 focus:border-zinc-700 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Categoría</label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 mt-1.5 focus:border-zinc-700 rounded-xl"
                placeholder="Ej. STREAMING"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-medium rounded-xl"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}