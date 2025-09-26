import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Plus, Map, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { title: 'Home', url: '/', icon: LayoutDashboard },
  { title: 'Map', url: '/map', icon: Map },
  { title: 'Report', url: '/create-report', icon: Plus, isSpecial: true },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'Profile', url: '/profile', icon: User },
];

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t h-16 flex items-center justify-around px-2 md:hidden">
      {navigationItems.map((item) => {
        if (item.isSpecial) {
          return (
            <NavLink key={item.title} to={item.url} className="flex-1 flex justify-center">
              <Button size="icon" className="h-12 w-12 rounded-full">
                <item.icon className="h-6 w-6" />
              </Button>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};