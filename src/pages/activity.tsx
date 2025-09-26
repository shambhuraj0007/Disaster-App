import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Cloud,
  Droplets,
  Wind,
  Mountain,
  Zap,
  Thermometer,
  Eye,
  MapPin,
  Clock,
  TrendingUp,
  Share2,
  ExternalLink,
  RefreshCw,
  Filter,
  Bell,
  Shield,
  Users,
  Calendar,
  Activity,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Current disaster news data based on recent events
const currentDisasterNews = [
  {
    id: '1',
    type: 'flood',
    severity: 'critical',
    title: 'Maharashtra Floods: 8 Dead, ₹2215 Crore Relief Fund Announced',
    description: 'Heavy rainfall in Marathwada region causes devastating floods. CM announces comprehensive relief package for affected families.',
    location: 'Marathwada, Maharashtra',
    timestamp: '2024-09-23T08:30:00Z',
    source: 'Hindustan Times',
    verified: true,
    affected: 50000,
    icon: Droplets,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    image: null,
    tags: ['flood', 'maharashtra', 'relief'],
    engagement: {
      views: 12500,
      shares: 89,
      comments: 45
    }
  },
  {
    id: '2',
    type: 'weather_alert',
    severity: 'high',
    title: 'IMD Issues Red Alert for Western Ghats Region',
    description: 'Meteorological department warns of extremely heavy rainfall and potential landslides in hilly areas of Maharashtra.',
    location: 'Western Ghats, Maharashtra',
    timestamp: '2024-09-26T06:15:00Z',
    source: 'India Meteorological Department',
    verified: true,
    affected: 25000,
    icon: Cloud,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    tags: ['weather', 'alert', 'rainfall'],
    engagement: {
      views: 8750,
      shares: 156,
      comments: 23
    }
  },
  {
    id: '3',
    type: 'landslide',
    severity: 'high',
    title: 'Landslide Risk in Satara District Following Heavy Monsoon',
    description: 'Geological survey teams deployed to assess landslide risks in hilly regions after continuous rainfall.',
    location: 'Satara District, Maharashtra',
    timestamp: '2024-09-25T14:45:00Z',
    source: 'Times of India',
    verified: true,
    affected: 5000,
    icon: Mountain,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    tags: ['landslide', 'satara', 'monsoon'],
    engagement: {
      views: 6200,
      shares: 67,
      comments: 18
    }
  },
  {
    id: '4',
    type: 'cyclone',
    severity: 'medium',
    title: 'Cyclone Formation Detected in Arabian Sea',
    description: 'Weather systems showing potential cyclone development. Coastal areas of Maharashtra on alert.',
    location: 'Arabian Sea Coast, Maharashtra',
    timestamp: '2024-09-24T11:20:00Z',
    source: 'NDMA',
    verified: true,
    affected: 75000,
    icon: Wind,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    tags: ['cyclone', 'coast', 'arabian sea'],
    engagement: {
      views: 15200,
      shares: 203,
      comments: 67
    }
  },
  {
    id: '5',
    type: 'drought',
    severity: 'medium',
    title: 'Drought Conditions Persist in Vidarbha Region',
    description: 'Agricultural communities face water scarcity issues despite recent rainfall in other parts of state.',
    location: 'Vidarbha, Maharashtra',
    timestamp: '2024-09-22T09:30:00Z',
    source: 'India Today',
    verified: true,
    affected: 100000,
    icon: Thermometer,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    tags: ['drought', 'agriculture', 'vidarbha'],
    engagement: {
      views: 4500,
      shares: 34,
      comments: 12
    }
  },
  {
    id: '6',
    type: 'flash_flood',
    severity: 'critical',
    title: 'Flash Floods Hit Pune-Satara Highway',
    description: 'Sudden flooding disrupts major transportation route. Emergency services evacuating stranded vehicles.',
    location: 'Pune-Satara Highway',
    timestamp: '2024-09-26T16:45:00Z',
    source: 'Live Updates',
    verified: true,
    affected: 2000,
    icon: Zap,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    tags: ['flash flood', 'highway', 'transport'],
    engagement: {
      views: 9800,
      shares: 145,
      comments: 38
    }
  },
  {
    id: '7',
    type: 'weather_extreme',
    severity: 'high',
    title: 'Maharashtra Records 142 Extreme Weather Days in 2024',
    description: 'State witnesses unprecedented surge in extreme weather events, highlighting climate change impact.',
    location: 'Maharashtra State',
    timestamp: '2024-09-21T07:00:00Z',
    source: 'Weather Department',
    verified: true,
    affected: 1000000,
    icon: TrendingUp,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    tags: ['climate', 'extreme weather', 'statistics'],
    engagement: {
      views: 18900,
      shares: 289,
      comments: 95
    }
  },
  {
    id: '8',
    type: 'early_warning',
    severity: 'medium',
    title: 'Advanced Cyclone Warning System Activated',
    description: 'India launches enhanced early warning systems for better disaster preparedness and response.',
    location: 'National Level',
    timestamp: '2024-09-25T12:30:00Z',
    source: 'News on Air',
    verified: true,
    affected: 0,
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    tags: ['technology', 'warning system', 'preparedness'],
    engagement: {
      views: 7300,
      shares: 98,
      comments: 24
    }
  }
];

const DisasterNewsFeed = () => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter news based on severity and type
  const filteredNews = currentDisasterNews.filter(news => {
    const matchesSeverity = selectedSeverity === 'all' || news.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || news.type === selectedType;
    return matchesSeverity && matchesType;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const formatTimeAgo = (timestamp: string | number | Date): string => {
    const now = new Date().getTime();
    const past = new Date(timestamp).getTime();
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
            <span className="leading-tight">Live Disaster Updates</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Real-time disaster news and alerts from Maharashtra and India
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="text-xs sm:text-sm"
          >
            <RefreshCw className={cn("h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Badge variant="destructive" className="animate-pulse text-xs">
            Live
          </Badge>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="sm:hidden">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters ({filteredNews.length} alerts)
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
        </Button>
      </div>

      {/* Filters */}
      <Card className={cn("sm:block", showFilters ? "block" : "hidden")}>
        <CardContent className="pt-4 space-y-4">
          {/* Mobile: Stack filters vertically, Desktop: Horizontal */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 sm:items-center">
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flood">Floods</SelectItem>
                <SelectItem value="cyclone">Cyclones</SelectItem>
                <SelectItem value="landslide">Landslides</SelectItem>
                <SelectItem value="weather_alert">Weather Alerts</SelectItem>
                <SelectItem value="drought">Drought</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center sm:justify-start">
              <Activity className="h-4 w-4" />
              <span>{filteredNews.length} active alerts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Feed */}
      <div className="space-y-3 sm:space-y-4">
        {filteredNews.map((news, index) => (
          <Card
            key={news.id}
            className={cn(
              "hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4",
              getSeverityColor(news.severity)
            )}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInLeft 0.6s ease-out forwards'
            }}
          >
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon */}
                <div className={cn(
                  "p-2 sm:p-3 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform",
                  news.bgColor
                )}>
                  <news.icon className={cn("h-4 w-4 sm:h-6 sm:w-6", news.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="space-y-2 sm:space-y-3">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <Badge
                        variant={
                          news.severity === 'critical' ? 'destructive' :
                          news.severity === 'high' ? 'default' :
                          news.severity === 'medium' ? 'secondary' : 'outline'
                        }
                        className="animate-pulse text-xs"
                      >
                        {news.severity.toUpperCase()}
                      </Badge>
                      {news.verified && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto sm:ml-0">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(news.timestamp)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors leading-tight pr-8 sm:pr-0">
                      {news.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {news.description}
                    </p>

                    {/* Metadata - Stack on mobile */}
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{news.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span>{news.affected.toLocaleString()} affected</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Source:</span>
                        <span className="truncate">{news.source}</span>
                      </div>
                    </div>

                    {/* Tags - Wrap on mobile */}
                    <div className="flex flex-wrap gap-1">
                      {news.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Engagement - Compact on mobile */}
                    <div className="flex items-center gap-3 sm:gap-6 pt-2 sm:pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">{news.engagement.views.toLocaleString()} views</span>
                        <span className="sm:hidden">{(news.engagement.views / 1000).toFixed(1)}k</span>
                      </div>
                      <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{news.engagement.shares}</span>
                      </button>
                      <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Read More</span>
                        <span className="sm:hidden">More</span>
                      </button>
                    </div>
                  </div>

                  {/* Mobile Action Button */}
                  <div className="absolute top-3 right-3 sm:hidden">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Desktop Action Button */}
                <div className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-2">
        <Button variant="outline" className="w-full sm:w-auto">
          Load More Updates
        </Button>
      </div>

      {/* Emergency Contacts - Responsive Grid */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-700 flex items-center gap-2 text-base sm:text-lg">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center p-2 sm:p-3 bg-white rounded-lg">
              <p className="font-bold text-base sm:text-lg">108</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Emergency Services</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-white rounded-lg">
              <p className="font-bold text-base sm:text-lg">100</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Police</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-white rounded-lg">
              <p className="font-bold text-base sm:text-lg">101</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Fire Department</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Ensure cards don't overflow on small screens */
        @media (max-width: 640px) {
          .space-y-4 > * + * {
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DisasterNewsFeed;
