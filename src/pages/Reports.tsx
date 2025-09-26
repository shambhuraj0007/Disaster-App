import React, { useState } from 'react';
import { Plus, Filter, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useReportStore } from '@/store/useReportStore';

// Mock data for reports
const mockReports = [
  {
    id: '1',
    hazardType: 'tsunami',
    severity: 'critical',
    location: { address: 'Kochi, Kerala', lat: 9.9312, lng: 76.2673 },
    description: 'Large waves approaching the coast, immediate evacuation needed',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    status: 'verified',
    userInfo: { name: 'Rajesh Kumar', avatar: null },
    media: ['/api/placeholder/200/150'],
  },
  {
    id: '2',
    hazardType: 'cyclone',
    severity: 'high',
    location: { address: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
    description: 'Strong winds and heavy rainfall, coastal areas at risk',
    timestamp: new Date('2024-01-15T09:15:00Z'),
    status: 'pending',
    userInfo: { name: 'Priya Sharma', avatar: null },
    media: [],
  },
  {
    id: '3',
    hazardType: 'flood',
    severity: 'medium',
    location: { address: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777 },
    description: 'Water logging in low-lying areas, traffic disrupted',
    timestamp: new Date('2024-01-15T08:45:00Z'),
    status: 'resolved',
    userInfo: { name: 'Amit Patel', avatar: null },
    media: ['/api/placeholder/200/150', '/api/placeholder/200/150'],
  },
];

const hazardIcons = {
  tsunami: '🌊',
  cyclone: '🌀',
  earthquake: '🏗️',
  flood: '💧',
  landslide: '⛰️',
};

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-green-100 text-green-800',
  resolved: 'bg-purple-100 text-purple-800',
};

export default function Reports() {
  const navigate = useNavigate();
  const { reports } = useReportStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hazardFilter, setHazardFilter] = useState('all');

  // Combine mock data with store data for demo
  const allReports = [...mockReports, ...reports];

  const filteredReports = allReports.filter((report) => {
    const matchesSearch = 
      report.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesHazard = hazardFilter === 'all' || report.hazardType === hazardFilter;

    return matchesSearch && matchesStatus && matchesHazard;
  });

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hazard Reports</h1>
          <p className="text-muted-foreground">
            Manage and review submitted hazard reports
          </p>
        </div>
        <Button onClick={() => navigate('/create-report')}>
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hazardFilter} onValueChange={setHazardFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by hazard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hazards</SelectItem>
                <SelectItem value="tsunami">Tsunami</SelectItem>
                <SelectItem value="cyclone">Cyclone</SelectItem>
                <SelectItem value="earthquake">Earthquake</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="landslide">Landslide</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No reports found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {report.media && report.media.length > 0 && (
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={report.media[0]} 
                    alt="Report media"
                    className="w-full h-full object-cover"
                  />
                  {report.media.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      +{report.media.length - 1} more
                    </div>
                  )}
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {hazardIcons[report.hazardType as keyof typeof hazardIcons]}
                    </span>
                    <div>
                      <CardTitle className="capitalize text-lg">
                        {report.hazardType}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {report.location.address}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        •••
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {report.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge className={severityColors[report.severity as keyof typeof severityColors]}>
                    {report.severity}
                  </Badge>
                  <Badge className={statusColors[report.status as keyof typeof statusColors]}>
                    {report.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={report.userInfo?.avatar || undefined} />
                      <AvatarFallback className="text-xs">
                        {report.userInfo?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {report.userInfo?.name || 'Anonymous'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getTimeAgo(report.timestamp)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}