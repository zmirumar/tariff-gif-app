import styled from 'styled-components';

export const AdminLoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background-color: #F0F4F8;
`;

export const AdminLoginCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 40px 32px;
  background-color: #FFFFFF; 
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

export const AdminBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #EFF6FF; 
  border: 1px solid #BFDBFE;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: #2563EB;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 24px;
`;

export const AdminTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1E3A8A; 
  margin-bottom: 6px;
`;

export const AdminSubtitle = styled.p`
  font-size: 14px;
  color: #4B5563; 
  margin-bottom: 28px;
`;

export const FormArea = styled.div`
  text-align: left;

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-form-item-label > label {
    color: #374151; 
    font-size: 13px;
    font-weight: 500;
  }

  .ant-input,
  .ant-input-password {
    height: 42px;
    background-color: #FFFFFF;
    border: 1px solid #D1D5DB;
    border-radius: 8px;
    color: #1F2937;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      border-color: #9CA3AF;
    }

    &:focus,
    &.ant-input-focused {
      border-color: #3B82F6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
      color: #9CA3AF;
    }
  }

  .ant-input-password .ant-input {
    background-color: transparent;
    border: none;
    box-shadow: none;
    height: 100%;
  }

  .ant-btn-primary {
    width: 100%;
    height: 44px;
    font-size: 15px;
    font-weight: 600;
    border-radius: 8px;
    background-color: #3B82F6; 
    border: none;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
    transition: all 0.2s ease;

    &:hover {
      background-color: #2563EB !important;
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.25) !important;
    }

    &:active {
      background-color: #1D4ED8 !important;
    }
  }
`;

export const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: #9CA3AF;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #E5E7EB;
  }
`;

export const GoogleButtonArea = styled.div`
  .ant-btn {
    width: 100%;
    height: 44px;
    font-size: 15px;
    font-weight: 500;
    border-radius: 8px;
    border: 1px solid #D1D5DB;
    background-color: #FFFFFF;
    color: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;

    &:hover {
      background-color: #F9FAFB !important;
      border-color: #3B82F6 !important;
      color: #3B82F6 !important;
    }

    &:active {
      background-color: #F3F4F6 !important;
    }

    .anticon {
      font-size: 18px;
    }
  }
`;