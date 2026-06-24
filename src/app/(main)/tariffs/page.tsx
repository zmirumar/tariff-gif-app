'use client';

import React, { useEffect } from 'react';
import { notification, Spin } from 'antd';
import { useTariffsQuery, usePurchasesQuery } from '@/hooks/queries';
import { usePurchaseTariffMutation } from '@/hooks/mutations';
import TariffCard from '@/components/TariffCard';
import { 
  PageWrapper, 
  PageHeader, 
  PageTitle, 
  PageSubtitle, 
  PageGrid, 
  CenteredSpinner, 
  StyledShoppingCartIcon, 
  StyledEmpty 
} from './style';
import { submitGiftApplication } from '@/app/actions/applyActions';

export default function Tariffs() {
  const [api, contextHolder] = notification.useNotification();

  const { data: tariffs = [], isLoading: tariffsLoading, error } = useTariffsQuery();
  const { data: purchases = [], isLoading: purchasesLoading } = usePurchasesQuery();
  const isLoading = tariffsLoading || purchasesLoading;

  const purchaseMutation = usePurchaseTariffMutation({
    onSuccess: () => {
      api.success({
        message: 'Order Placed Successfully!',
        description: 'Your purchase has been saved to your History page.',
        placement: 'topRight',
        icon: <StyledShoppingCartIcon />,
      });
    },
    onError: (err) => {
      api.error({
        message: 'Transaction Failed',
        description: err.message,
        placement: 'topRight',
      });
    }
  });

  useEffect(() => {
    if (error) {
      api.error({ message: 'Failed to load tariffs', description: error.message });
    }
  }, [error, api]);

  const handleBuy = (id: string) => {
    const tariff = tariffs.find((t) => t.id === id);
    if (!tariff) return;

    purchaseMutation.mutate({
      tariff_id: tariff.id,
      tariff_name: tariff.name,
      price: tariff.price,
      duration_months: tariff.duration_months,
      type: 'purchase'
    });
  };

  const handleGiftClick = async (id: string) => {
    const tariff = tariffs.find((t) => t.id === id);
    if (!tariff) return;

    api.open({
      key: 'apply-gift',
      type: 'info',
      message: 'Submitting Request...',
      description: `Sending gift request for ${tariff.name} to our admin.`,
      duration: 0,
    });

    try {
      const res = await submitGiftApplication(tariff.id, tariff.name);
      if (res.success) {
        api.open({
          key: 'apply-gift',
          type: 'success',
          message: 'Request Submitted!',
          description: res.message,
          duration: 4.5,
        });
      } else {
        api.open({
          key: 'apply-gift',
          type: 'error',
          message: 'Submission Failed',
          description: res.message,
          duration: 4.5,
        });
      }
    } catch (err: any) {
      api.open({
        key: 'apply-gift',
        type: 'error',
        message: 'Submission Error',
        description: err.message || 'An unexpected error occurred.',
        duration: 4.5,
      });
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <CenteredSpinner>
          <Spin size="large" />
        </CenteredSpinner>
      </PageWrapper>
    );
  }

  const hasAnyPending = purchases.some((p) => p.status === 'pending');

  return (
    <PageWrapper>
      {contextHolder}
      
      <PageHeader>
        <PageTitle>Available Tariffs</PageTitle>
        <PageSubtitle>
          Browse our plans, choose to purchase, or send them as gifts.
        </PageSubtitle>
      </PageHeader>

      {tariffs.length === 0 ? (
        <StyledEmpty description="No tariffs available yet" />
      ) : (
        <PageGrid>
          {tariffs.map((tariff) => {
            const matchingPurchase = purchases.find((p) => p.tariff_id === tariff.id);
            const statusToShow = (matchingPurchase?.status === 'pending' || matchingPurchase?.status === 'purchased')
              ? matchingPurchase.status
              : undefined;

            return (
              <TariffCard
                key={tariff.id}
                id={tariff.id}
                name={tariff.name}
                price={tariff.price}
                description={tariff.description}
                durationMonths={tariff.duration_months}
                status={statusToShow}
                disableGift={hasAnyPending}
                onBuy={handleBuy}
                onGift={handleGiftClick}
              />
            );
          })}
        </PageGrid>
      )}
    </PageWrapper>
  );
}
