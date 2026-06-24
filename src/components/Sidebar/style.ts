import styled from 'styled-components';
import { Layout } from 'antd';

const { Sider } = Layout;

export const LayoutContainer = styled(Layout)`
  min-height: 100vh;
`;

export const SidebarContainer = styled(Sider)`
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 100;
  background: linear-gradient(180deg, #001529 0%, #002140 100%) !important;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);

  .sidebar {
    &__inner {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    &__logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      overflow: hidden;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      cursor: pointer;
      user-select: none;
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      white-space: nowrap;
      letter-spacing: -0.02em;
      gap: 10px;

      &.collapsed {
        font-size: 18px;
        padding: 0 8px;
      }

      .logo-icon {
        font-size: 24px;
        display: flex;
        align-items: center;

        &.admin {
          color: #1677ff;
        }

        &.home {
          color: #52c41a;
        }
      }
    }

    &__collapse-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 40px;
      padding: 0;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.55);
      font-size: 16px;
      cursor: pointer;
      transition: all 0.25s ease;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.04);
      }
    }

    &__menu {
      flex: 1;
      overflow-y: auto;
    }

    &__logout {
      display: flex;
      align-items: center;
      gap: 10px;
      width: calc(100% - 16px);
      margin: 8px;
      padding: 10px 20px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.55);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.25s ease;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      white-space: nowrap;
      overflow: hidden;

      .anticon {
        font-size: 16px;
        flex-shrink: 0;
      }

      &.collapsed {
        justify-content: center;
        padding: 10px 0;
      }

      &:hover {
        color: #ff4d4f;
        background: rgba(255, 77, 79, 0.08);
      }

      &:active {
        background: rgba(255, 77, 79, 0.15);
      }
    }
  }

  .ant-menu-dark {
    background: transparent !important;
    border-right: 0;
  }

  .ant-menu-dark .ant-menu-item {
    margin: 4px 8px;
    border-radius: 8px;
    transition: all 0.25s ease;
  }

  .ant-menu-dark .ant-menu-item:hover {
    background: rgba(255, 255, 255, 0.08) !important;
  }

  .ant-menu-dark .ant-menu-item-selected {
    background: linear-gradient(135deg, #1677ff 0%, #4096ff 100%) !important;
    box-shadow: 0 2px 8px rgba(22, 119, 255, 0.35);
  }

  .ant-menu-dark .ant-menu-sub {
    background: rgba(0, 0, 0, 0.15) !important;
    border-radius: 8px;
    margin: 0 8px;
  }

  .ant-menu-dark .ant-menu-submenu-title {
    margin: 4px 8px;
    border-radius: 8px;
    transition: all 0.25s ease;
  }

  .ant-menu-dark .ant-menu-submenu-title:hover {
    background: rgba(255, 255, 255, 0.08) !important;
  }
`;

export const ContentContainer = styled.div`
  padding: 24px;
  margin: 0;
  min-height: 280px;
  flex: 1;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;
