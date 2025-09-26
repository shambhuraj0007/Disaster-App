import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Shield,
  Activity,
  MapPin,
  Clock
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export const RightSidebar = () => {
  const { user, logout } = useUserStore();

  const mockNotifications = [
    {
      id: '1',
      title: 'New Report Verified',
      message: 'Your tsunami report has been verified by authorities',
      time: '2 min ago',
      type: 'success'
    },
    {
      id: '2',
      title: 'High Severity Alert',
      message: 'Cyclone warning issued for your area',
      time: '15 min ago',
      type: 'warning'
    },
    {
      id: '3',
      title: 'Report Update',
      message: 'Status changed for flood report #FR-2024-001',
      time: '1 hour ago',
      type: 'info'
    }
  ];

  const mockStats = {
    reportsSubmitted: 12,
    verified: 8,
    pending: 4,
    points: 240
  };

  return (
    <div className="w-80 bg-card border-l h-full flex flex-col">
      {/* Account Section */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{user?.name || 'User'}</h3>
            <p className="text-sm text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
            <Badge variant="outline" className="text-xs mt-1">
              {user?.role || 'Citizen'}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <User className="h-4 w-4" />
            Profile
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Quick Stats
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <div className="text-2xl font-bold text-primary">{mockStats.reportsSubmitted}</div>
            <div className="text-xs text-muted-foreground">Reports</div>
          </Card>
          <Card className="p-3">
            <div className="text-2xl font-bold text-green-600">{mockStats.verified}</div>
            <div className="text-xs text-muted-foreground">Verified</div>
          </Card>
          <Card className="p-3">
            <div className="text-2xl font-bold text-yellow-600">{mockStats.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </Card>
          <Card className="p-3">
            <div className="text-2xl font-bold text-blue-600">{mockStats.points}</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </Card>
        </div>
      </div>

      {/* Recent Activity/Notifications */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          {mockNotifications.map((notification) => (
            <Card key={notification.id} className="p-3">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === 'success' ? 'bg-green-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium truncate">{notification.title}</h5>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {notification.time}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          <span>{user?.location || 'Location not set'}</span>
        </div>
        <Button variant="outline" className="w-full gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};