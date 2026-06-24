'use client';

import { CalendarOutlined, GiftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { TariffCardWrapper } from './style';

export interface TariffCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  durationMonths: number;
  isAdmin?: boolean;
  onBuy?: (id: string) => void;
  onGift?: (id: string) => void;
  onClick?: (id: string) => void;
  status?: 'pending' | 'purchased' | 'admitted' | 'denied' | 'waiting_actions';
  disableGift?: boolean;
}

export default function TariffCard({
  id,
  name,
  price,
  description,
  durationMonths,
  isAdmin = false,
  onBuy,
  onGift,
  onClick,
  status,
  disableGift = false,
}: TariffCardProps) {
  const getGiftButtonText = () => {
    switch (status) {
      case 'pending':
        return 'Applied';
      case 'admitted':
        return 'Approved';
      case 'purchased':
        return 'Purchased';
      case 'waiting_actions':
        return 'Code Sent';
      default:
        return 'Apply for Gift';
    }
  };

  const isGiftDisabled = status === 'pending' || status === 'admitted' || status === 'purchased' || status === 'waiting_actions' || disableGift;
  const isBuyDisabled = status === 'admitted' || status === 'purchased' || status === 'waiting_actions';

  return (
    <TariffCardWrapper 
      onClick={() => onClick?.(id)} 
      $hasOnClick={!!onClick}
      $status={status}
    >
      {status && (
        <div className="card__status-wrapper">
          {status === 'admitted' && <Tag color="success">APPROVED</Tag>}
          {status === 'denied' && <Tag color="error">REJECTED</Tag>}
          {status === 'purchased' && <Tag color="processing">PURCHASED</Tag>}
          {status === 'pending' && <Tag color="warning">PENDING</Tag>}
          {status === 'waiting_actions' && <Tag color="processing">WAITING ACTION</Tag>}
        </div>
      )}

      <div className="card__header">
        <h3 className="card__name">{name}</h3>
        <span className="card__price">
          ${price}
        </span>
      </div>

      <div className="card__duration">
        <CalendarOutlined />
        {durationMonths} {durationMonths === 1 ? 'month' : 'months'} active
      </div>

      <p className="card__description">{description}</p>

      {!isAdmin && (
        <div className="card__actions">
          <button 
            className="card__buy-btn" 
            onClick={(e) => { e.stopPropagation(); onBuy?.(id); }}
            disabled={isBuyDisabled}
          >
            <ShoppingCartOutlined />
            Buy
          </button>
          <button 
            className="card__gift-btn" 
            onClick={(e) => { e.stopPropagation(); onGift?.(id); }}
            disabled={isGiftDisabled}
          >
            <GiftOutlined />
            {getGiftButtonText()}
          </button>
        </div>
      )}
    </TariffCardWrapper>
  );
}

