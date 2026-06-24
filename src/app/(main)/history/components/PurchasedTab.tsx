'use client';

import React from 'react';
import { Empty } from 'antd';
import TariffCard from '@/components/TariffCard';
import type { IHistoryItem } from '@/types/interfaces';
import { PageGrid, PaddedEmpty } from '../style';

interface PurchasedTabProps {
  items: IHistoryItem[];
}

export default function PurchasedTab({ items }: PurchasedTabProps) {
  if (items.length === 0) {
    return (
      <PaddedEmpty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No purchased transactions found."
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
            : 'Direct subscription purchase request.';

        return (
          <TariffCard
            key={item.id}
            id={item.id}
            name={item.tariff_name}
            price={item.price}
            description={`${description} (Ordered: ${item.purchased_at})`}
            durationMonths={item.duration_months}
            isAdmin={true}
            status={item.status}
          />
        );
      })}
    </PageGrid>
  );
}
