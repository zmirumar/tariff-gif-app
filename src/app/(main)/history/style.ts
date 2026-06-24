import styled from 'styled-components';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Alert, Empty } from 'antd';

export const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 0 48px 0;

  .history-tabs .ant-tabs-nav {
    margin-bottom: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .history-tabs .ant-tabs-tab {
    font-size: 15px;
    padding: 12px 16px;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .history-tabs .ant-tabs-tab-active {
    font-weight: 600;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 6px 0;
`;

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: #4B5563;
  margin: 0;
`;

export const PageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  align-items: stretch;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const StyledCheckCircleOutlined = styled(CheckCircleOutlined)`
  color: #52c41a;
`;

export const StyledCloseCircleOutlined = styled(CloseCircleOutlined)`
  color: #ff4d4f;
`;

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0;
`;

export const StyledAlert = styled(Alert)`
  margin-bottom: 24px !important;
`;

export const PaddedEmpty = styled(Empty)`
  padding: 40px 0 !important;
`;


