'use client';

import React, { useState } from 'react';
import { 
  Tag, 
  Spin, 
  Form, 
  Tooltip, 
  Badge, 
  notification,
  Collapse
} from 'antd';
import { 
  SettingOutlined, 
  HistoryOutlined, 
  SendOutlined, 
  MailOutlined, 
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SyncOutlined
} from '@ant-design/icons';
import { useBotSettingsQuery, useAuditLogsQuery } from '@/hooks/queries';
import { saveTelegramBotToken } from '@/app/actions/adminActions';
import { useQueryClient } from '@tanstack/react-query';
import {
  WideAdminDashboardWrapper,
  AdminDashboardTitle,
  AdminDashboardText,
  FlexHeader,
  StyledTabs,
  FullWidthSpace,
  DashboardCard,
  ConnectionOverview,
  ConnectionItem,
  ConnectionLabel,
  ConnectionValue,
  StyledPasswordInput,
  FormSubmitButton,
  AuditHeader,
  RawPayloadDetails,
  StyledAuditTable
} from './style';

const { Panel } = Collapse;

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data: botSettings, isLoading: isLoadingSettings, refetch: refetchSettings } = useBotSettingsQuery();
  const { data: auditLogs = [], isLoading: isLoadingLogs, refetch: refetchLogs } = useAuditLogsQuery();
  
  const [tokenInput, setTokenInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToken = async () => {
    if (!tokenInput.trim()) {
      notification.error({
        message: 'Validation Error',
        description: 'Please enter a valid Telegram Bot Token.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const origin = window.location.origin;
      const res = await saveTelegramBotToken(tokenInput, origin);
      if (res.success) {
        notification.success({
          message: 'Success',
          description: res.message,
          duration: 6,
        });
        setTokenInput('');
        refetchSettings();
      } else {
        notification.error({
          message: 'Configuration Error',
          description: res.message,
          duration: 6,
        });
      }
    } catch (err: any) {
      notification.error({
        message: 'System Error',
        description: err.message || 'An error occurred while saving the token.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getObscuredToken = (token?: string) => {
    if (!token) return 'Not Configured';
    if (token.length <= 15) return '••••••••••••';
    return `${token.substring(0, 6)}••••••••••••${token.substring(token.length - 6)}`;
  };

  const logColumns = [
    {
      title: 'Timestamp',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '200px',
      render: (dateStr: string) => new Date(dateStr).toLocaleString(),
    },
    {
      title: 'Action Type',
      dataIndex: 'action_type',
      key: 'action_type',
      width: '180px',
      render: (type: string) => {
        switch (type) {
          case 'telegram_notification':
            return <Tag color="blue" icon={<SendOutlined />}>TELEGRAM NOTIF</Tag>;
          case 'email_attempt':
            return <Tag color="purple" icon={<MailOutlined />}>EMAIL ATTEMPT</Tag>;
          case 'approval_action':
            return <Tag color="orange" icon={<UserOutlined />}>APPROVAL ACT</Tag>;
          default:
            return <Tag color="default">{type.toUpperCase()}</Tag>;
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '120px',
      render: (status: string) => {
        return status === 'success' ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>SUCCESS</Tag>
        ) : (
          <Tag color="error" icon={<CloseCircleOutlined />}>FAILED</Tag>
        );
      },
    },
    {
      title: 'Description',
      key: 'description',
      render: (record: any) => {
        const details = record.details || {};
        if (record.action_type === 'telegram_notification') {
          if (record.status === 'success') {
            return `Notified admin chat ID ${details.recipient || 'Unknown'}`;
          } else {
            return `Failed notification: ${details.error || 'Unknown Telegram Error'}`;
          }
        } else if (record.action_type === 'email_attempt') {
          if (record.status === 'success') {
            return `Sent activation code [${details.activation_code || 'N/A'}] for tariff "${details.tariff_name || 'N/A'}" to ${details.recipient}`;
          } else {
            return `Failed email to ${details.recipient || 'Unknown'}: ${details.error || 'SMTP Error'}`;
          }
        } else if (record.action_type === 'approval_action') {
          return `Admin ${details.action === 'approve' ? 'APPROVED' : 'REJECTED'} application ID ${details.application_id?.substring(0, 8)}...${details.activation_code ? ` (Generated Code: ${details.activation_code})` : ''}`;
        }
        return JSON.stringify(details);
      },
    },
  ];

  const items = [
    {
      key: 'bot-config',
      label: (
        <span>
          <SettingOutlined />
          Bot Configuration
        </span>
      ),
      children: (
        <FullWidthSpace direction="vertical" size="large">
          <DashboardCard title="Bot Connection Details">
            {isLoadingSettings ? (
              <Spin size="small" />
            ) : (
              <ConnectionOverview>
                <ConnectionItem>
                  <ConnectionLabel>BOT TOKEN STATUS</ConnectionLabel>
                  <ConnectionValue>
                    <Badge status={botSettings?.bot_token ? "success" : "default"} />
                    <span className="val-text">
                      {getObscuredToken(botSettings?.bot_token)}
                    </span>
                  </ConnectionValue>
                </ConnectionItem>

                <ConnectionItem>
                  <ConnectionLabel>ADMIN APPROVER CHAT ID</ConnectionLabel>
                  <ConnectionValue>
                    <Badge status={botSettings?.approver_telegram_id ? "success" : "warning"} />
                    <span className="val-text">
                      {botSettings?.approver_telegram_id || (
                        <Tooltip title="Admin must start the bot on Telegram to capture and link their chat ID.">
                          <span className="val-warn">
                            Waiting for admin start...
                          </span>
                        </Tooltip>
                      )}
                    </span>
                  </ConnectionValue>
                </ConnectionItem>
              </ConnectionOverview>
            )}
          </DashboardCard>

          <DashboardCard title="Connect Telegram Bot">
            <Form layout="vertical" onFinish={handleSaveToken}>
              <Form.Item 
                label="Telegram Bot Token" 
                required
                tooltip="Get the token from BotFather when creating your Telegram bot."
              >
                <StyledPasswordInput
                  placeholder="Paste your bot token here (e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ)"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <FormSubmitButton 
                  type="primary" 
                  htmlType="submit" 
                  loading={isSaving}
                  size="large"
                >
                  Save & Register Webhook
                </FormSubmitButton>
              </Form.Item>
            </Form>
          </DashboardCard>
        </FullWidthSpace>
      )
    },
    {
      key: 'audit-logs',
      label: (
        <span>
          <HistoryOutlined />
          Audit Logs
        </span>
      ),
      children: (
        <FullWidthSpace direction="vertical" size="middle">
          <AuditHeader>
            <span className="subtext">
              Detailed compliance log of all Telegram notifications and email attempts.
            </span>
            <FormSubmitButton 
              icon={<SyncOutlined spin={isLoadingLogs} />} 
              onClick={() => { refetchLogs(); refetchSettings(); }}
            >
              Refresh
            </FormSubmitButton>
          </AuditHeader>

          <DashboardCard>
            <StyledAuditTable
              dataSource={auditLogs}
              columns={logColumns}
              rowKey="id"
              loading={isLoadingLogs}
              pagination={{ pageSize: 10 }}
              expandable={{
                expandedRowRender: (record) => (
                  <Collapse ghost>
                    <Panel header="Raw Payload Details" key="1">
                      <RawPayloadDetails>
                        {JSON.stringify((record as any).details, null, 2)}
                      </RawPayloadDetails>
                    </Panel>
                  </Collapse>
                ),
                rowExpandable: (record) => !!(record as any).details,
              }}
            />
          </DashboardCard>
        </FullWidthSpace>
      )
    }
  ];

  return (
    <WideAdminDashboardWrapper>
      <FlexHeader>
        <div>
          <AdminDashboardTitle>Admin Control Center</AdminDashboardTitle>
          <AdminDashboardText>
            Configure systems, manage notifications, and review system actions.
          </AdminDashboardText>
        </div>
      </FlexHeader>

      <StyledTabs 
        defaultActiveKey="bot-config" 
        items={items} 
        size="large"
      />
    </WideAdminDashboardWrapper>
  );
}