import { create } from 'zustand';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Subscription, CreateSubscriptionDto, UpdateSubscriptionDto } from '@/types';

interface SubscriptionState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  fetchSubscriptions: () => Promise<void>;
  createSubscription: (data: CreateSubscriptionDto) => Promise<void>;
  updateSubscription: (id: string, data: UpdateSubscriptionDto) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
}

// Obtiene las cabeceras con el token activo en memoria
const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  loading: false,
  error: null,

  fetchSubscriptions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/subscriptions', getAuthHeaders());
      set({ subscriptions: response.data, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Error al obtener suscripciones',
        loading: false,
      });
    }
  },

  createSubscription: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/subscriptions', data, getAuthHeaders());
      set({
        subscriptions: [...get().subscriptions, response.data],
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Error al crear suscripción',
        loading: false,
      });
      throw err;
    }
  },

  updateSubscription: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/subscriptions/${id}`, data, getAuthHeaders());
      set({
        subscriptions: get().subscriptions.map((sub) =>
          sub.id === id ? response.data : sub
        ),
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Error al actualizar suscripción',
        loading: false,
      });
      throw err;
    }
  },

  deleteSubscription: async (id) => {
    try {
      await api.delete(`/subscriptions/${id}`, getAuthHeaders());
      set({
        subscriptions: get().subscriptions.filter((sub) => sub.id !== id),
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Error al eliminar suscripción' });
      throw err;
    }
  },
}));