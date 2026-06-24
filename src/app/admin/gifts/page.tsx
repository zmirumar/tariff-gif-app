'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { Tag, Button, Space, notification, Spin, Empty } from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined, 
  ClockCircleOutlined, 
  SyncOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { getAdminGiftApplications, adminApproveRejectGiftApplication } from '@/app/actions/adminActions';
import {
  WideAdminDashboardWrapper,
  AdminDashboardTitle,
  AdminDashboardText,
  DashboardCard,
  FlexHeader,
  StyledMailIcon,
  StyledGiftIcon,
  ActivationCodeBadge,
  SuccessButton,
  RefreshButton,
  SpinnerContainer,
  StyledAlert,
  StyledAuditTable
} from '../style';

interface IGiftApplication {
  id: string;
  user_id: string;
  email: string;
  tariff_id: string;
  tariff_name: string;
  price: number;
  duration_months: number;
  status: 'pending' | 'approved' | 'rejected' | 'code_sent';
  activation_code: string;
  created_at: string;
}

export default function AdminGiftsPage() {
  const [applications, setApplications] = useState<IGiftApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminGiftApplications();
      if (res.success && res.data) {
        setApplications(res.data as IGiftApplication[]);
      } else {
        setError(res.message || 'Failed to fetch gift applications.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    setProcessingId(id);
    startTransition(async () => {
      try {
        const res = await adminApproveRejectGiftApplication(id, action);
        if (res.success) {
          notification.success({
            message: 'Success',
            description: res.message,
          });
          await fetchApplications();
        } else {
          notification.error({
            message: 'Error',
            description: res.message,
          });
        }
      } catch (err: any) {
        notification.error({
          message: 'System Error',
          description: err.message || 'Failed to process application.',
        });
      } finally {
        setProcessingId(null);
      }
    });
  };

  const columns: any[] = [
    {
      title: 'User Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>
          <StyledMailIcon />
          {email}
        </span>
      ),
    },
    {
      title: 'Requested Gift / Tariff',
      dataIndex: 'tariff_name',
      key: 'tariff_name',
      render: (name: string, record: any) => (
        <span>
          <StyledGiftIcon />
          {name} (${record.price})
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
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        switch (status) {
          case 'pending':
            return <Tag color="warning" icon={<ClockCircleOutlined />}>PENDING</Tag>;
          case 'code_sent':
            return <Tag color="processing" icon={<CheckOutlined />}>CODE SENT</Tag>;
          case 'approved':
            return <Tag color="success" icon={<CheckOutlined />}>APPROVED</Tag>;
          case 'rejected':
            return <Tag color="error" icon={<CloseOutlined />}>REJECTED</Tag>;
          default:
            return <Tag>{status}</Tag>;
        }
      },
    },
    {
      title: 'Activation Code',
      dataIndex: 'activation_code',
      key: 'activation_code',
      render: (code: string) => {
        if (!code) return <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>N/A</span>;
        return (
          <ActivationCodeBadge>
            <KeyOutlined />
            {code}
          </ActivationCodeBadge>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => {
        if (record.status !== 'pending') return null;

        const isProcessing = processingId === record.id && isPending;

        return (
          <Space size="small">
            <SuccessButton
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleAction(record.id, 'approved')}
              disabled={isProcessing}
              loading={isProcessing && processingId === record.id}
            >
              Approve
            </SuccessButton>
            <Button
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleAction(record.id, 'rejected')}
              disabled={isProcessing}
              loading={isProcessing && processingId === record.id}
            >
              Reject
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <WideAdminDashboardWrapper>
      <FlexHeader>
        <div>
          <AdminDashboardTitle>Gift Requests</AdminDashboardTitle>
          <AdminDashboardText>
            Review and process user requests for gift subscriptions. Approving a request automatically generates an activation code and emails it to the user.
          </AdminDashboardText>
        </div>
        <RefreshButton 
          icon={<SyncOutlined spin={loading} />} 
          onClick={fetchApplications}
          size="large"
        >
          Refresh
        </RefreshButton>
      </FlexHeader>

      {error && (
        <StyledAlert
          message="Error Loading Applications"
          description={error}
          type="error"
          showIcon
        />
      )}

      <DashboardCard>
        {loading ? (
          <SpinnerContainer>
            <Spin size="large" tip="Loading gift applications..." />
          </SpinnerContainer>
        ) : applications.length === 0 ? (
          <Empty description="No gift applications found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <StyledAuditTable
            dataSource={applications}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </DashboardCard>
    </WideAdminDashboardWrapper>
  );
}
