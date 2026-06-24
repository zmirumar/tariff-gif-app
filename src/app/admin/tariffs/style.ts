import styled from 'styled-components';
import { Empty, InputNumber, Form, Button } from 'antd';
import { TagsOutlined, EditOutlined } from '@ant-design/icons';

export const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 0 48px 0;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderLeft = styled.div``;

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

export const CenteredSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 80px 0;
`;

export const StyledEmpty = styled(Empty)`
  margin-top: 60px !important;
`;

export const ModalTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
`;

export const StyledTagsIcon = styled(TagsOutlined)`
  color: #1677ff;
`;

export const StyledEditIcon = styled(EditOutlined)`
  color: #1677ff;
`;

export const FullWidthInputNumber = styled(InputNumber)`
  width: 100% !important;
`;

export const FormFooterItem = styled(Form.Item)`
  margin-bottom: 0 !important;
  text-align: right;
`;

export const ModalFooterFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CancelButton = styled(Button)`
  margin-right: 8px !important;
`;

