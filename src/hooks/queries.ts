import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { ITariff, IHistoryItem } from '@/types/interfaces';

const supabase = createClient();

export const useTariffsQuery = () => {
  return useQuery<ITariff[]>({
    queryKey: ['tariffs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tariffs')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useAdminTariffsQuery = () => {
  return useQuery<ITariff[]>({
    queryKey: ['admin-tariffs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tariffs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
};

export const usePurchasesQuery = () => {
  return useQuery<IHistoryItem[]>({
    queryKey: ['purchases'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('gift_applications')
        .select('*, tariffs(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data ?? []).map((item: any) => {
        let mappedStatus: 'pending' | 'purchased' | 'admitted' | 'denied' | 'waiting_actions' = 'purchased';
        if (item.status === 'pending') {
          if (item.activation_code) {
            mappedStatus = 'waiting_actions';
          } else {
            mappedStatus = 'pending';
          }
        }
        else if (item.status === 'approved') {
          if (item.activation_code) {
            mappedStatus = 'admitted';
          } else {
            mappedStatus = 'purchased';
          }
        }
        else if (item.status === 'rejected') mappedStatus = 'denied';

        return {
          id: item.id,
          tariff_id: item.tariff_id,
          tariff_name: item.tariffs?.name || 'Unknown Tariff',
          price: Number(item.tariffs?.price || 0),
          duration_months: item.tariffs?.duration_months || 0,
          purchased_at: new Date(item.created_at).toLocaleString(),
          status: mappedStatus,
          type: 'purchase',
          activation_code: item.activation_code || undefined,
        };
      });
    },
  });
};

export const useAdminGiftsQuery = () => {
  return useQuery({
    queryKey: ['admin-gifts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gift_applications')
        .select('*, tariffs(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useBotSettingsQuery = () => {
  return useQuery({
    queryKey: ['bot-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bot_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

export const useAuditLogsQuery = () => {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
};



