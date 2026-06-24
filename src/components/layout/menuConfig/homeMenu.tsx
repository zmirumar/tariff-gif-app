import {
  HomeOutlined,
  GiftOutlined,
  TagsOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
export const homeMenuItems: any[] = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'Home',
  },
  {
    key: '/tariffs',
    icon: <TagsOutlined />,
    label: 'Tariffs',
  },
  {
    key: '/gifts',
    icon: <GiftOutlined />,
    label: 'Gifts',
  },
  {
    key: '/history',
    icon: <HistoryOutlined />,
    label: 'History',
  },
];
