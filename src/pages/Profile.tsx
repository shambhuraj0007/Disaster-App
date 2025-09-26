import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  User, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Award, 
  Settings, 
  Bell, 
  Heart, 
  Users, 
  TrendingUp,
  FileText,
  Download,
  Share2,
  Eye,
  Filter,
  Calendar,
  Star,
  Zap,
  Target,
  Activity,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function Profile() {
  // Mock user data for Shambhuraj Gadhave
  const user = {
    id: '1',
    name: 'Shambhuraj Gadhave',
    email: 'Gadhaveshambhuraj@gmail.com',
    phone: '+91 98765 43210',
    location: 'Satara, Maharashtra, India',
    organization: 'K.B.P. College of Engineering',
    role: 'community_reporter',
    profilePicture: null,
    joinDate: '2024-01-15',
    isVerified: true
  };

  // Mock reports data for Shambhuraj
  const reports = [
    {
      id: '1',
      userId: '1',
      hazardType: 'flood',
      severity: 'high',
      status: 'verified',
      location: { address: 'Satara City, Maharashtra' },
      timestamp: new Date('2024-09-25T10:30:00Z'),
      description: 'Heavy rainfall causing waterlogging in city center'
    },
    {
      id: '2',
      userId: '1',
      hazardType: 'landslide',
      severity: 'critical',
      status: 'verified',
      location: { address: 'Western Ghats, Satara District' },
      timestamp: new Date('2024-09-20T15:45:00Z'),
      description: 'Landslide risk due to continuous rainfall'
    },
    {
      id: '3',
      userId: '1',
      hazardType: 'cyclone',
      severity: 'medium',
      status: 'pending',
      location: { address: 'Coastal Maharashtra' },
      timestamp: new Date('2024-09-15T08:20:00Z'),
      description: 'Cyclone formation detected in Arabian Sea'
    },
    {
      id: '4',
      userId: '1',
      hazardType: 'earthquake',
      severity: 'low',
      status: 'verified',
      location: { address: 'Pune-Satara Highway' },
      timestamp: new Date('2024-09-10T14:15:00Z'),
      description: 'Minor tremors felt along highway corridor'
    },
    {
      id: '5',
      userId: '1',
      hazardType: 'wildfire',
      severity: 'high',
      status: 'investigating',
      location: { address: 'Sahyadri Hills, Satara' },
      timestamp: new Date('2024-09-05T11:30:00Z'),
      description: 'Forest fire spreading in hilly region'
    }
  ];

  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedTab, setSelectedTab] = useState('overview');

  const userReports = reports.filter(report => report.userId === user.id);
  const verifiedReports = userReports.filter(report => report.status === 'verified');
  const pendingReports = userReports.filter(report => report.status === 'pending');
  const criticalReports = userReports.filter(report => report.severity === 'critical');

  // Calculate user level and progress (Shambhuraj is Level 2 based on 3 verified reports)
  const userLevel = Math.floor(verifiedReports.length / 3) + 1;
  const progressToNextLevel = ((verifiedReports.length % 3) / 3) * 100;
  const reportsToNextLevel = 3 - (verifiedReports.length % 3);

  // Calculate reliability score (3 verified out of 5 total = 60%)
  const reliabilityScore = userReports.length > 0 
    ? Math.round((verifiedReports.length / userReports.length) * 100) 
    : 0;

  const stats = [
    { 
      label: 'Reports Submitted', 
      value: userReports.length, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: FileText,
      trend: '+25% this month'
    },
    { 
      label: 'Verified Reports', 
      value: verifiedReports.length, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: CheckCircle,
      trend: '+50% this month'
    },
    { 
      label: 'Reliability Score', 
      value: `${reliabilityScore}%`, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: Shield,
      trend: 'Good Standing'
    },
    { 
      label: 'Community Impact', 
      value: Math.round(verifiedReports.length * 2.8), 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: Users,
      trend: 'People helped'
    },
  ];

  const achievements = [
    {
      id: 1,
      title: 'First Reporter',
      description: 'Submitted your first disaster report',
      icon: '🎯',
      achieved: userReports.length >= 1,
      progress: Math.min(userReports.length, 1),
      unlockedDate: '2024-09-25'
    },
    {
      id: 2,
      title: 'Active Contributor',
      description: 'Submitted 5 disaster reports',
      icon: '📊',
      achieved: userReports.length >= 5,
      progress: Math.min(userReports.length / 5, 1),
      unlockedDate: '2024-09-05'
    },
    {
      id: 3,
      title: 'Critical Alert Hero',
      description: 'Reported critical incidents',
      icon: '🚨',
      achieved: criticalReports.length >= 1,
      progress: Math.min(criticalReports.length / 1, 1),
      unlockedDate: '2024-09-20'
    },
    {
      id: 4,
      title: 'Regional Expert',
      description: 'Reports from multiple districts',
      icon: '🗺️',
      achieved: true, // Based on reports from Satara, Pune areas
      progress: 1,
      unlockedDate: '2024-09-10'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'report_verified',
      title: 'Flood Report Verified',
      description: 'Your flood report in Satara City was verified by Maharashtra Emergency Services',
      timestamp: '2 days ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'report_verified',
      title: 'Landslide Alert Confirmed',
      description: 'Critical landslide report in Western Ghats has been confirmed and action initiated',
      timestamp: '1 week ago',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Achievement Unlocked',
      description: 'You earned the "Critical Alert Hero" badge for reporting urgent incidents',
      timestamp: '1 week ago',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'report_submitted',
      title: 'New Report Submitted',
      description: 'Cyclone warning report submitted for coastal Maharashtra',
      timestamp: '2 weeks ago',
      icon: FileText,
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Profile Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, Shambhuraj! Track your disaster reporting impact</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Profile
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-blue-700 h-32 relative">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <CardContent className="pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6 -mt-16">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4 z-10">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-blue-600 text-white font-bold">
                    SG
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
              
              {/* User Level */}
              <div className="text-center">
                <Badge variant="default" className="mb-2 px-3 py-1 text-sm font-semibold">
                  Level {userLevel} Reporter
                </Badge>
                <div className="w-36">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{reportsToNextLevel} to Level {userLevel + 1}</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(progressToNextLevel)}% complete
                  </p>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4 pt-16 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    {user.name}
                    {user.isVerified && (
                      <Shield className="h-6 w-6 text-green-600" title="Verified Citizen Reporter" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      Engineering Student
                    </Badge>
                  </h2>
                  <p className="text-muted-foreground font-medium">Community Disaster Reporter • Maharashtra Region</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{reliabilityScore}% Reliability Score</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Member since Jan 2024</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="shadow-sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="shadow-sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                </div>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 text-sm bg-muted/50 p-3 rounded-lg hover:bg-muted/70 transition-colors">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm bg-muted/50 p-3 rounded-lg hover:bg-muted/70 transition-colors">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm bg-muted/50 p-3 rounded-lg hover:bg-muted/70 transition-colors">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate font-medium">{user.location}</span>
                </div>
                {user.organization && (
                  <div className="flex items-center gap-3 text-sm bg-muted/50 p-3 rounded-lg hover:bg-muted/70 transition-colors sm:col-span-2 lg:col-span-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{user.organization}</span>
                    <Badge variant="outline" className="text-xs ml-auto">Student</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="relative overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className={cn("absolute top-0 right-0 w-20 h-20 rounded-bl-3xl", stat.bgColor, "opacity-15")} />
              <div className="flex items-start justify-between">
                <div>
                  <div className={cn("text-3xl font-bold", stat.color)}>
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-xs text-green-600 mt-2 font-semibold">
                    {stat.trend}
                  </p>
                </div>
                <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className={cn("p-2 rounded-full bg-background shadow-sm")}>
                        <activity.icon className={cn("h-4 w-4", activity.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start shadow-sm hover:shadow-md transition-shadow" size="lg">
                  <AlertTriangle className="h-5 w-5 mr-3" />
                  Report New Incident
                </Button>
                <Button variant="outline" className="w-full justify-start shadow-sm hover:shadow-md transition-shadow" size="lg">
                  <Eye className="h-5 w-5 mr-3" />
                  View Active Alerts in Maharashtra
                </Button>
                <Button variant="outline" className="w-full justify-start shadow-sm hover:shadow-md transition-shadow" size="lg">
                  <MapPin className="h-5 w-5 mr-3" />
                  Check Satara Risk Map
                </Button>
                <Button variant="outline" className="w-full justify-start shadow-sm hover:shadow-md transition-shadow" size="lg">
                  <Users className="h-5 w-5 mr-3" />
                  Connect with Local Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  My Reports ({userReports.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-4 h-4 rounded-full",
                        report.status === 'verified' ? 'bg-green-500' :
                        report.status === 'pending' ? 'bg-yellow-500' : 
                        report.status === 'investigating' ? 'bg-blue-500' : 'bg-red-500'
                      )}></div>
                      <div>
                        <p className="font-semibold capitalize flex items-center gap-2">
                          {report.hazardType} Report
                          {report.severity === 'critical' && (
                            <Badge variant="destructive" className="text-xs animate-pulse">Critical</Badge>
                          )}
                          {report.severity === 'high' && (
                            <Badge variant="default" className="text-xs">High</Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {report.location.address}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {report.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          report.status === 'verified' ? 'default' : 
                          report.status === 'pending' ? 'secondary' : 
                          report.status === 'investigating' ? 'outline' : 'destructive'
                        }
                        className="capitalize mb-1"
                      >
                        {report.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {report.timestamp.toLocaleDateString()}
                      </p>
                      <Button variant="ghost" size="sm" className="mt-1">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Achievements & Badges ({achievements.filter(a => a.achieved).length}/{achievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={cn(
                      "p-5 rounded-xl border-2 transition-all hover:shadow-md",
                      achievement.achieved 
                        ? "border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-sm" 
                        : "border-muted bg-muted/30"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "text-3xl w-16 h-16 rounded-full flex items-center justify-center shadow-sm",
                        achievement.achieved ? "bg-green-100 border-2 border-green-200" : "bg-muted border-2 border-muted-foreground/20"
                      )}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          {achievement.title}
                          {achievement.achieved && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {achievement.description}
                        </p>
                        {achievement.achieved && achievement.unlockedDate && (
                          <p className="text-xs text-green-600 font-semibold mb-2">
                            Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                          </p>
                        )}
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={cn(
                              "h-2 rounded-full transition-all",
                              achievement.achieved ? "bg-green-500" : "bg-primary"
                            )}
                            style={{ width: `${Math.min(achievement.progress * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">
                          {Math.round(achievement.progress * 100)}% Complete
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="relative">
                        <div className={cn("p-3 rounded-full bg-background border-2 shadow-sm")}>
                          <activity.icon className={cn("h-5 w-5", activity.color)} />
                        </div>
                        {index < recentActivity.length - 1 && (
                          <div className="absolute top-12 left-1/2 w-px h-8 bg-border transform -translate-x-1/2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-base">{activity.title}</p>
                          <p className="text-xs text-muted-foreground font-medium">{activity.timestamp}</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">5</div>
                  <p className="text-sm text-blue-700 font-medium">Reports Submitted</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600">3</div>
                  <p className="text-sm text-green-700 font-medium">Reports Verified</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-orange-600">8</div>
                  <p className="text-sm text-orange-700 font-medium">Community Impact</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-purple-600">60%</div>
                  <p className="text-sm text-purple-700 font-medium">Success Rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
