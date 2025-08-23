import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { 
  X, 
  Filter,
  Search,
  Home,
  Building2,
  MapPin,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Percent,
  Shield,
  Phone,
  Mail,
  Heart,
  Share2,
  Eye,
  Layers,
  Navigation,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Menu,
  Settings,
  Info,
  Clock,
  Users,
  Car,
  Wifi,
  School,
  Hospital,
  ShoppingBag,
  Train,
  Plane,
  TreePine,
  Award,
  Activity,
  AlertTriangle,
  CheckCircle,
  Construction
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Enhanced property data for Dubai locations with comprehensive metrics
const dubaiProperties = [
  {
    id: 1,
    name: "Burj Vista Downtown",
    coordinates: [55.2744, 25.1972],
    location: "Downtown Dubai",
    type: "Apartment",
    unitTypes: ["1BR", "2BR", "3BR"],
    priceRange: "AED 2.1M - 4.8M",
    priceMin: 2100000,
    priceMax: 4800000,
    unitsLeft: 23,
    roi: 8.7,
    rentalYield: 7.4,
    priceGrowthYoY: 12.8,
    constructionStatus: 85,
    completionDate: "Q2 2025",
    developerRating: 4.9,
    developer: "Emaar Properties",
    projectStatus: "Under Construction",
    riskLevel: "Low",
    metroDistance: 0.3,
    schoolDistance: 0.8,
    hospitalDistance: 1.2,
    mallDistance: 0.2,
    beachDistance: 8.5,
    walkabilityScore: 95,
    communityFeatures: ["Gym", "Pool", "Concierge", "Parking", "Security"],
    nearbyAmenities: ["Dubai Mall", "Burj Khalifa", "Metro Station", "Business District"],
    governmentImpact: "Metro expansion 2027 - value boost expected",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    paymentPlan: "20% Down, 80% on Completion",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 1850,
    infraImpact: {
      metro: { status: "expansion", completion: "2027", impact: "High" },
      schools: { count: 3, avgDistance: 0.8 },
      hospitals: { count: 2, avgDistance: 1.2 }
    }
  },
  {
    id: 2,
    name: "Marina Pearl Residence",
    coordinates: [55.1403, 25.0657],
    location: "Dubai Marina",
    type: "Apartment",
    unitTypes: ["1BR", "2BR"],
    priceRange: "AED 1.8M - 3.2M",
    priceMin: 1800000,
    priceMax: 3200000,
    unitsLeft: 67,
    roi: 9.4,
    rentalYield: 8.2,
    priceGrowthYoY: 8.9,
    constructionStatus: 65,
    completionDate: "Q4 2025",
    developerRating: 4.7,
    developer: "DAMAC Properties",
    projectStatus: "Under Construction",
    riskLevel: "Medium",
    metroDistance: 1.2,
    schoolDistance: 2.1,
    hospitalDistance: 1.8,
    mallDistance: 0.5,
    beachDistance: 0.3,
    walkabilityScore: 88,
    communityFeatures: ["Beach Access", "Marina Walk", "Restaurants", "Parking"],
    nearbyAmenities: ["Marina Mall", "JBR Beach", "Marina Walk", "Restaurants"],
    governmentImpact: "Beach infrastructure upgrade 2026",
    images: ["https://images.unsplash.com/photo-1696743297474-d674b8e3d82a?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1518715214357-e04c7c7b4e98?w=800",
    paymentPlan: "25% During Construction, 75% on Completion",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 1650,
    infraImpact: {
      metro: { status: "existing", completion: "completed", impact: "Medium" },
      schools: { count: 4, avgDistance: 2.1 },
      hospitals: { count: 3, avgDistance: 1.8 }
    }
  },
  {
    id: 3,
    name: "Palm Jumeirah Villa",
    coordinates: [55.1390, 25.1124],
    location: "Palm Jumeirah",
    type: "Villa",
    unitTypes: ["4BR", "5BR", "6BR"],
    priceRange: "AED 8.5M - 15.2M",
    priceMin: 8500000,
    priceMax: 15200000,
    unitsLeft: 8,
    roi: 6.2,
    rentalYield: 5.1,
    priceGrowthYoY: 18.5,
    constructionStatus: 100,
    completionDate: "Ready",
    developerRating: 4.6,
    developer: "Nakheel",
    projectStatus: "Ready to Move",
    riskLevel: "Low",
    metroDistance: 8.5,
    schoolDistance: 3.2,
    hospitalDistance: 6.8,
    mallDistance: 5.1,
    beachDistance: 0.1,
    walkabilityScore: 72,
    communityFeatures: ["Private Beach", "Golf Course", "Spa", "Marina"],
    nearbyAmenities: ["Atlantis Resort", "Private Beach", "Golf Course", "Restaurants"],
    governmentImpact: "Tourism infrastructure expansion ongoing",
    images: ["https://images.unsplash.com/photo-1726003354242-4ff17c3515e1?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    paymentPlan: "Cash or Mortgage Available",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 2100,
    infraImpact: {
      metro: { status: "planned", completion: "2030", impact: "High" },
      schools: { count: 2, avgDistance: 3.2 },
      hospitals: { count: 1, avgDistance: 6.8 }
    }
  },
  {
    id: 4,
    name: "Business Bay Elite",
    coordinates: [55.2608, 25.1869],
    location: "Business Bay",
    type: "Apartment",
    unitTypes: ["2BR", "3BR", "Penthouse"],
    priceRange: "AED 2.8M - 6.5M",
    priceMin: 2800000,
    priceMax: 6500000,
    unitsLeft: 42,
    roi: 7.8,
    rentalYield: 6.9,
    priceGrowthYoY: 11.2,
    constructionStatus: 95,
    completionDate: "Q1 2025",
    developerRating: 4.8,
    developer: "Sobha Realty",
    projectStatus: "Near Completion",
    riskLevel: "Low",
    metroDistance: 0.6,
    schoolDistance: 1.5,
    hospitalDistance: 2.1,
    mallDistance: 1.8,
    beachDistance: 6.2,
    walkabilityScore: 90,
    communityFeatures: ["Sky Lounge", "Business Center", "Canal Views", "Parking"],
    nearbyAmenities: ["Dubai Canal", "DIFC", "Business District", "Metro"],
    governmentImpact: "Financial district expansion 2025-2027",
    images: ["https://images.unsplash.com/photo-1609764465693-a2dc6c6f7dbd?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    paymentPlan: "30% During Construction, 70% on Completion",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 1750,
    infraImpact: {
      metro: { status: "existing", completion: "completed", impact: "High" },
      schools: { count: 5, avgDistance: 1.5 },
      hospitals: { count: 4, avgDistance: 2.1 }
    }
  },
  {
    id: 5,
    name: "Al Barari Green Villas",
    coordinates: [55.2285, 25.0535],
    location: "Al Barari",
    type: "Villa",
    unitTypes: ["3BR", "4BR", "5BR"],
    priceRange: "AED 6.2M - 12.8M",
    priceMin: 6200000,
    priceMax: 12800000,
    unitsLeft: 15,
    roi: 5.8,
    rentalYield: 4.9,
    priceGrowthYoY: 16.3,
    constructionStatus: 100,
    completionDate: "Ready",
    developerRating: 4.5,
    developer: "Al Barari Developers",
    projectStatus: "Ready to Move",
    riskLevel: "Low",
    metroDistance: 5.2,
    schoolDistance: 2.8,
    hospitalDistance: 3.5,
    mallDistance: 4.1,
    beachDistance: 12.8,
    walkabilityScore: 78,
    communityFeatures: ["Botanical Gardens", "Golf Course", "Spa", "Organic Farm"],
    nearbyAmenities: ["Golf Course", "International Schools", "Hospitals", "Nature Reserves"],
    governmentImpact: "Green transportation initiative 2026",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    paymentPlan: "Cash or Mortgage Available",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 2000,
    infraImpact: {
      metro: { status: "planned", completion: "2028", impact: "Medium" },
      schools: { count: 3, avgDistance: 2.8 },
      hospitals: { count: 2, avgDistance: 3.5 }
    }
  },
  {
    id: 6,
    name: "JVC Modern Living",
    coordinates: [55.2115, 25.0566],
    location: "Jumeirah Village Circle",
    type: "Apartment",
    unitTypes: ["Studio", "1BR", "2BR"],
    priceRange: "AED 580K - 1.2M",
    priceMin: 580000,
    priceMax: 1200000,
    unitsLeft: 156,
    roi: 11.8,
    rentalYield: 9.2,
    priceGrowthYoY: 7.4,
    constructionStatus: 100,
    completionDate: "Ready",
    developerRating: 4.2,
    developer: "Multiple Developers",
    projectStatus: "Ready to Move",
    riskLevel: "Medium",
    metroDistance: 3.8,
    schoolDistance: 1.2,
    hospitalDistance: 2.5,
    mallDistance: 2.1,
    beachDistance: 8.5,
    walkabilityScore: 82,
    communityFeatures: ["Community Pool", "Gym", "Parks", "Retail"],
    nearbyAmenities: ["Circle Mall", "Community Parks", "Schools", "Clinics"],
    governmentImpact: "Community infrastructure upgrade 2025",
    images: ["https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    paymentPlan: "Flexible Payment Options",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 950,
    infraImpact: {
      metro: { status: "planned", completion: "2026", impact: "High" },
      schools: { count: 6, avgDistance: 1.2 },
      hospitals: { count: 3, avgDistance: 2.5 }
    }
  }
];

// Infrastructure data for Dubai
const infrastructureData = [
  { type: 'metro', coordinates: [55.2744, 25.1972], name: 'Downtown Metro', status: 'operational' },
  { type: 'metro', coordinates: [55.1403, 25.0657], name: 'Marina Metro', status: 'operational' },
  { type: 'metro', coordinates: [55.2608, 25.1869], name: 'Business Bay Metro', status: 'operational' },
  { type: 'metro', coordinates: [55.2115, 25.0566], name: 'JVC Metro', status: 'planned-2026' },
  { type: 'school', coordinates: [55.2650, 25.1890], name: 'Dubai International School', rating: 4.8 },
  { type: 'school', coordinates: [55.1450, 25.0680], name: 'Marina International School', rating: 4.6 },
  { type: 'hospital', coordinates: [55.2720, 25.1950], name: 'Dubai Hospital', rating: 4.7 },
  { type: 'hospital', coordinates: [55.1380, 25.0640], name: 'Marina Medical Center', rating: 4.5 },
  { type: 'mall', coordinates: [55.2796, 25.1972], name: 'Dubai Mall', size: 'mega' },
  { type: 'mall', coordinates: [55.1420, 25.0670], name: 'Marina Mall', size: 'large' }
];

interface MapViewProps {
  userPreferences: any;
  onClose: () => void;
}

interface PropertyFilters {
  propertyTypes: string[];
  priceRange: [number, number];
  roiRange: [number, number];
  rentalYieldRange: [number, number];
  locations: string[];
  developerRating: number;
  projectStatus: string[];
  unitsLeft: [number, number];
}

interface MapLayer {
  id: string;
  name: string;
  description: string;
  active: boolean;
  color: string;
  type: 'heatmap' | 'overlay' | 'infrastructure';
}

export function MapView({ userPreferences, onClose }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const infrastructureMarkers = useRef<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'investor' | 'lifestyle'>('investor');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyTypes: ['Apartment', 'Villa'],
    priceRange: [500000, 20000000],
    roiRange: [5, 15],
    rentalYieldRange: [4, 12],
    locations: [],
    developerRating: 4,
    projectStatus: ['Ready to Move', 'Under Construction', 'Near Completion'],
    unitsLeft: [1, 200]
  });

  // Map layers for investor and lifestyle views
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: 'roi', name: 'ROI Heatmap', description: 'Return on Investment zones', active: true, color: '#10B981', type: 'heatmap' },
    { id: 'rental', name: 'Rental Index', description: 'Rental yield performance', active: false, color: '#3B82F6', type: 'heatmap' },
    { id: 'price', name: 'Price Heatmap', description: 'Price per square foot', active: false, color: '#F59E0B', type: 'heatmap' },
    { id: 'risk', name: 'Risk Zones', description: 'Investment risk assessment', active: false, color: '#EF4444', type: 'overlay' },
    { id: 'infrastructure', name: 'Infrastructure', description: 'Metro, schools, hospitals', active: true, color: '#8B5CF6', type: 'infrastructure' },
    { id: 'growth', name: 'Price Growth', description: 'Year-over-year price growth', active: false, color: '#EC4899', type: 'heatmap' }
  ]);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with Dubai center
    const mapboxgl = (window as any).mapboxgl;
    if (!mapboxgl) {
      // Load Mapbox GL JS
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js';
      script.onload = initializeMap;
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapContainer.current) return;
      
      const mapboxgl = (window as any).mapboxgl;
      mapboxgl.accessToken = 'pk.eyJ1Ijoia2h1c2hpLTExMDciLCJhIjoiY21lbzMwOTR3MHpwZDJqc2MydGZ1cTVhciJ9.DkLDO0YlTRnZshC8Uhl4aw';
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [55.2708, 25.2048], // Dubai center
        zoom: 11,
        pitch: 0,
        bearing: 0
      });

      map.current.on('load', () => {
        setMapLoaded(true);
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    return dubaiProperties.filter(property => {
      // Property type filter
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.type)) {
        return false;
      }

      // Price range filter
      if (property.priceMin < filters.priceRange[0] || property.priceMax > filters.priceRange[1]) {
        return false;
      }

      // ROI filter
      if (property.roi < filters.roiRange[0] || property.roi > filters.roiRange[1]) {
        return false;
      }

      // Rental yield filter
      if (property.rentalYield < filters.rentalYieldRange[0] || property.rentalYield > filters.rentalYieldRange[1]) {
        return false;
      }

      // Location filter
      if (filters.locations.length > 0 && !filters.locations.includes(property.location)) {
        return false;
      }

      // Developer rating filter
      if (property.developerRating < filters.developerRating) {
        return false;
      }

      // Project status filter
      if (filters.projectStatus.length > 0 && !filters.projectStatus.includes(property.projectStatus)) {
        return false;
      }

      // Units left filter
      if (property.unitsLeft < filters.unitsLeft[0] || property.unitsLeft > filters.unitsLeft[1]) {
        return false;
      }

      // Search query filter
      if (searchQuery && !property.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !property.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  // Add property markers to map
  const addPropertyMarkers = useCallback(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing property markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    filteredProperties.forEach(property => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'property-marker';
      el.innerHTML = `
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transition-transform hover:scale-110 ${
          property.type === 'Villa' ? 'bg-purple-500' :
          property.type === 'Apartment' ? 'bg-blue-500' :
          'bg-green-500'
        }">
          <span class="text-xs">${property.type === 'Villa' ? '🏠' : '🏢'}</span>
        </div>
      `;

      // Add click handler
      el.addEventListener('click', () => handlePropertyClick(property));
      
      // Add hover handlers
      el.addEventListener('mouseenter', () => setHoveredProperty(property.id));
      el.addEventListener('mouseleave', () => setHoveredProperty(null));

      // Create marker and add to map
      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat(property.coordinates)
        .addTo(map.current);
      
      markers.current.push(marker);
    });
  }, [mapLoaded, filteredProperties]);

  // Add infrastructure layer
  const addInfrastructureLayer = useCallback(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing infrastructure markers
    infrastructureMarkers.current.forEach(marker => marker.remove());
    infrastructureMarkers.current = [];

    infrastructureData.forEach(item => {
      const el = document.createElement('div');
      el.className = 'infrastructure-marker';
      
      let icon = '';
      let color = '';
      switch (item.type) {
        case 'metro':
          icon = '🚇';
          color = item.status === 'operational' ? 'bg-green-500' : 'bg-orange-500';
          break;
        case 'school':
          icon = '🏫';
          color = 'bg-blue-500';
          break;
        case 'hospital':
          icon = '🏥';
          color = 'bg-red-500';
          break;
        case 'mall':
          icon = '🛍️';
          color = 'bg-purple-500';
          break;
        default:
          icon = '📍';
          color = 'bg-gray-500';
      }

      el.innerHTML = `
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md ${color}">
          <span class="text-xs">${icon}</span>
        </div>
      `;

      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat(item.coordinates)
        .addTo(map.current);
      
      infrastructureMarkers.current.push(marker);
    });
  }, [mapLoaded]);

  // Initialize markers when map loads
  useEffect(() => {
    if (mapLoaded) {
      addPropertyMarkers();
      addInfrastructureLayer();
    }
  }, [mapLoaded, addPropertyMarkers, addInfrastructureLayer]);

  // Update map markers when filters change
  useEffect(() => {
    if (map.current && mapLoaded) {
      addPropertyMarkers();
    }
  }, [filteredProperties, addPropertyMarkers]);

  const handlePropertyClick = useCallback((property: any) => {
    setSelectedProperty(property);
    setShowPropertyPanel(true);
    
    // Fly to property location
    if (map.current) {
      map.current.flyTo({
        center: property.coordinates,
        zoom: 15,
        duration: 1000
      });
    }
  }, []);

  const toggleLayer = useCallback((layerId: string) => {
    setMapLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, active: !layer.active } : layer
    ));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      propertyTypes: ['Apartment', 'Villa'],
      priceRange: [500000, 20000000],
      roiRange: [5, 15],
      rentalYieldRange: [4, 12],
      locations: [],
      developerRating: 4,
      projectStatus: ['Ready to Move', 'Under Construction', 'Near Completion'],
      unitsLeft: [1, 200]
    });
    setSearchQuery('');
  }, []);

  const getUnitsLeftColor = (unitsLeft: number) => {
    if (unitsLeft <= 10) return 'text-red-600 font-semibold';
    if (unitsLeft <= 30) return 'text-orange-600 font-medium';
    return 'text-green-600';
  };

  const getPriceGrowthColor = (growth: number) => {
    if (growth >= 15) return 'text-green-600 font-semibold';
    if (growth >= 10) return 'text-blue-600 font-medium';
    if (growth >= 5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready to Move':
        return 'bg-green-100 text-green-800';
      case 'Under Construction':
        return 'bg-orange-100 text-orange-800';
      case 'Near Completion':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get recommended regions based on user preferences
  const getRecommendedRegions = () => {
    if (!userPreferences) return [];
    
    const { budget, investmentGoal, riskTolerance, propertyType } = userPreferences;
    
    return filteredProperties
      .filter(property => {
        if (budget && (property.priceMin > budget.max || property.priceMax < budget.min)) return false;
        if (propertyType && property.type !== propertyType) return false;
        if (riskTolerance === 'low' && property.riskLevel !== 'Low') return false;
        return true;
      })
      .map(property => property.location)
      .filter((location, index, arr) => arr.indexOf(location) === index)
      .slice(0, 3);
  };

  const recommendedRegions = getRecommendedRegions();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Dubai Investment Map</h1>
          <Badge variant="secondary" className="hidden sm:flex">
            {filteredProperties.length} properties found
          </Badge>
          {recommendedRegions.length > 0 && (
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600">Recommended:</span>
              {recommendedRegions.map(region => (
                <Badge key={region} variant="outline" className="text-xs">
                  {region}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'investor' ? 'default' : 'ghost'}
              onClick={() => setViewMode('investor')}
              className="px-3 py-1"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Investor
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'lifestyle' ? 'default' : 'ghost'}
              onClick={() => setViewMode('lifestyle')}
              className="px-3 py-1"
            >
              <Home className="h-4 w-4 mr-1" />
              Lifestyle
            </Button>
          </div>

          {/* Mobile Filter Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters & Layers</SheetTitle>
              </SheetHeader>
              {/* Mobile filter content */}
            </SheetContent>
          </Sheet>

          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Filters Sidebar - Desktop */}
        <div className={`hidden md:flex flex-col bg-white border-r transition-all duration-300 ${showFilters ? 'w-80' : 'w-0'} overflow-hidden`}>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters & Layers</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Map Layers */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4" />
                    <span className="font-medium">Map Layers</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-2">
                  {mapLayers
                    .filter(layer => viewMode === 'investor' ? 
                      ['roi', 'rental', 'price', 'risk', 'growth', 'infrastructure'].includes(layer.id) :
                      ['infrastructure'].includes(layer.id)
                    )
                    .map(layer => (
                    <div key={layer.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={layer.active}
                          onCheckedChange={() => toggleLayer(layer.id)}
                        />
                        <div>
                          <div className="font-medium text-sm">{layer.name}</div>
                          <div className="text-xs text-gray-500">{layer.description}</div>
                        </div>
                      </div>
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: layer.color }}
                      />
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Property Type Filter */}
              <div>
                <label className="font-medium mb-3 block">Property Type</label>
                <div className="space-y-2">
                  {['Apartment', 'Villa', 'Townhouse'].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.propertyTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters(prev => ({
                              ...prev,
                              propertyTypes: [...prev.propertyTypes, type]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              propertyTypes: prev.propertyTypes.filter(t => t !== type)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={type} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="font-medium mb-3 block">
                  Price Range: AED {(filters.priceRange[0] / 1000000).toFixed(1)}M - AED {(filters.priceRange[1] / 1000000).toFixed(1)}M
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                  max={20000000}
                  min={500000}
                  step={250000}
                  className="mt-2"
                />
              </div>

              {/* ROI Range */}
              <div>
                <label className="font-medium mb-3 block">
                  ROI Range: {filters.roiRange[0]}% - {filters.roiRange[1]}%
                </label>
                <Slider
                  value={filters.roiRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, roiRange: value as [number, number] }))}
                  max={15}
                  min={3}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              {/* Rental Yield Range */}
              <div>
                <label className="font-medium mb-3 block">
                  Rental Yield: {filters.rentalYieldRange[0]}% - {filters.rentalYieldRange[1]}%
                </label>
                <Slider
                  value={filters.rentalYieldRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, rentalYieldRange: value as [number, number] }))}
                  max={12}
                  min={3}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              {/* Developer Rating */}
              <div>
                <label className="font-medium mb-3 block">
                  Min Developer Rating: {filters.developerRating}+ ⭐
                </label>
                <Slider
                  value={[filters.developerRating]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, developerRating: value[0] }))}
                  max={5}
                  min={3}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              {/* Units Left Filter */}
              <div>
                <label className="font-medium mb-3 block">
                  Units Left: {filters.unitsLeft[0]} - {filters.unitsLeft[1]}
                </label>
                <Slider
                  value={filters.unitsLeft}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, unitsLeft: value as [number, number] }))}
                  max={200}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Project Status */}
              <div>
                <label className="font-medium mb-3 block">Project Status</label>
                <div className="space-y-2">
                  {['Ready to Move', 'Under Construction', 'Near Completion'].map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={status}
                        checked={filters.projectStatus.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters(prev => ({
                              ...prev,
                              projectStatus: [...prev.projectStatus, status]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              projectStatus: prev.projectStatus.filter(s => s !== status)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={status} className="text-sm">{status}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <Button variant="outline" onClick={resetFilters} className="w-full">
                Reset All Filters
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {!showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(true)}
              className="absolute top-4 left-4 z-40 bg-white shadow-md"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}

          {/* Mapbox Container */}
          <div ref={mapContainer} className="w-full h-full" />

          {/* Quick View Card for Hovered Property */}
          {hoveredProperty && (
            <div className="absolute top-4 right-4 z-30 w-80">
              {(() => {
                const property = dubaiProperties.find(p => p.id === hoveredProperty);
                if (!property) return null;
                
                return (
                  <Card className="shadow-xl border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg cursor-pointer hover:text-blue-600" 
                                     onClick={() => handlePropertyClick(property)}>
                            {property.name}
                          </CardTitle>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{property.location}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(property.projectStatus)}>
                          {property.projectStatus}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Critical Data at Top */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-semibold text-blue-600">{property.priceRange}</div>
                          <div className="text-xs text-gray-600">Price Range</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className={`text-lg font-semibold ${getUnitsLeftColor(property.unitsLeft)}`}>
                            {property.unitsLeft}
                          </div>
                          <div className="text-xs text-gray-600">Units Left</div>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{property.roi}%</div>
                          <div className="text-gray-600">ROI</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">{property.rentalYield}%</div>
                          <div className="text-gray-600">Yield</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-semibold ${getPriceGrowthColor(property.priceGrowthYoY)}`}>
                            {property.priceGrowthYoY}%
                          </div>
                          <div className="text-gray-600">Growth YoY</div>
                        </div>
                      </div>

                      {/* Developer Rating */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Developer:</span>
                        <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
                          <span className="text-sm font-medium">{property.developer}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium ml-1">{property.developerRating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Construction Status */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Construction Progress</span>
                          <span className="font-medium">{property.constructionStatus}%</span>
                        </div>
                        <Progress value={property.constructionStatus} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">
                          Completion: {property.completionDate}
                        </div>
                      </div>

                      {/* Unit Types */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Unit Types:</div>
                        <div className="flex flex-wrap gap-1">
                          {property.unitTypes.map((type: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          )}

          {/* No Results Message */}
          {filteredProperties.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
              <Card className="p-8 max-w-sm text-center">
                <div className="text-gray-400 mb-4">
                  <MapPin className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to see more properties
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Reset Filters
                </Button>
              </Card>
            </div>
          )}
        </div>

        {/* Property Detail Panel */}
        {showPropertyPanel && selectedProperty && (
          <div className="w-96 bg-white border-l flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Property Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowPropertyPanel(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Property Images */}
                <div className="space-y-3">
                  <ImageWithFallback
                    src={selectedProperty.aerialView}
                    alt="Aerial view"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <ImageWithFallback
                      src={selectedProperty.images[0]}
                      alt="Property"
                      className="w-full h-24 object-cover rounded"
                    />
                    <ImageWithFallback
                      src={selectedProperty.floorPlans[0]}
                      alt="Floor plan"
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div>
                  <h4 className="text-xl font-semibold mb-2">{selectedProperty.name}</h4>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedProperty.location}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {selectedProperty.priceRange}
                  </div>
                </div>

                {/* Infrastructure Impact */}
                {selectedProperty.governmentImpact && (
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-blue-700">Infrastructure Impact</div>
                          <div className="text-sm text-gray-600">{selectedProperty.governmentImpact}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Investment Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {viewMode === 'investor' ? 'Investment Metrics' : 'Lifestyle Metrics'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {viewMode === 'investor' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-2xl font-bold text-green-600">{selectedProperty.roi}%</div>
                        <div className="text-sm text-gray-600">ROI</div>
                        <div className="text-2xl font-bold text-purple-600">{selectedProperty.rentalYield}%</div>
                        <div className="text-sm text-gray-600">Rental Yield</div>
                        <div className="text-2xl font-bold text-blue-600">{selectedProperty.priceGrowthYoY}%</div>
                        <div className="text-sm text-gray-600">Price Growth</div>
                        <Badge className={getRiskColor(selectedProperty.riskLevel)}>
                          {selectedProperty.riskLevel}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">Risk Level</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-lg font-bold text-blue-600">{selectedProperty.metroDistance}km</div>
                        <div className="text-sm text-gray-600">To Metro</div>
                        <div className="text-lg font-bold text-green-600">{selectedProperty.schoolDistance}km</div>
                        <div className="text-sm text-gray-600">To Schools</div>
                        <div className="text-lg font-bold text-red-600">{selectedProperty.hospitalDistance}km</div>
                        <div className="text-sm text-gray-600">To Hospital</div>
                        <div className="text-lg font-bold text-purple-600">{selectedProperty.walkabilityScore}</div>
                        <div className="text-sm text-gray-600">Walk Score</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Construction Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Construction className="h-5 w-5 mr-2" />
                      Construction Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Progress</span>
                        <span className="font-semibold">{selectedProperty.constructionStatus}%</span>
                      </div>
                      <Progress value={selectedProperty.constructionStatus} className="h-3" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Completion Date:</span>
                        <span className="font-medium">{selectedProperty.completionDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedProperty.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unit Types:</span>
                      <span className="font-medium">{selectedProperty.unitTypes.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per Sq Ft:</span>
                      <span className="font-medium">AED {selectedProperty.pricePerSqft.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Plan:</span>
                      <span className="font-medium">{selectedProperty.paymentPlan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Units Left:</span>
                      <span className={`font-medium ${getUnitsLeftColor(selectedProperty.unitsLeft)}`}>
                        {selectedProperty.unitsLeft}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Additional Fees:</span>
                      <span className="font-medium">{selectedProperty.fees}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Developer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Developer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{selectedProperty.developer}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{selectedProperty.developerRating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Community Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Community Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.communityFeatures.map((feature: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Nearby Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Nearby Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedProperty.nearbyAmenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Project
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline">
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Property
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}