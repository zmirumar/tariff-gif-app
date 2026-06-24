'use client';

import React from 'react';
import { Tabs, Spin } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { usePurchasesQuery } from '@/hooks/queries';
import PurchasedTab from './components/PurchasedTab';
import AdmittedTab from './components/AdmittedTab';
import DeniedTab from './components/DeniedTab';
import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  StyledCheckCircleOutlined,
  StyledCloseCircleOutlined,
  SpinnerWrapper,
  StyledAlert
} from './style';

export default function HistoryPage() {
  const { data: purchases = [], isLoading, error } = usePurchasesQuery();

  const purchasedItems = purchases.filter((i) => i.status === 'purchased' || i.status === 'pending' || i.status === 'waiting_actions');
  const admittedItems = purchases.filter((i) => i.status === 'admitted');
  const deniedItems = purchases.filter((i) => i.status === 'denied');

  const tabItems = [
    {
      key: 'purchased',
      label: (
        <span>
          <ShoppingCartOutlined />
          Purchased ({purchasedItems.length})
        </span>
      ),
      children: <PurchasedTab items={purchasedItems} />,
    },
    {
      key: 'admitted',
      label: (
        <span>
          <StyledCheckCircleOutlined />
          Admitted ({admittedItems.length})
        </span>
      ),
      children: <AdmittedTab items={admittedItems} />,
    },
    {
      key: 'denied',
      label: (
        <span>
          <StyledCloseCircleOutlined />
          Denied ({deniedItems.length})
        </span>
      ),
      children: <DeniedTab items={deniedItems} />,
    },
  ];

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Transaction History</PageTitle>
        <PageSubtitle>
          Track your direct purchases, received gifts, and check whether they are approved or rejected.
        </PageSubtitle>
      </PageHeader>

      {isLoading ? (
        <SpinnerWrapper>
          <Spin size="large" tip="Loading transaction history..." />
        </SpinnerWrapper>
      ) : error ? (
        <StyledAlert
          title="Error"
          description={(error as Error).message || "Failed to load transaction history."}
          type="error"
          showIcon
        />
      ) : (
        <Tabs 
          defaultActiveKey="purchased" 
          items={tabItems} 
          className="history-tabs"
          size="large"
        />
      )}
    </PageWrapper>
  );
}

