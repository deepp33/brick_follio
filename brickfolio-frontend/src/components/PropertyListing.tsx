import { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from './ui/sheet';
import { 
  Search, 
  Filter, 
  X, 
  MapPin, 
  TrendingUp, 
  Calendar, 
  Star, 
  Heart, 
  Eye, 
  Home,
  Building,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  List,
  ArrowUpDown
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Property {
  id: number;
  name: string;
  developer: {
    name: string;
    rating: number;
    id: number;
  };
  price: {
    min: number;
    max: number;
  };
  location: string;
  roi: number;
  rentalYield: number;
  rating: number;
  completionStatus: 'Ready-to-Move' | 'Under Construction' | 'Off-Plan';
  completionPercentage: number;
  completionDate: string;
  propertyType: 'Apartment' | 'Villa' | 'Townhouse' | 'Commercial' | 'Office' | 'Retail';
  projectType: 'Residential' | 'Commercial' | 'Mixed-use';
  unitsAvailable: number;
  totalUnits: number;
  image: string;
  amenities: string[];
  description: string;
  paymentPlan: string;
  handoverDate: string;
}

interface PropertyListingProps {
  onClose: () => void;
}

const mockProperties: Property[] = [
  {
    id: 1,
    name: "Marina Heights Residences",
    developer: { name: "Emaar Properties", rating: 4.9, id: 1 },
    price: { min: 950000, max: 2100000 },
    location: "Dubai Marina",
    roi: 7.2,
    rentalYield: 6.8,
    rating: 4.6,
    completionStatus: "Under Construction",
    completionPercentage: 65,
    completionDate: "Q2 2025",
    propertyType: "Apartment",
    projectType: "Residential",
    unitsAvailable: 45,
    totalUnits: 120,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTU5NDIyMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["Swimming Pool", "Gym", "Beach Access", "Concierge"],
    description: "Luxury waterfront apartments with stunning marina views",
    paymentPlan: "20% down, 80% on handover",
    handoverDate: "June 2025"
  },
  {
    id: 2,
    name: "Dubai Hills Villa Collection",
    developer: { name: "Emaar Properties", rating: 4.9, id: 1 },
    price: { min: 2800000, max: 4500000 },
    location: "Dubai Hills Estate",
    roi: 8.5,
    rentalYield: 7.2,
    rating: 4.8,
    completionStatus: "Off-Plan",
    completionPercentage: 25,
    completionDate: "Q4 2025",
    propertyType: "Villa",
    projectType: "Residential",
    unitsAvailable: 12,
    totalUnits: 50,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYXxlbnwxfHx8fDE3NTU5NDIyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["Private Garden", "Golf Course Access", "Club House", "Security"],
    description: "Premium villas in Dubai's most prestigious golf community",
    paymentPlan: "25% down, 75% on handover",
    handoverDate: "December 2025"
  },
  {
    id: 3,
    name: "Business Bay Tower",
    developer: { name: "DAMAC Properties", rating: 4.7, id: 2 },
    price: { min: 1200000, max: 3200000 },
    location: "Business Bay",
    roi: 9.1,
    rentalYield: 8.5,
    rating: 4.9,
    completionStatus: "Under Construction",
    completionPercentage: 85,
    completionDate: "Q1 2025",
    propertyType: "Apartment",
    projectType: "Mixed-use",
    unitsAvailable: 8,
    totalUnits: 200,
    image: "https://images.unsplash.com/photo-1426122402199-be02db90eb90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza3lzY3JhcGVyJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzU1OTQyMjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["Sky Lounge", "Business Center", "Retail Podium", "Valet Parking"],
    description: "Modern high-rise in the heart of Dubai's business district",
    paymentPlan: "30% down, 70% on handover",
    handoverDate: "March 2025"
  },
  {
    id: 4,
    name: "Downtown Luxury Residences",
    developer: { name: "Sobha Realty", rating: 4.8, id: 3 },
    price: { min: 1350000, max: 2800000 },
    location: "Downtown Dubai",
    roi: 6.8,
    rentalYield: 6.2,
    rating: 4.7,
    completionStatus: "Ready-to-Move",
    completionPercentage: 100,
    completionDate: "Ready",
    propertyType: "Apartment",
    projectType: "Residential",
    unitsAvailable: 3,
    totalUnits: 150,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTU5NDIyMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["Infinity Pool", "Spa", "Shopping Mall Access", "Metro Connection"],
    description: "Ready-to-move luxury apartments with Burj Khalifa views",
    paymentPlan: "Cash purchase available",
    handoverDate: "Immediate"
  },
  {
    id: 5,
    name: "Palm Jumeirah Waterfront Villas",
    developer: { name: "Nakheel", rating: 4.6, id: 4 },
    price: { min: 4500000, max: 8000000 },
    location: "Palm Jumeirah",
    roi: 5.9,
    rentalYield: 5.5,
    rating: 4.5,
    completionStatus: "Under Construction",
    completionPercentage: 70,
    completionDate: "Q3 2025",
    propertyType: "Villa",
    projectType: "Residential",
    unitsAvailable: 5,
    totalUnits: 25,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRlcmZyb250JTIwaG91c2V8ZW58MXx8fHwxNzU1OTQyMjA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["Private Beach", "Marina Berth", "24/7 Security", "Housekeeping"],
    description: "Exclusive waterfront villas on Dubai's iconic Palm Jumeirah",
    paymentPlan: "50% down, 50% on handover",
    handoverDate: "September 2025"
  },
  {
    id: 6,
    name: "Commercial Hub Offices",
    developer: { name: "DAMAC Properties", rating: 4.7, id: 2 },
    price: { min: 800000, max: 2500000 },
    location: "DIFC",
    roi: 10.2,
    rentalYield: 9.8,
    rating: 4.4,
    completionStatus: "Ready-to-Move",
    completionPercentage: 100,
    completionDate: "Ready",
    propertyType: "Office",
    projectType: "Commercial",
    unitsAvailable: 15,
    totalUnits: 80,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTU5NDIyMDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    amenities: ["High-speed Internet", "Meeting Rooms", "Reception Services", "Parking"],
    description: "Premium office spaces in Dubai's financial district",
    paymentPlan: "Full payment on purchase",
    handoverDate: "Immediate"
  }
];

export function PropertyListing({ onClose }: PropertyListingProps) {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([300000, 8000000]);
  const [roiRange, setRoiRange] = useState([3, 12]);
  const [rentalYieldRange, setRentalYieldRange] = useState([2, 10]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCompletionStatus, setSelectedCompletionStatus] = useState<string[]>([]);
  const [minDeveloperRating, setMinDeveloperRating] = useState([3]);
  const [sortBy, setSortBy] = useState('price-low');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter options
  const propertyTypes = ['Apartment', 'Villa', 'Townhouse', 'Commercial', 'Office', 'Retail'];
  const projectTypes = ['Residential', 'Commercial', 'Mixed-use'];
  const locations = ['Dubai Marina', 'Dubai Hills Estate', 'Business Bay', 'Downtown Dubai', 'Palm Jumeirah', 'DIFC'];
  const completionStatuses = ['Ready-to-Move', 'Under Construction', 'Off-Plan'];

  // Filter and search logic
  const filteredProperties = useMemo(() => {
    let filtered = mockProperties.filter(property => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.developer.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Price filter
      const matchesPrice = property.price.min >= priceRange[0] && property.price.max <= priceRange[1];

      // ROI filter
      const matchesRoi = property.roi >= roiRange[0] && property.roi <= roiRange[1];

      // Rental yield filter
      const matchesRentalYield = property.rentalYield >= rentalYieldRange[0] && property.rentalYield <= rentalYieldRange[1];

      // Property type filter
      const matchesPropertyType = selectedPropertyTypes.length === 0 || selectedPropertyTypes.includes(property.propertyType);

      // Project type filter
      const matchesProjectType = selectedProjectTypes.length === 0 || selectedProjectTypes.includes(property.projectType);

      // Location filter
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(property.location);

      // Completion status filter
      const matchesCompletionStatus = selectedCompletionStatus.length === 0 || selectedCompletionStatus.includes(property.completionStatus);

      // Developer rating filter
      const matchesDeveloperRating = property.developer.rating >= minDeveloperRating[0];

      return matchesSearch && matchesPrice && matchesRoi && matchesRentalYield && 
             matchesPropertyType && matchesProjectType && matchesLocation && 
             matchesCompletionStatus && matchesDeveloperRating;
    });

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price.min - b.price.min);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price.min - a.price.min);
        break;
      case 'roi-high':
        filtered.sort((a, b) => b.roi - a.roi);
        break;
      case 'roi-low':
        filtered.sort((a, b) => a.roi - b.roi);
        break;
      case 'rating-high':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'completion-date':
        filtered.sort((a, b) => {
          if (a.completionStatus === 'Ready-to-Move') return -1;
          if (b.completionStatus === 'Ready-to-Move') return 1;
          return a.completionPercentage - b.completionPercentage;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, priceRange, roiRange, rentalYieldRange, selectedPropertyTypes, selectedProjectTypes, selectedLocations, selectedCompletionStatus, minDeveloperRating, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper functions
  const toggleFilter = (value: string, setterArray: string[], setter: (value: string[]) => void) => {
    if (setterArray.includes(value)) {
      setter(setterArray.filter(item => item !== value));
    } else {
      setter([...setterArray, value]);
    }
  };

  const clearAllFilters = () => {
    setPriceRange([300000, 8000000]);
    setRoiRange([3, 12]);
    setRentalYieldRange([2, 10]);
    setSelectedPropertyTypes([]);
    setSelectedProjectTypes([]);
    setSelectedLocations([]);
    setSelectedCompletionStatus([]);
    setMinDeveloperRating([3]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getCompletionStatusColor = (status: string) => {
    switch (status) {
      case 'Ready-to-Move':
        return 'bg-green-100 text-green-800';
      case 'Under Construction':
        return 'bg-orange-100 text-orange-800';
      case 'Off-Plan':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    return `${(price / 1000).toFixed(0)}K`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onClose} className="p-2">
                <X className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Property Listings</h1>
                <p className="text-sm text-gray-500">{filteredProperties.length} properties available</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search properties, locations, developers..."
                  className="pl-10 w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Sort and Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="roi-high">ROI: High to Low</SelectItem>
                    <SelectItem value="roi-low">ROI: Low to High</SelectItem>
                    <SelectItem value="rating-high">Rating: Highest First</SelectItem>
                    <SelectItem value="completion-date">Completion Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {paginatedProperties.length} of {filteredProperties.length} properties
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Filter className="h-5 w-5 mr-2" />
                      Filters
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Price Range (AED)
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000000}
                      min={300000}
                      step={50000}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>AED {formatPrice(priceRange[0])}</span>
                      <span>AED {formatPrice(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* ROI Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      ROI Range (%)
                    </label>
                    <Slider
                      value={roiRange}
                      onValueChange={setRoiRange}
                      max={15}
                      min={3}
                      step={0.1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{roiRange[0]}%</span>
                      <span>{roiRange[1]}%</span>
                    </div>
                  </div>

                  {/* Rental Yield */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Rental Yield (%)
                    </label>
                    <Slider
                      value={rentalYieldRange}
                      onValueChange={setRentalYieldRange}
                      max={12}
                      min={2}
                      step={0.1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{rentalYieldRange[0]}%</span>
                      <span>{rentalYieldRange[1]}%</span>
                    </div>
                  </div>

                  {/* Property Types */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Property Types</label>
                    <div className="space-y-2">
                      {propertyTypes.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={selectedPropertyTypes.includes(type)}
                            onCheckedChange={() => toggleFilter(type, selectedPropertyTypes, setSelectedPropertyTypes)}
                          />
                          <label htmlFor={type} className="text-sm cursor-pointer">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Locations */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Locations</label>
                    <div className="space-y-2">
                      {locations.map(location => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox
                            id={location}
                            checked={selectedLocations.includes(location)}
                            onCheckedChange={() => toggleFilter(location, selectedLocations, setSelectedLocations)}
                          />
                          <label htmlFor={location} className="text-sm cursor-pointer">
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Completion Status */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Completion Status</label>
                    <div className="space-y-2">
                      {completionStatuses.map(status => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={status}
                            checked={selectedCompletionStatus.includes(status)}
                            onCheckedChange={() => toggleFilter(status, selectedCompletionStatus, setSelectedCompletionStatus)}
                          />
                          <label htmlFor={status} className="text-sm cursor-pointer">
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Developer Rating */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Minimum Developer Rating
                    </label>
                    <Slider
                      value={minDeveloperRating}
                      onValueChange={setMinDeveloperRating}
                      max={5}
                      min={1}
                      step={0.1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>1 Star</span>
                      <span>{minDeveloperRating[0].toFixed(1)} Stars</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Property Grid */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {filteredProperties.length === 0 ? (
              <Card className="p-12 text-center">
                <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
                <Button onClick={clearAllFilters}>Clear All Filters</Button>
              </Card>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
                }`}>
                  {paginatedProperties.map((property) => (
                    <Card key={property.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="relative">
                        <ImageWithFallback
                          src={property.image}
                          alt={property.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={getCompletionStatusColor(property.completionStatus)}>
                            {property.completionStatus}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="secondary" className="bg-white/90">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        {property.completionStatus !== 'Ready-to-Move' && (
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="bg-white/90 rounded-lg p-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Construction Progress</span>
                                <span>{property.completionPercentage}%</span>
                              </div>
                              <Progress value={property.completionPercentage} className="h-1" />
                            </div>
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg mb-1">{property.name}</CardTitle>
                            <p className="text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                              by {property.developer.name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{property.rating}</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.location}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              AED {formatPrice(property.price.min)} - {formatPrice(property.price.max)}
                            </div>
                            <div className="text-sm text-gray-600">{property.propertyType}</div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-green-600">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              <span className="font-medium">{property.roi}% ROI</span>
                            </div>
                            <div className="text-sm text-gray-600">{property.rentalYield}% Yield</div>
                          </div>
                        </div>

                        {property.completionStatus !== 'Ready-to-Move' && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            Handover: {property.handoverDate}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {property.unitsAvailable} units available
                          </span>
                          <Badge variant="secondary">
                            {property.projectType}
                          </Badge>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-3">
                        <div className="flex space-x-2 w-full">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedProperty(property)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {/* <Button size="sm" variant="outline" className="flex-1">
                            Contact Developer
                          </Button> */}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Property Detail Drawer */}
      <Sheet open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        <SheetContent 
          side="right" 
          className="w-full sm:w-[600px] lg:w-[700px] xl:w-[800px] overflow-y-auto bg-white/95 backdrop-blur-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {selectedProperty && (
            <>
              <SheetHeader className="pb-6">
                <SheetTitle className="text-2xl font-bold text-left">
                  {selectedProperty.name}
                </SheetTitle>
                <SheetDescription className="text-left">
                  Detailed information about this property including investment metrics, amenities, and construction progress.
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6">
                {/* Property Image */}
                <div className="relative">
                  <ImageWithFallback
                    src={selectedProperty.image}
                    alt={selectedProperty.name}
                    className="w-full h-48 sm:h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${selectedProperty.completionStatus === 'Ready-to-Move' ? 'bg-green-100 text-green-800' : 
                      selectedProperty.completionStatus === 'Under Construction' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                      {selectedProperty.completionStatus}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-white/90 rounded-lg px-2 py-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{selectedProperty.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Developer Info */}
                <div>
                  <p className="text-lg text-gray-600 mb-2">by {selectedProperty.developer.name}</p>
                  <p className="text-gray-700 mb-4">{selectedProperty.description}</p>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedProperty.location}
                  </div>
                </div>

                {/* Investment Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">
                          AED {(selectedProperty.price.min / 1000000).toFixed(1)}M - {(selectedProperty.price.max / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-gray-600">Price Range</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{selectedProperty.roi}%</div>
                        <div className="text-sm text-gray-600">ROI</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">{selectedProperty.rentalYield}%</div>
                        <div className="text-sm text-gray-600">Rental Yield</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-xl font-bold text-orange-600">{selectedProperty.unitsAvailable}</div>
                        <div className="text-sm text-gray-600">Units Available</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Type:</span>
                        <span className="font-semibold">{selectedProperty.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Project Type:</span>
                        <span className="font-semibold">{selectedProperty.projectType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Plan:</span>
                        <span className="font-semibold text-sm">{selectedProperty.paymentPlan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Handover:</span>
                        <span className="font-semibold">{selectedProperty.handoverDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Construction Progress */}
                {selectedProperty.completionStatus !== 'Ready-to-Move' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Construction Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{selectedProperty.completionPercentage}% Complete</span>
                        </div>
                        <Progress value={selectedProperty.completionPercentage} className="h-3" />
                        <div className="text-sm text-gray-600">
                          Expected completion: {selectedProperty.completionDate}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities & Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProperty.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t">
                  <Button className="w-full" size="lg">
                    Request More Information
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full">
                      <Heart className="h-4 w-4 mr-2" />
                      Save Property
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Viewing
                    </Button>
                  </div>
                  <Button variant="ghost" className="w-full">
                    Contact Developer
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}