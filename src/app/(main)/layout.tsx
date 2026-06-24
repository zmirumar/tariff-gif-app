import Sidebar from '@/components/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Sidebar variant="home">{children}</Sidebar>;
}
