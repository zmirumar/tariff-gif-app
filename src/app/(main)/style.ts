import styled from 'styled-components';
import { ShoppingCartOutlined } from '@ant-design/icons';

export const HomeWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 0 48px 0;

  .home__header {
    margin-bottom: 32px;
  }

  .home__title {
    font-size: 28px;
    font-weight: 700;
    color: #1F2937;
    margin: 0 0 8px 0;
  }

  .home__subtitle {
    font-size: 15px;
    color: #4B5563;
    line-height: 1.6;
    margin: 0;
  }

  .home__section-title {
    font-size: 20px;
    font-weight: 600;
    color: #1F2937;
    margin: 40px 0 20px 0;
    border-bottom: 2px solid #EFF6FF;
    padding-bottom: 12px;
  }

  .home__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    align-items: stretch;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
`;

export const CenteredSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

export const StyledShoppingCartIcon = styled(ShoppingCartOutlined)`
  color: #1677ff;
`;

