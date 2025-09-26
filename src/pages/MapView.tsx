import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Layers, 
  Search, 
  Filter,
  AlertTriangle,
  Waves,
  CloudRain,
  Mountain,
  MapPin,
  Eye,
  EyeOff,
  Maximize2,
  Settings,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Fix for default markers in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Enhanced mock data for Indian coastal hazards
const mockReports = [
  {
    id: '1',
    type: 'tsunami',
    severity: 'critical',
    location: [8.5241, 76.9366], // Kerala Coast
    title: 'Tsunami Warning Alert',
    description: 'High waves observed near Kochi coastline with potential for coastal flooding',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'verified',
    reporter: 'Coastal Monitoring Station',
    affectedArea: 'Kochi District'
  },
  {
    id: '2',
    type: 'cyclone',
    severity: 'high',
    location: [22.5726, 88.3639], // West Bengal Coast
    title: 'Cyclone Formation Detected',
    description: 'Cyclone system developing in Bay of Bengal with potential landfall',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'pending',
    reporter: 'Meteorological Department',
    affectedArea: 'Sundarbans Region'
  },
  {
    id: '3',
    type: 'flood',
    severity: 'medium',
    location: [19.0760, 72.8777], // Mumbai Coast
    title: 'Coastal Flooding Incident',
    description: 'Rising sea levels causing local flooding in low-lying areas',
    timestamp: '2024-01-15T08:45:00Z',
    status: 'verified',
    reporter: 'Municipal Corporation',
    affectedArea: 'Marine Drive Area'
  },
  {
    id: '4',
    type: 'erosion',
    severity: 'medium',
    location: [13.0827, 80.2707], // Chennai
    title: 'Coastal Erosion',
    description: 'Significant erosion observed along marina beach',
    timestamp: '2024-01-15T07:30:00Z',
    status: 'verified',
    reporter: 'Environmental Survey Team',
    affectedArea: 'Marina Beach'
  }
];

const mockHotspots = [
  {
    id: 'h1',
    location: [13.0827, 80.2707], // Chennai
    intensity: 0.9,
    reports: 18,
    title: 'Chennai Bay Area',
    riskLevel: 'Critical'
  },
  {
    id: 'h2',
    location: [15.2993, 74.1240], // Goa
    intensity: 0.6,
    reports: 8,
    title: 'Goa Coastline',
    riskLevel: 'Medium'
  },
  {
    id: 'h3',
    location: [11.2588, 75.7804], // Kozhikode
    intensity: 0.4,
    reports: 5,
    title: 'Kozhikode Coast',
    riskLevel: 'Low'
  },
  {
    id: 'h4',
    location: [19.0760, 72.8777], // Mumbai
    intensity: 0.8,
    reports: 12,
    title: 'Mumbai Metropolitan',
    riskLevel: 'High'
  }
];

// Enhanced marker icons with better styling
const getMarkerIcon = (type: string, severity: string) => {
  const severityConfig = {
    critical: { color: '#dc2626', bgColor: '#fef2f2', borderColor: '#dc2626' },
    high: { color: '#ea580c', bgColor: '#fff7ed', borderColor: '#ea580c' },
    medium: { color: '#eab308', bgColor: '#fffbeb', borderColor: '#eab308' },
    low: { color: '#10b981', bgColor: '#f0fdf4', borderColor: '#10b981' }
  };

  const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.medium;

  const getIconHtml = () => {
    const iconMap = {
      tsunami: '🌊',
      cyclone: '🌀',
      flood: '💧',
      erosion: '🏔️',
      default: '⚠️'
    };

    const emoji = iconMap[type as keyof typeof iconMap] || iconMap.default;

    return `
      <div style="
        background: linear-gradient(135deg, ${config.bgColor} 0%, ${config.color}20 100%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid ${config.borderColor};
        box-shadow: 0 4px 16px rgba(0,0,0,0.2), 0 0 0 6px ${config.color}15;
        font-size: 18px;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
        animation: pulse-${severity} 2s infinite;
      ">
        ${emoji}
        <div style="
          position: absolute;
          top: -3px;
          right: -3px;
          width: 14px;
          height: 14px;
          background: ${config.color};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        "></div>
      </div>
    `;
  };

  return L.divIcon({
    html: getIconHtml(),
    className: 'custom-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// CSS styles for animations
const mapStyles = `
  .leaflet-container {
    height: 100vh;
    width: 100%;
    z-index: 0;
  }
  
  .custom-marker-icon {
    background: transparent !important;
    border: none !important;
  }
  
  @keyframes pulse-critical {
    0%, 100% { 
      transform: scale(1); 
      opacity: 1; 
    }
    50% { 
      transform: scale(1.1); 
      opacity: 0.8; 
    }
  }
  
  @keyframes pulse-high {
    0%, 100% { 
      transform: scale(1); 
      opacity: 1; 
    }
    50% { 
      transform: scale(1.08); 
      opacity: 0.85; 
    }
  }
  
  @keyframes pulse-medium {
    0%, 100% { 
      transform: scale(1); 
      opacity: 1; 
    }
    50% { 
      transform: scale(1.05); 
      opacity: 0.9; 
    }
  }
  
  @keyframes pulse-low {
    0%, 100% { 
      transform: scale(1); 
      opacity: 1; 
    }
    50% { 
      transform: scale(1.03); 
      opacity: 0.95; 
    }
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    max-width: 320px;
  }
  
  .leaflet-popup-tip {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  }
  
  .leaflet-control-zoom a {
    border-radius: 8px !important;
    border: none !important;
    background: white !important;
    color: #374151 !important;
    font-size: 18px !important;
    width: 36px !important;
    height: 36px !important;
    line-height: 36px !important;
    transition: all 0.2s ease;
  }
  
  .leaflet-control-zoom a:hover {
    background: #f3f4f6 !important;
    color: #111827 !important;
    transform: scale(1.05);
  }
`;

// Main MapView component using vanilla Leaflet
export default function MapView() {
  const [selectedLayers, setSelectedLayers] = useState(['reports', 'hotspots']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>(['critical', 'high', 'medium']);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [mapStyle, setMapStyle] = useState('osm');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const hotspotsLayerRef = useRef<L.LayerGroup | null>(null);

  // Memoize filtered reports based on search and severity
  const filteredReports = useMemo(() => {
    return mockReports.filter(report => {
      const matchesSearch = searchQuery === '' || 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.affectedArea.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = selectedSeverity.includes(report.severity);
      
      return matchesSearch && matchesSeverity;
    });
  }, [searchQuery, selectedSeverity]);

  // Map tile layers
  const tileLayerUrls = {
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png'
  };

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      
      // Add tile layer
      L.tileLayer(tileLayerUrls.osm, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
      
      // Initialize layer groups
      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
      hotspotsLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer when style changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });
      
      L.tileLayer(tileLayerUrls[mapStyle as keyof typeof tileLayerUrls], {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }
  }, [mapStyle]);

  // Update markers when reports change
  useEffect(() => {
    if (markersLayerRef.current && selectedLayers.includes('reports')) {
      markersLayerRef.current.clearLayers();
      
      filteredReports.forEach((report) => {
        const marker = L.marker([report.location[0], report.location[1]], {
          icon: getMarkerIcon(report.type, report.severity)
        });
        
        const popupContent = `
          <div class="p-4 space-y-3" style="font-family: system-ui, -apple-system, sans-serif;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
              <h3 style="font-weight: 600; font-size: 18px; line-height: 1.3; margin: 0; color: #1f2937;">
                ${report.title}
              </h3>
              <span style="
                display: inline-flex; 
                align-items: center; 
                padding: 2px 8px; 
                font-size: 12px; 
                font-weight: 500; 
                border-radius: 6px;
                background: ${report.severity === 'critical' ? '#dc2626' : 
                           report.severity === 'high' ? '#ea580c' :
                           report.severity === 'medium' ? '#eab308' : '#10b981'};
                color: white;
              ">
                ${report.severity.toUpperCase()}
              </span>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin: 0;">
              ${report.description}
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #6b7280;">
                <span>📍</span>
                <span>${report.affectedArea}</span>
              </div>
              
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #6b7280;">
                <span>⚠️</span>
                <span>Reported by: ${report.reporter}</span>
              </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 12px 0;">
            
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="
                display: inline-flex; 
                align-items: center; 
                padding: 2px 8px; 
                font-size: 12px; 
                border-radius: 4px;
                background: ${report.status === 'verified' ? '#10b981' : '#6b7280'};
                color: white;
              ">
                ${report.status.toUpperCase()}
              </span>
              <span style="font-size: 12px; color: #6b7280;">
                ${new Date(report.timestamp).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent, { maxWidth: 340, minWidth: 280 });
        markersLayerRef.current?.addLayer(marker);
      });
    } else if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }
  }, [filteredReports, selectedLayers]);

  // Update hotspots when they change
  useEffect(() => {
    if (hotspotsLayerRef.current && selectedLayers.includes('hotspots')) {
      hotspotsLayerRef.current.clearLayers();
      
      mockHotspots.forEach((hotspot) => {
        const circle = L.circle([hotspot.location[0], hotspot.location[1]], {
          radius: Math.max(hotspot.intensity * 50000, 20000),
          fillColor: hotspot.intensity > 0.8 ? '#dc2626' : 
                    hotspot.intensity > 0.6 ? '#ea580c' : 
                    hotspot.intensity > 0.4 ? '#eab308' : '#10b981',
          fillOpacity: 0.25,
          color: hotspot.intensity > 0.8 ? '#dc2626' : 
                 hotspot.intensity > 0.6 ? '#ea580c' : 
                 hotspot.intensity > 0.4 ? '#eab308' : '#10b981',
          weight: 3,
          opacity: 0.8,
        });
        
        const popupContent = `
          <div style="padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="font-weight: 600; font-size: 16px; margin: 0 0 12px 0; color: #1f2937;">
              ${hotspot.title}
            </h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: #6b7280;">Active Reports:</span>
                <span style="
                  display: inline-flex; 
                  align-items: center; 
                  padding: 2px 8px; 
                  font-size: 12px; 
                  border-radius: 4px;
                  background: #f3f4f6;
                  color: #374151;
                ">
                  ${hotspot.reports}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: #6b7280;">Risk Level:</span>
                <span style="
                  display: inline-flex; 
                  align-items: center; 
                  padding: 2px 8px; 
                  font-size: 12px; 
                  border-radius: 4px;
                  background: ${
                    hotspot.riskLevel === 'Critical' ? '#dc2626' :
                    hotspot.riskLevel === 'High' ? '#ea580c' :
                    hotspot.riskLevel === 'Medium' ? '#eab308' : '#10b981'
                  };
                  color: white;
                ">
                  ${hotspot.riskLevel}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: #6b7280;">Intensity:</span>
                <span style="font-size: 14px; font-weight: 500; color: #1f2937;">
                  ${Math.round(hotspot.intensity * 100)}%
                </span>
              </div>
            </div>
          </div>
        `;
        
        circle.bindPopup(popupContent, { maxWidth: 300 });
        hotspotsLayerRef.current?.addLayer(circle);
      });
    } else if (hotspotsLayerRef.current) {
      hotspotsLayerRef.current.clearLayers();
    }
  }, [selectedLayers]);

  const toggleLayer = useCallback((layer: string) => {
    setSelectedLayers(prev => 
      prev.includes(layer) 
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  }, []);

  const toggleSeverity = useCallback((severity: string) => {
    setSelectedSeverity(prev => 
      prev.includes(severity)
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  }, []);

  const resetMapView = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([20.5937, 78.9629], 5);
    }
  }, []);

  const locateUser = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.locate({ setView: true, maxZoom: 10 });
    }
  }, []);

  return (
    <>
      {/* CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: mapStyles }} />

      <div className="h-screen flex bg-background relative">
        {/* Map Container */}
        <div className="flex-1 relative overflow-hidden">
          <div 
            ref={mapRef} 
            className="h-full w-full z-0"
            style={{ height: '100%', width: '100%' }}
          />

          {/* Enhanced Map Controls */}
          <div className={cn(
            "absolute top-4 left-4 space-y-3 transition-all duration-300 z-[1]",
            isControlsCollapsed ? "translate-x-[-320px]" : "translate-x-0"
          )}>
            {/* Toggle Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
              className={cn(
                "h-10 px-3 shadow-lg bg-background/95 backdrop-blur-sm border-border/50 transition-all duration-300",
                isControlsCollapsed && "translate-x-[320px]"
              )}
            >
              {isControlsCollapsed ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Controls
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide
                </>
              )}
            </Button>

            <Card className="w-80 shadow-lg border-border/50 backdrop-blur-sm bg-background/95">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Map Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enhanced Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Reports</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title, area, or description..."
                      className="pl-9 h-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {searchQuery && (
                    <p className="text-xs text-muted-foreground">
                      Found {filteredReports.length} reports matching "{searchQuery}"
                    </p>
                  )}
                </div>

                <Separator />

                {/* Map Style Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Map Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'osm', label: 'Street', icon: '🗺️' },
                      { key: 'satellite', label: 'Satellite', icon: '🛰️' },
                      { key: 'terrain', label: 'Terrain', icon: '🏔️' }
                    ].map((style) => (
                      <Button
                        key={style.key}
                        variant={mapStyle === style.key ? 'default' : 'outline'}
                        size="sm"
                        className="h-10 text-xs"
                        onClick={() => setMapStyle(style.key)}
                      >
                        <span className="mr-1">{style.icon}</span>
                        {style.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Enhanced Layer Toggle */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Map Layers
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Hazard Reports</span>
                        <Badge variant="secondary" className="text-xs">
                          {filteredReports.length}
                        </Badge>
                      </div>
                      <Switch
                        checked={selectedLayers.includes('reports')}
                        onCheckedChange={() => toggleLayer('reports')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-60" />
                        <span className="text-sm">Risk Hotspots</span>
                        <Badge variant="secondary" className="text-xs">
                          {mockHotspots.length}
                        </Badge>
                      </div>
                      <Switch
                        checked={selectedLayers.includes('hotspots')}
                        onCheckedChange={() => toggleLayer('hotspots')}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Severity Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    Severity Filter
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'critical', label: 'Critical', color: 'bg-red-500' },
                      { key: 'high', label: 'High', color: 'bg-orange-500' },
                      { key: 'medium', label: 'Medium', color: 'bg-yellow-500' },
                      { key: 'low', label: 'Low', color: 'bg-green-500' }
                    ].map((severity) => (
                      <div key={severity.key} className="flex items-center space-x-2">
                        <Switch
                          checked={selectedSeverity.includes(severity.key)}
                          onCheckedChange={() => toggleSeverity(severity.key)}
                          className="scale-75"
                        />
                        <div className={cn("w-3 h-3 rounded-full", severity.color)} />
                        <span className="text-xs">{severity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Legend */}
          <div className="absolute bottom-4 right-4 z-[1]">
            <Card className="w-72 shadow-lg border-border/50 backdrop-blur-sm bg-background/95">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-gradient-to-r from-blue-500 to-purple-500" />
                  Map Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Report Severity
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { color: 'bg-red-600', label: 'Critical', count: mockReports.filter(r => r.severity === 'critical').length },
                      { color: 'bg-orange-600', label: 'High', count: mockReports.filter(r => r.severity === 'high').length },
                      { color: 'bg-yellow-600', label: 'Medium', count: mockReports.filter(r => r.severity === 'medium').length },
                      { color: 'bg-green-600', label: 'Low', count: mockReports.filter(r => r.severity === 'low').length }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-3 h-3 rounded-full", item.color)} />
                          <span className="text-xs">{item.label}</span>
                        </div>
                        <Badge variant="outline" className="text-xs h-5">
                          {item.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Hazard Types
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span>🌊</span> <span>Tsunami</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🌀</span> <span>Cyclone</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💧</span> <span>Flood</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🏔️</span> <span>Erosion</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last updated:</span>
                  <span>{new Date().toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 z-[1000]">
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-10 w-10 p-0 shadow-lg bg-background/95 backdrop-blur-sm border-border/50"
                onClick={resetMapView}
                title="Reset map view"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-10 w-10 p-0 shadow-lg bg-background/95 backdrop-blur-sm border-border/50"
                onClick={locateUser}
                title="Find my location"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
