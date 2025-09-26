import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  User, 
  Settings, 
  AlertTriangle,
  Activity,
  Map,
  ChevronRight
} from 'lucide-react';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useUserStore } from '@/store/useUserStore';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navigationItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, badge: null },
  { title: 'Map View', url: '/map', icon: Map, badge: 'New' },
  { title: 'Reports', url: '/reports', icon: FileText, badge: null },
  { title: 'Activity', url: '/activity', icon: Activity, badge: '12' },
  { title: 'Alerts', url: '/alerts', icon: AlertTriangle, badge: '3' },
];

const userItems = [
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useUserStore();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (url: string, e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      setOpenMobile(false);
      setTimeout(() => navigate(url), 220);
    }
  };

  return (
    <SidebarPrimitive className="w-64 border-r border-sidebar-border/60 bg-gradient-to-b from-sidebar-background to-sidebar-background/95 backdrop-blur-sm">
      <SidebarHeader className="p-6 border-b border-sidebar-border/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Sahaya
            </h2>
            <p className="text-xs text-sidebar-foreground/60">
              Issue Management
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isCurrentActive = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={cn(
                        "group relative h-11 rounded-lg transition-all duration-200 ease-in-out",
                        "hover:bg-sidebar-accent/50 hover:scale-[1.02] hover:shadow-sm",
                        isCurrentActive && "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm"
                      )}
                    >
                      <NavLink
                        to={item.url}
                        onClick={(e) => handleNavClick(item.url, e)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                          isCurrentActive 
                            ? "text-primary" 
                            : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon className={cn(
                          "h-4 w-4 transition-colors",
                          isCurrentActive ? "text-primary" : "text-sidebar-foreground/60"
                        )} />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className={cn(
                            "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full",
                            item.badge === 'New' 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                          )}>
                            {item.badge}
                          </span>
                        )}
                        {isCurrentActive && (
                          <ChevronRight className="h-3 w-3 text-primary/60" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider mb-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {userItems.map((item) => {
                const isCurrentActive = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={cn(
                        "group relative h-11 rounded-lg transition-all duration-200 ease-in-out",
                        "hover:bg-sidebar-accent/50 hover:scale-[1.02] hover:shadow-sm",
                        isCurrentActive && "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm"
                      )}
                    >
                      <NavLink
                        to={item.url}
                        onClick={(e) => handleNavClick(item.url, e)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                          isCurrentActive 
                            ? "text-primary" 
                            : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon className={cn(
                          "h-4 w-4 transition-colors",
                          isCurrentActive ? "text-primary" : "text-sidebar-foreground/60"
                        )} />
                        <span className="flex-1">{item.title}</span>
                        {isCurrentActive && (
                          <ChevronRight className="h-3 w-3 text-primary/60" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/40">
        {isAuthenticated && user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/30">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-medium">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.email || 'user@example.com'}
              </p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </SidebarPrimitive>
  );
};
