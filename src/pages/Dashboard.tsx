import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Activity, 
  Users, 
  TrendingUp,
  MapPin,
  Clock,
  Shield,
  Bell,
  Zap,
  Eye,
  Calendar,
  Phone,
  Radio,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Cloud,
  ChevronRight,
  RefreshCw,
  Filter,
  Download,
  Settings,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Gauge,
  Waves,
  Mountain,
  TreePine
} from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { cn } from '@/lib/utils';

// Animated counter component
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString().replace(/[^\d]/g, ''));
    const incrementTime = duration / end;
    
    const counter = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(counter);
    }, incrementTime);
    
    return () => clearInterval(counter);
  }, [value, duration]);
  
  return <span>{count}</span>;
};

// Real-time pulse animation component
const PulseIndicator = ({ severity, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  const colorClasses = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };
  
  return (
    <div className="relative">
      <div className={cn(
        "rounded-full animate-pulse",
        sizeClasses[size],
        colorClasses[severity]
      )} />
      <div className={cn(
        "absolute inset-0 rounded-full animate-ping opacity-75",
        sizeClasses[size],
        colorClasses[severity]
      )} />
    </div>
  );
};

// Enhanced stats with animations and effects
const mockStats = [
  {
    title: 'Total Reports',
    value: '1,234',
    change: '+12%',
    icon: Activity,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trend: 'up',
    description: 'Reports submitted today'
  },
  {
    title: 'Active Incidents',
    value: '23',
    change: '+5',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    trend: 'up',
    description: 'Currently being monitored'
  },
  {
    title: 'Response Time',
    value: '3.2min',
    change: '-15%',
    icon: Clock,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    trend: 'down',
    description: 'Average response time'
  },
  {
    title: 'Active Responders',
    value: '156',
    change: '+8%',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    trend: 'up',
    description: 'Emergency personnel deployed'
  },
];

const recentReports = [
  {
    id: '1',
    type: 'flood',
    location: 'Mumbai, Maharashtra',
    severity: 'critical',
    time: '2 minutes ago',
    status: 'verified',
    reporter: 'Local Authority',
    affected: 500,
    coordinates: [19.0760, 72.8777]
  },
  {
    id: '2',
    type: 'cyclone',
    location: 'Chennai, Tamil Nadu',
    severity: 'high',
    time: '5 minutes ago',
    status: 'pending',
    reporter: 'Weather Station',
    affected: 1200,
    coordinates: [13.0827, 80.2707]
  },
  {
    id: '3',
    type: 'earthquake',
    location: 'Delhi NCR',
    severity: 'medium',
    time: '10 minutes ago',
    status: 'verified',
    reporter: 'Seismic Center',
    affected: 200,
    coordinates: [28.6139, 77.2090]
  },
  {
    id: '4',
    type: 'wildfire',
    location: 'Uttarakhand Hills',
    severity: 'high',
    time: '15 minutes ago',
    status: 'investigating',
    reporter: 'Forest Patrol',
    affected: 80,
    coordinates: [30.0668, 79.0193]
  }
];

const weatherData = [
  { location: 'Mumbai', temp: 32, humidity: 85, wind: 15, condition: 'cloudy', alert: 'high' },
  { location: 'Chennai', temp: 28, humidity: 78, wind: 22, condition: 'stormy', alert: 'critical' },
  { location: 'Delhi', temp: 35, humidity: 45, wind: 8, condition: 'sunny', alert: 'low' },
  { location: 'Kolkata', temp: 30, humidity: 82, wind: 12, condition: 'rainy', alert: 'medium' }
];

const activeHotspots = [
  {
    id: 1,
    location: 'Coastal Kerala',
    type: 'Tsunami Warning',
    severity: 'critical',
    affected: 50000,
    lastUpdate: '1 min ago',
    coordinates: [8.5241, 76.9366]
  },
  {
    id: 2,
    location: 'West Bengal Coast',
    type: 'Cyclone Alert',
    severity: 'high',
    affected: 30000,
    lastUpdate: '3 min ago',
    coordinates: [22.5726, 88.3639]
  },
  {
    id: 3,
    location: 'Gujarat Coastal Areas',
    type: 'Flood Warning',
    severity: 'medium',
    affected: 15000,
    lastUpdate: '5 min ago',
    coordinates: [22.2587, 71.1924]
  },
  {
    id: 4,
    location: 'Himachal Pradesh',
    type: 'Landslide Risk',
    severity: 'high',
    affected: 5000,
    lastUpdate: '8 min ago',
    coordinates: [31.1048, 77.1734]
  }
];

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Animated Header with Real-time Clock */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Emergency Command Center
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Real-time disaster monitoring and response coordination
            <Badge variant="outline" className="animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
              Live
            </Badge>
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {currentTime.toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid with Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 group"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInUp 0.6s ease-out forwards'
            }}
          >
            <div className={cn(
              "absolute top-0 right-0 w-20 h-20 rounded-bl-3xl opacity-10 transition-opacity group-hover:opacity-20",
              stat.bgColor
            )} />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="flex items-center gap-1">
                  <TrendingUp className={cn(
                    "h-3 w-3",
                    stat.trend === 'up' ? "text-green-600" : "text-red-600"
                  )} />
                  <span className={cn(
                    "text-xs font-medium",
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  )}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Reports with Enhanced UI */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Reports
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentReports.map((report, index) => (
                  <div 
                    key={report.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 hover:shadow-md group cursor-pointer"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInLeft 0.5s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <PulseIndicator severity={report.severity} size="md" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium capitalize">{report.type} Incident</p>
                          {report.severity === 'critical' && (
                            <Badge variant="destructive" className="text-xs animate-pulse">
                              URGENT
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {report.location}
                          <span className="text-xs">• {report.affected} affected</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reported by: {report.reporter}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            report.status === 'verified' ? 'default' : 
                            report.status === 'pending' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {report.status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {report.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {report.status === 'investigating' && <Eye className="h-3 w-3 mr-1" />}
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{report.time}</p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Hotspots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Hotspots
                  <Badge variant="destructive" className="animate-pulse">
                    {activeHotspots.filter(h => h.severity === 'critical').length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeHotspots.map((hotspot, index) => (
                  <div 
                    key={hotspot.id}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-300 hover:shadow-md cursor-pointer group",
                      hotspot.severity === 'critical' && "border-red-200 bg-red-50 dark:bg-red-950/20",
                      hotspot.severity === 'high' && "border-orange-200 bg-orange-50 dark:bg-orange-950/20",
                      hotspot.severity === 'medium' && "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20"
                    )}
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: 'fadeInRight 0.5s ease-out forwards'
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{hotspot.location}</p>
                        <p className="text-xs text-muted-foreground">{hotspot.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <PulseIndicator severity={hotspot.severity} />
                        <Badge 
                          variant={
                            hotspot.severity === 'critical' ? 'destructive' :
                            hotspot.severity === 'high' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {hotspot.severity}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{hotspot.affected.toLocaleString()} affected</span>
                      <span>{hotspot.lastUpdate}</span>
                    </div>
                    <div className="mt-2">
                      <Progress 
                        value={
                          hotspot.severity === 'critical' ? 90 :
                          hotspot.severity === 'high' ? 70 : 50
                        }
                        className="h-1"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weather" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weatherData.map((weather, index) => (
              <Card 
                key={weather.location}
                className="relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.6s ease-out forwards'
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{weather.location}</CardTitle>
                    <div className="flex items-center gap-1">
                      {weather.condition === 'sunny' && <Sun className="h-5 w-5 text-yellow-500" />}
                      {weather.condition === 'cloudy' && <Cloud className="h-5 w-5 text-gray-500" />}
                      {weather.condition === 'rainy' && <Droplets className="h-5 w-5 text-blue-500" />}
                      {weather.condition === 'stormy' && <Zap className="h-5 w-5 text-purple-500" />}
                      <PulseIndicator severity={weather.alert} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold flex items-center">
                    <Thermometer className="h-6 w-6 mr-2 text-red-500" />
                    {weather.temp}°C
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        Humidity
                      </span>
                      <span className="font-medium">{weather.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-500" />
                        Wind
                      </span>
                      <span className="font-medium">{weather.wind} km/h</span>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      weather.alert === 'critical' ? 'destructive' :
                      weather.alert === 'high' ? 'default' :
                      weather.alert === 'medium' ? 'secondary' : 'outline'
                    }
                    className="w-full justify-center"
                  >
                    {weather.alert} risk
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Incidents</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Incident
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div 
                    key={report.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-all cursor-pointer"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeIn 0.5s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <PulseIndicator severity={report.severity} size="lg" />
                        <div>
                          <h3 className="font-semibold capitalize">
                            {report.type} - {report.location}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {report.affected} people affected • Reported {report.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={report.status === 'verified' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                        <Badge variant={
                          report.severity === 'critical' ? 'destructive' :
                          report.severity === 'high' ? 'default' : 'secondary'
                        }>
                          {report.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Emergency Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Fire Department</span>
                  <Badge variant="outline">24 units</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Medical Teams</span>
                  <Badge variant="outline">18 teams</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rescue Units</span>
                  <Badge variant="outline">12 units</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-green-500" />
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Active Channels</span>
                  <Badge variant="default">8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Network Status</span>
                  <Badge variant="default" className="bg-green-500">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Backup Systems</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Personnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>On Duty</span>
                  <Badge variant="default">156</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Deployed</span>
                  <Badge variant="secondary">89</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Available</span>
                  <Badge variant="outline">67</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

     
    </div>
  );
}
