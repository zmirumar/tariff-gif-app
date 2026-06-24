import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { ITariff } from '@/types/interfaces';
import { buyTariffDirectly } from '@/app/actions/applyActions';

const supabase = createClient();

export const useCreateTariffMutation = (options?: {
  onSuccess?: (data: ITariff) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTariff: Omit<ITariff, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('tariffs')
        .insert(newTariff)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tariffs'] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: any) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

export const useUpdateTariffMutation = (options?: {
  onSuccess?: (data: ITariff) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, tariff }: { id: string; tariff: Partial<Omit<ITariff, 'id' | 'created_at'>> }) => {
      const { data, error } = await supabase
        .from('tariffs')
        .update(tariff)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tariffs'] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: any) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

export const useDeleteTariffMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tariffs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tariffs'] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error: any) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

export const usePurchaseTariffMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchase: {
      tariff_id: string;
      tariff_name: string;
      price: number;
      duration_months: number;
      type: 'purchase' | 'gift_sent' | 'gift_received';
      recipient_telegram?: string;
      sender_telegram?: string;
      message?: string;
    }) => {
      const res = await buyTariffDirectly(purchase.tariff_id, purchase.tariff_name);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error: any) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};


