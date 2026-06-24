'use client';

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { homeMenuItems } from '../layout/menuConfig/homeMenu';
import { adminMenuItems } from '../layout/menuConfig/adminMenu';
import { SidebarContainer, ContentContainer, LayoutContainer } from './style';

const { Content } = Layout;

interface SidebarProps {
  variant: 'home' | 'admin';
  children: React.ReactNode;
}

export default function Sidebar({ variant, children }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const isAdmin = variant === 'admin';
  const menuItems = isAdmin ? adminMenuItems : homeMenuItems;
  const logoText = isAdmin ? 'Admin Panel' : 'Tariff & Gifts';
  const logoutRedirect = isAdmin ? '/login/admin' : '/login';

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(logoutRedirect);
    router.refresh();
  };

  return (
    <LayoutContainer>
      <SidebarContainer
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={260}
        collapsedWidth={80}
        theme="dark"
      >
        <div className="sidebar__inner">
          <div className={`sidebar__logo${collapsed ? ' collapsed' : ''}`}>
            <span className={`logo-icon ${isAdmin ? 'admin' : 'home'}`}>
              <GiftOutlined />
            </span>
            {!collapsed && <span>{logoText}</span>}
          </div>

          <button
            className="sidebar__collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>

          <div className="sidebar__menu">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[pathname]}
              openKeys={openKeys}
              onOpenChange={setOpenKeys}
              onClick={({ key }) => router.push(key)}
              items={menuItems}
            />
          </div>

          <button
            className={`sidebar__logout${collapsed ? ' collapsed' : ''}`}
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogoutOutlined />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </SidebarContainer>

      <Layout>
        <Content>
          <ContentContainer>{children}</ContentContainer>
        </Content>
      </Layout>
    </LayoutContainer>
  );
}
