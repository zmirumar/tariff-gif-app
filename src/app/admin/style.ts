import styled from 'styled-components';
import { Card, Space, Button, Input, Table, Tabs, Alert } from 'antd';
import { MailOutlined, GiftOutlined } from '@ant-design/icons';

export const AdminDashboardWrapper = styled.div`
  max-width: 960px;
`;

export const WideAdminDashboardWrapper = styled.div`
  max-width: 100%;
  width: 100%;
`;

export const AdminDashboardTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a2e;
`;

export const AdminDashboardText = styled.p`
  color: #666;
  font-size: 15px;
  line-height: 1.6;
`;

export const FlexHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const StyledTabs = styled(Tabs)`
  margin-bottom: 32px !important;
`;

export const FullWidthSpace = styled(Space)`
  width: 100%;
`;

export const DashboardCard = styled(Card)`
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03) !important;
`;

export const ConnectionOverview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`;

export const ConnectionItem = styled.div`
  flex: 1 1 250px;
`;

export const ConnectionLabel = styled.div`
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 4px;
`;

export const ConnectionValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .val-text {
    font-weight: 600;
    color: #1f2937;
  }
  
  .val-warn {
    color: #d46b08;
    font-style: italic;
    cursor: help;
  }
`;

export const StyledPasswordInput = styled(Input.Password)`
  border-radius: 8px !important;
`;

export const FormSubmitButton = styled(Button)`
  border-radius: 8px !important;
  min-width: 160px;
`;

export const AuditHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .subtext {
    color: #595959;
  }
`;

export const RawPayloadDetails = styled.pre`
  margin: 0;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
  overflow: auto;
  font-size: 12px;
`;

export const StyledAuditTable = styled(Table)`
  overflow-x: auto;
`;

export const StyledMailIcon = styled(MailOutlined)`
  margin-right: 6px;
  color: #8c8c8c;
`;

export const StyledGiftIcon = styled(GiftOutlined)`
  margin-right: 6px;
  color: #1677ff;
`;

export const ActivationCodeBadge = styled.code`
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #389e0d;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const SuccessButton = styled(Button)`
  background: #52c41a !important;
  border-color: #52c41a !important;
  color: #fff !important;
  &:hover {
    background: #73d13d !important;
    border-color: #73d13d !important;
  }
`;

export const RefreshButton = styled(Button)`
  border-radius: 8px !important;
`;

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0;
`;

export const StyledAlert = styled(Alert)`
  margin-bottom: 24px !important;
  border-radius: 8px !important;
`;


