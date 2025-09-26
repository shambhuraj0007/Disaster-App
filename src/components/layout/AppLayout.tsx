import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useUserStore } from '@/store/useUserStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useUserStore();

  // Don't show navigation on auth pages
  const isAuthPage = location.pathname.includes('/auth');

  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main key={location.pathname} className="flex-1 overflow-auto pb-16 md:pb-0 animate-route-fade-in">
            {children}
          </main>
        </div>

        {/* Right Sidebar - Desktop Only */}
        <div className="hidden lg:block">
          <RightSidebar />
        </div>

        {/* Fixed Bottom Navigation - Mobile Only */}
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};