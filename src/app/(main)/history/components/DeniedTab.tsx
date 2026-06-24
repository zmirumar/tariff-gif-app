'use client';

import { Empty } from 'antd';
import TariffCard from '@/components/TariffCard';
import type { IHistoryItem } from '@/types/interfaces';
import { PageGrid, PaddedEmpty } from '../style';

interface DeniedTabProps {
  items: IHistoryItem[];
}

export default function DeniedTab({ items }: DeniedTabProps) {
  if (items.length === 0) {
    return (
      <PaddedEmpty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No denied transactions found."
      />
    );
  }

  return (
    <PageGrid>
      {items.map((item) => {
        const description = item.type === 'gift_sent' 
          ? `Gift sent to ${item.recipient_telegram}${item.message ? `: "${item.message}"` : ''}`
          : item.type === 'gift_received'
            ? `Gift received from ${item.sender_telegram}${item.message ? `: "${item.message}"` : ''}`
            : 'Direct subscription purchase request rejected.';

        return (
          <TariffCard
            key={item.id}
            id={item.id}
            name={item.tariff_name}
            price={item.price}
            description={`${description} (Rejected: ${item.purchased_at})`}
            durationMonths={item.duration_months}
            isAdmin={true}
            status={item.status}
          />
        );
      })}
    </PageGrid>
  );
}
