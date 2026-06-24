'use client';

import React, { useState } from 'react';
import { Empty, notification, Spin } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { usePurchasesQuery } from '@/hooks/queries';
import Link from 'next/link';
import { activateGiftWithCode } from '@/app/actions/applyActions';
import { useQueryClient } from '@tanstack/react-query';
import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle
} from '../history/style';
import {
  ActionCard,
  StyledGiftIcon,
  StyledClockIcon,
  StyledKeyIcon,
  StyledButton,
  CodeActivationArea,
  StyledInput,
  StyledSubmitButton,
  HistoryCard,
  StyledTable,
  StyledTag,
  CenteredSpinner,
  StyledAlert,
  SmallGiftIcon,
  TableCheckIcon,
  TableCloseIcon,
  KeyGrayIcon
} from './style';

export default function GiftsPage() {
  const { data: applications = [], isLoading, error } = usePurchasesQuery();
  const [activationCodeInput, setActivationCodeInput] = useState('');
  const [activating, setActivating] = useState(false);
  const queryClient = useQueryClient();

  const latestApp = applications[0];

  const handleActivateCode = async () => {
    if (!activationCodeInput.trim()) {
      notification.error({
        message: 'Error',
        description: 'Please enter the activation code sent to your email.',
        placement: 'topRight'
      });
      return;
    }
    setActivating(true);
    try {
      const res = await activateGiftWithCode(latestApp.id, activationCodeInput.trim());
      if (res.success) {
        notification.success({
          message: 'Gift Activated!',
          description: res.message,
          placement: 'topRight'
        });
        setActivationCodeInput('');
        queryClient.invalidateQueries({ queryKey: ['purchases'] });
      } else {
        notification.error({
          message: 'Activation Failed',
          description: res.message,
          placement: 'topRight'
        });
      }
    } catch (err: any) {
      notification.error({
        message: 'System Error',
        description: err.message || 'Failed to activate the gift.',
        placement: 'topRight'
      });
    } finally {
      setActivating(false);
    }
  };

  const columns = [
    {
      title: 'Tariff / Gift Name',
      dataIndex: 'tariff_name',
      key: 'tariff_name',
      render: (text: string) => (
        <span className="tariff-name-cell">
          <StyledGiftIcon />
          {text}
        </span>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration_months',
      key: 'duration_months',
      render: (months: number) => `${months} ${months === 1 ? 'Month' : 'Months'}`,
    },
    {
      title: 'Applied On',
      dataIndex: 'purchased_at',
      key: 'purchased_at',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        switch (status) {
          case 'pending':
            return (
              <StyledTag color="warning" icon={<ClockCircleOutlined />}>
                PENDING
              </StyledTag>
            );
          case 'waiting_actions':
            return (
              <StyledTag color="processing" icon={<ClockCircleOutlined />}>
                WAITING ACTION
              </StyledTag>
            );
          case 'admitted':
            return (
              <StyledTag color="success" icon={<TableCheckIcon />}>
                APPROVED
              </StyledTag>
            );
          case 'denied':
            return (
              <StyledTag color="error" icon={<TableCloseIcon />}>
                REJECTED
              </StyledTag>
            );
          default:
            return (
              <StyledTag color="default">
                UNKNOWN
              </StyledTag>
            );
        }
      },
    },
  ];

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>My Gifts</PageTitle>
        <PageSubtitle>
          Track the status of your gift applications. You can only have one active request at a time.
        </PageSubtitle>
      </PageHeader>

      {isLoading ? (
        <CenteredSpinner>
          <Spin size="large" tip="Loading gift applications..." />
        </CenteredSpinner>
      ) : error ? (
        <StyledAlert
          message="Error"
          description={(error as Error).message || "Failed to load gift applications."}
          type="error"
          showIcon
        />
      ) : (
        <>
          {!latestApp ? (
            <ActionCard $type="info">
              <div className="card-container">
                <div className="info-group">
                  <StyledGiftIcon />
                  <div>
                    <h3 className="title">Ready for a Gift?</h3>
                    <p className="description">
                      You currently have no active or pending gift requests. You can apply for a subscription.
                    </p>
                  </div>
                </div>
                <Link href="/tariffs">
                  <StyledButton type="primary" size="large" icon={<SmallGiftIcon />}>
                    Apply for Gift
                  </StyledButton>
                </Link>
              </div>
            </ActionCard>
          ) : latestApp.status === 'pending' ? (
            <ActionCard $type="warning">
              <div className="info-group">
                <StyledClockIcon />
                <div>
                  <h3 className="title">Application Pending Approval</h3>
                  <p className="description">
                    You have requested a gift subscription for <strong>{latestApp.tariff_name}</strong>. 
                    Please wait until our administrator approves or rejects this application before submitting another one.
                  </p>
                </div>
              </div>
            </ActionCard>
          ) : latestApp.status === 'waiting_actions' ? (
            <ActionCard $type="info">
              <div className="card-container column">
                <div className="info-group">
                  <StyledKeyIcon />
                  <div>
                    <h3 className="title">Action Required: Enter Activation Code</h3>
                    <p className="description">
                      Your gift request for <strong>{latestApp.tariff_name}</strong> was approved! 
                      An activation code has been sent to your email. Please enter it below to activate your subscription.
                    </p>
                  </div>
                </div>
                
                <CodeActivationArea>
                  <StyledInput
                    placeholder="Enter activation code (e.g. GIFT-XXXXXX)"
                    value={activationCodeInput}
                    onChange={(e) => setActivationCodeInput(e.target.value)}
                    prefix={<KeyGrayIcon />}
                    disabled={activating}
                  />
                  <StyledSubmitButton
                    type="primary"
                    onClick={handleActivateCode}
                    loading={activating}
                    disabled={activating}
                  >
                    Activate
                  </StyledSubmitButton>
                </CodeActivationArea>
              </div>
            </ActionCard>
          ) : latestApp.status === 'admitted' ? (
            <ActionCard $type="success">
              <div className="card-container">
                <div className="info-group">
                  <TableCheckIcon style={{ fontSize: '32px', color: '#52c41a' }} />
                  <div>
                    <h3 className="title">Latest Application Approved!</h3>
                    <p className="description">
                      Your latest request for <strong>{latestApp.tariff_name}</strong> was approved. 
                      An activation code has been generated and sent to your email. You are welcome to request another gift!
                    </p>
                  </div>
                </div>
                <Link href="/tariffs">
                  <StyledButton $success type="primary" size="large" icon={<SmallGiftIcon />}>
                    Request Another
                  </StyledButton>
                </Link>
              </div>
            </ActionCard>
          ) : (
            <ActionCard $type="error">
              <div className="card-container">
                <div className="info-group">
                  <TableCloseIcon style={{ fontSize: '32px', color: '#fa541c' }} />
                  <div>
                    <h3 className="title">Latest Application Rejected</h3>
                    <p className="description">
                      Your latest request for <strong>{latestApp.tariff_name}</strong> was rejected by the admin. 
                      You can submit a new application.
                    </p>
                  </div>
                </div>
                <Link href="/tariffs">
                  <StyledButton type="primary" size="large" icon={<SmallGiftIcon />}>
                    Apply Again
                  </StyledButton>
                </Link>
              </div>
            </ActionCard>
          )}

          <HistoryCard title="Application History">
            {applications.length === 0 ? (
              <Empty 
                description="No gift applications found. Go to the Tariffs page to apply."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <StyledTable
                dataSource={applications}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            )}
          </HistoryCard>
        </>
      )}
    </PageWrapper>
  );
}
