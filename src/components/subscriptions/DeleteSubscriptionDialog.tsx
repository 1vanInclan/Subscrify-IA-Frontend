'use client';

import { useState } from 'react';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteSubscriptionDialogProps {
  id: string;
  name: string;
}

export function DeleteSubscriptionDialog({ id, name }: DeleteSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const { deleteSubscription } = useSubscriptionStore();

  const handleDelete = async () => {
    try {
      await deleteSubscription(id);
      toast.success(`Suscripción "${name}" eliminada correctamente`);
      setOpen(false);
    } catch {
      toast.error(`Error al eliminar la suscripción "${name}"`);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar {name}?</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Esta acción no se puede deshacer. Se eliminará el registro de esta suscripción permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700 hover:text-white rounded-xl">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700 rounded-xl"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}