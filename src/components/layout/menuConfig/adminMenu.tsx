import {
  DashboardOutlined,
  GiftOutlined,
  TagsOutlined,
} from '@ant-design/icons';

export const adminMenuItems: any[] = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/admin/tariffs',
    icon: <TagsOutlined />,
    label: 'Tariffs',
  },
  {
    key: '/admin/gifts',
    icon: <GiftOutlined />,
    label: 'Gifts',
  },

];
