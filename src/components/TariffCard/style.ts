import styled from 'styled-components';

export const TariffCardWrapper = styled.div<{
  $hasOnClick?: boolean;
  $status?: 'pending' | 'purchased' | 'admitted' | 'denied' | 'waiting_actions';
}>`
  background: #fff;
  border: ${({ $status }) => {
    if (!$status) return '1px solid #E5E7EB';
    switch ($status) {
      case 'admitted':
        return '2px solid #52c41a';
      case 'denied':
        return '2px solid #ff4d4f';
      case 'purchased':
        return '2px solid #1677ff';
      case 'pending':
        return '2px solid #faad14';
      case 'waiting_actions':
        return '2px solid #1890ff';
      default:
        return '1px solid #E5E7EB';
    }
  }};
  cursor: ${({ $hasOnClick }) => ($hasOnClick ? 'pointer' : 'default')};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    border-color: ${({ $status }) => ($status ? undefined : '#3B82F6')};
  }

  &.card--disabled {
    opacity: 0.65;
    filter: saturate(60%) contrast(95%);
    
    &:hover {
      transform: none;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      border-color: #E5E7EB;
    }
  }

  .card__status-wrapper {
    margin-bottom: 4px;

    .ant-tag {
      font-weight: 600;
      margin: 0;
    }
  }

  .card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .card__name {
    font-size: 18px;
    font-weight: 600;
    color: #1F2937;
    margin: 0;
    flex: 1;
  }

  .card__price {
    font-size: 18px;
    font-weight: 700;
    color: #10B981;
    white-space: nowrap;
  }

  .card__duration {
    font-size: 13px;
    font-weight: 500;
    color: #3B82F6;
    background: #EFF6FF;
    padding: 4px 10px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    align-self: flex-start;
  }

  .card__description {
    font-size: 14px;
    color: #4B5563;
    line-height: 1.4;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 58px;
  }

  .card__actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .card__buy-btn {
    flex: 1;
    background: #3B82F6;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;

    &:hover {
      background: #2563EB;
    }

    &:active {
      transform: scale(0.98);
    }

    &:disabled {
      background: #E5E7EB;
      color: #9CA3AF;
      border-color: #E5E7EB;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  .card__gift-btn {
    flex: 1;
    background: transparent;
    color: #10B981;
    border: 1.5px solid #10B981;
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;

    &:hover {
      background: rgba(16, 185, 129, 0.05);
      border-color: #059669;
      color: #059669;
    }

    &:active {
      transform: scale(0.98);
    }

    &:disabled {
      background: #F3F4F6;
      color: #9CA3AF;
      border: 1.5px solid #E5E7EB;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
`;
