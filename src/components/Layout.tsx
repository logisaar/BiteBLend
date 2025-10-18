import { ReactNode } from 'react';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import RegisterModal from './RegisterModal';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="pb-24 pt-4">
        {children}
      </main>
      <BottomNav />
      <RegisterModal />
    </div>
  );
}
