import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

export const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background-color: #F0F4F8; /* Clean light blue-gray background */
`;

export const LoginCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 40px 32px;
  background-color: #FFFFFF; /* Pure white card */
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

export const LoginIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  background-color: #3B82F6; /* Primary blue */
  border-radius: 16px;
  font-size: 28px;
  color: #FFFFFF;
  animation: ${float} 3s ease-in-out infinite;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
`;

export const LoginTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1E3A8A; /* Dark blue */
  margin-bottom: 8px;
`;

export const LoginSubtitle = styled.p`
  font-size: 14px;
  color: #4B5563; /* Medium gray */
  margin-bottom: 32px;
  line-height: 1.5;
`;

export const GoogleButton = styled.div`
  .ant-btn {
    width: 100%;
    height: 48px;
    font-size: 15px;
    font-weight: 600;
    border-radius: 10px;
    border: 1px solid #D1D5DB;
    background-color: #FFFFFF;
    color: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease-in-out;

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

export const LoginFooter = styled.div`
  margin-top: 32px;
  font-size: 12px;
  color: #9CA3AF;
  line-height: 1.5;
`;