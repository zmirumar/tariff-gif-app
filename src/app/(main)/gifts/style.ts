import styled from 'styled-components';
import { Card, Button, Input, Table, Tag, Alert } from 'antd';
import { GiftOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, KeyOutlined } from '@ant-design/icons';

export const ActionCard = styled(Card)<{ $type?: 'info' | 'warning' | 'success' | 'error' }>`
  background: ${({ $type }) => {
    switch ($type) {
      case 'warning': return 'linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%)';
      case 'success': return 'linear-gradient(135deg, #f6ffed 0%, #f9fff0 100%)';
      case 'error': return 'linear-gradient(135deg, #fff2e8 0%, #fffaf6 100%)';
      default: return 'linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%)';
    }
  }} !important;
  border: 1px solid ${({ $type }) => {
    switch ($type) {
      case 'warning': return '#ffe58f';
      case 'success': return '#b7eb8f';
      case 'error': return '#ffbb96';
      default: return '#91d5ff';
    }
  }} !important;
  border-radius: 12px !important;
  margin-bottom: 32px !important;
  box-shadow: 0 4px 12px ${({ $type }) => {
    switch ($type) {
      case 'warning': return 'rgba(250, 173, 20, 0.08)';
      case 'success': return 'rgba(82, 196, 26, 0.08)';
      case 'error': return 'rgba(250, 84, 28, 0.08)';
      default: return 'rgba(22, 119, 255, 0.08)';
    }
  }} !important;

  .card-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    
    &.column {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }
  }

  .info-group {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .title {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: ${({ $type }) => {
      switch ($type) {
        case 'warning': return '#d46b08';
        case 'success': return '#277e00';
        case 'error': return '#ad2102';
        default: return '#0050b3';
      }
    }};
  }

  .description {
    margin: 0;
    color: #595959;
    font-size: 14px;
  }
`;

export const StyledGiftIcon = styled(GiftOutlined)<{ $type?: string }>`
  font-size: 32px;
  color: ${({ $type }) => ($type === 'success' ? '#52c41a' : '#1677ff')};
`;

export const StyledClockIcon = styled(ClockCircleOutlined)`
  font-size: 32px;
  color: #faad14;
`;

export const StyledCheckIcon = styled(CheckCircleOutlined)`
  font-size: 32px;
  color: #52c41a;
`;

export const StyledCloseIcon = styled(CloseCircleOutlined)`
  font-size: 32px;
  color: #fa541c;
`;

export const StyledKeyIcon = styled(KeyOutlined)`
  font-size: 32px;
  color: #1677ff;
`;

export const StyledButton = styled(Button)<{ $success?: boolean }>`
  border-radius: 8px !important;
  ${({ $success }) => $success && `
    background: #52c41a !important;
    border-color: #52c41a !important;
    color: #fff !important;
    &:hover {
      background: #73d13d !important;
      border-color: #73d13d !important;
    }
  `}
`;

export const CodeActivationArea = styled.div`
  display: flex;
  gap: 12px;
  max-width: 400px;
  margin-top: 4px;
`;

export const StyledInput = styled(Input)`
  border-radius: 8px !important;
  height: 40px !important;
`;

export const StyledSubmitButton = styled(Button)`
  border-radius: 8px !important;
  height: 40px !important;
  background: #1677ff !important;
  border-color: #1677ff !important;
`;

export const HistoryCard = styled(Card)`
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03) !important;
  
  .ant-card-head-title {
    font-size: 18px;
    font-weight: 600;
  }
`;

export const StyledTable = styled(Table)`
  overflow-x: auto;
  
  .tariff-name-cell {
    font-weight: 600;
    color: #1f2937;
    
    .anticon {
      margin-right: 8px;
      color: #1677ff;
    }
  }
`;

export const StyledTag = styled(Tag)`
  font-weight: 600 !important;
  padding: 4px 8px !important;
`;

export const CenteredSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0;
`;

export const StyledAlert = styled(Alert)`
  margin-bottom: 24px !important;
`;

export const SmallGiftIcon = styled(GiftOutlined)`
  color: #fff !important;
  font-size: 16px !important;
`;

export const TableCheckIcon = styled(CheckCircleOutlined)`
  font-size: 14px !important;
`;

export const TableCloseIcon = styled(CloseCircleOutlined)`
  font-size: 14px !important;
`;

export const KeyGrayIcon = styled(KeyOutlined)`
  color: #bfbfbf !important;
`;

