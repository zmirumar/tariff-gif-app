export interface ITariff {
  id: string;
  name: string;
  description: string;
  duration_months: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface IHistoryItem {
  id: string;
  tariff_id?: string;
  tariff_name: string;
  price: number;
  duration_months: number;
  purchased_at: string;
  status: 'pending' | 'purchased' | 'admitted' | 'denied' | 'waiting_actions';
  type: 'purchase' | 'gift_sent' | 'gift_received';
  recipient_telegram?: string;
  sender_telegram?: string;
  message?: string;
  activation_code?: string;
}

