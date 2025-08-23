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
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Building, 
  CheckCircle, 
  MapPin, 
  Award,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  List,
  ArrowUpDown,
  Shield,
  Phone,
  Mail,
  Globe,
  Eye
} from 'lucide-react';

interface Developer {
  id: number;
  name: string;
  logo: string;
  bgColor: string;
  rating: number;
  totalProjects: number;
  completedProjects: number;
  ongoingProjects: number;
  totalUnitsDelivered: number;
  onTimeDeliveryRate: number;
  location: string;
  establishedYear: number;
  specialization: string[];
  projectTypes: string[];
  performanceScore: number;
  credentials: string[];
  description: string;
  recentProjects: string[];
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  legalStatus: {
    reraLicense: string;
    disputes: number;
    complianceScore: number;
  };
}

interface DeveloperListingProps {
  onClose: () => void;
  onDeveloperClick: (developer: Developer) => void;
}

const mockDevelopers: Developer[] = [
  {
    id: 1,
    name: "Emaar Properties",
    logo: "E",
    bgColor: "bg-blue-600",
    rating: 4.9,
    totalProjects: 45,
    completedProjects: 42,
    ongoingProjects: 3,
    totalUnitsDelivered: 12500,
    onTimeDeliveryRate: 98,
    location: "Dubai, UAE",
    establishedYear: 1997,
    specialization: ["Luxury Residential", "Mixed-use", "Retail"],
    projectTypes: ["Residential", "Commercial", "Mixed-use"],
    performanceScore: 95,
    credentials: ["RERA Verified", "Award Winner", "ISO Certified"],
    description: "Leading real estate developer in the UAE, known for iconic projects like Burj Khalifa and Dubai Mall.",
    recentProjects: ["Dubai Hills Estate", "Creek Harbour", "Downtown Dubai"],
    contactInfo: {
      phone: "+971 4 367 3333",
      email: "info@emaar.ae",
      website: "www.emaar.com"
    },
    legalStatus: {
      reraLicense: "RERA-DEV-001",
      disputes: 0,
      complianceScore: 98
    }
  },
  {
    id: 2,
    name: "DAMAC Properties",
    logo: "D",
    bgColor: "bg-green-600",
    rating: 4.7,
    totalProjects: 38,
    completedProjects: 35,
    ongoingProjects: 3,
    totalUnitsDelivered: 8900,
    onTimeDeliveryRate: 95,
    location: "Dubai, UAE",
    establishedYear: 2002,
    specialization: ["Luxury Apartments", "Villas", "Hotels"],
    projectTypes: ["Residential", "Commercial"],
    performanceScore: 88,
    credentials: ["RERA Verified", "ISO Certified", "Green Building"],
    description: "Luxury real estate developer known for premium residential, commercial and leisure properties.",
    recentProjects: ["Marina Heights", "Akoya Oxygen", "DAMAC Hills"],
    contactInfo: {
      phone: "+971 4 420 0000",
      email: "info@damacproperties.com",
      website: "www.damacproperties.com"
    },
    legalStatus: {
      reraLicense: "RERA-DEV-002",
      disputes: 0,
      complianceScore: 94
    }
  },
  {
    id: 3,
    name: "Sobha Realty",
    logo: "S",
    bgColor: "bg-purple-600",
    rating: 4.8,
    totalProjects: 28,
    completedProjects: 25,
    ongoingProjects: 3,
    totalUnitsDelivered: 6200,
    onTimeDeliveryRate: 97,
    location: "Dubai, UAE",
    establishedYear: 2003,
    specialization: ["Premium Residential", "Villas", "Apartments"],
    projectTypes: ["Residential"],
    performanceScore: 92,
    credentials: ["RERA Verified", "Quality Excellence", "Green Certified"],
    description: "Known for crafting premium residential properties with exceptional attention to detail and quality.",
    recentProjects: ["Sobha Hartland", "One JBR", "Sobha Creek Vistas"],
    contactInfo: {
      phone: "+971 4 440 1111",
      email: "info@sobharealty.com",
      website: "www.sobharealty.com"
    },
    legalStatus: {
      reraLicense: "RERA-DEV-003",
      disputes: 0,
      complianceScore: 96
    }
  },
  {
    id: 4,
    name: "Nakheel",
    logo: "N",
    bgColor: "bg-orange-600",
    rating: 4.6,
    totalProjects: 32,
    completedProjects: 28,
    ongoingProjects: 4,
    totalUnitsDelivered: 15800,
    onTimeDeliveryRate: 93,
    location: "Dubai, UAE",
    establishedYear: 2000,
    specialization: ["Master Development", "Islands", "Mega Projects"],
    projectTypes: ["Residential", "Commercial", "Mixed-use"],
    performanceScore: 85,
    credentials: ["RERA Verified", "Innovation Award"],
    description: "World-leading master developer known for iconic developments like Palm Jumeirah and The World Islands.",
    recentProjects: ["Palm Jumeirah", "The World Islands", "Dragon City"],
    contactInfo: {
      phone: "+971 4 390 3333",
      email: "info@nakheel.com",
      website: "www.nakheel.com"
    },
    legalStatus: {
      reraLicense: "RERA-DEV-004",
      disputes: 1,
      complianceScore: 91
    }
  },
  {
    id: 5,
    name: "Dubai Properties",
    logo: "DP",
    bgColor: "bg-indigo-600",
    rating: 4.5,
    totalProjects: 25,
    completedProjects: 22,
    ongoingProjects: 3,
    totalUnitsDelivered: 5400,
    onTimeDeliveryRate: 91,
    location: "Dubai, UAE",
    establishedYear: 2004,
    specialization: ["Residential Communities", "Commercial", "Retail"],
    projectTypes: ["Residential", "Commercial"],
    performanceScore: 82,
    credentials: ["RERA Verified", "Sustainability Award"],
    description: "Dedicated to creating integrated communities and commercial developments across Dubai.",
    recentProjects: ["Jumeirah Beach Residence", "Business Bay", "Culture Village"],
    contactInfo: {
      phone: "+971 4 365 6666",
      email: "info@dubaiproperties.ae",
      website: "www.dubaiproperties.ae"
    },
    legalStatus: {
      reraLicense: "RERA-DEV-005",
      disputes: 0,
      complianceScore: 89
    }
  },
  {
    id: 6,
    name: "Meraas Holding",
    logo: "M",
    bgColor: "bg-teal-600",
    rating: 4.4,
    totalProjects: 20,
    completedProjects: 17,
    ongoingProjects: 3,
    totalUnitsDelivered: 3200,
    onTimeDeliveryRate: 89,
    location: "Dubai, UAE",
    establishedYear: 2007,
    specialization: ["Mixed-use", "Entertainment", "Lifestyle"],
    projectTypes: ["Mixed-use", "Commercial"],
    performanceScore: 78,
    credentials: ["RERA Verified", "Design Excellence"],
    description: "Creating innovative lifestyle destinations and mixed-use developments in Dubai.",
    recentProjects: ["City Walk", "La Mer", "Bluewaters Island"],
    contactInfo: {
      phone: "+971 4 375 8888",
      email: "info@meraas.ae",
      website: "www.meraas.ae"
    },
    legalStatus: {
      reraLicense: "RERA-DEV-006",
      disputes: 0,
      complianceScore: 87
    }
  }
];

export function DeveloperListing({ onClose, onDeveloperClick }: DeveloperListingProps) {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter states
  const [ratingRange, setRatingRange] = useState([1, 5]);
  const [projectsRange, setProjectsRange] = useState([0, 50]);
  const [deliveryRateRange, setDeliveryRateRange] = useState([80, 100]);
  const [performanceScoreRange, setPerformanceScoreRange] = useState([70, 100]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rating-high');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter options
  const locations = ['Dubai, UAE', 'Abu Dhabi, UAE', 'Sharjah, UAE'];
  const projectTypes = ['Residential', 'Commercial', 'Mixed-use'];
  const specializations = ['Luxury Residential', 'Mixed-use', 'Retail', 'Luxury Apartments', 'Villas', 'Hotels', 'Premium Residential', 'Master Development', 'Islands', 'Mega Projects', 'Residential Communities', 'Entertainment', 'Lifestyle'];

  // Filter and search logic
  const filteredDevelopers = useMemo(() => {
    let filtered = mockDevelopers.filter(developer => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        developer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        developer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        developer.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));

      // Rating filter
      const matchesRating = developer.rating >= ratingRange[0] && developer.rating <= ratingRange[1];

      // Projects filter
      const matchesProjects = developer.totalProjects >= projectsRange[0] && developer.totalProjects <= projectsRange[1];

      // Delivery rate filter
      const matchesDeliveryRate = developer.onTimeDeliveryRate >= deliveryRateRange[0] && developer.onTimeDeliveryRate <= deliveryRateRange[1];

      // Performance score filter
      const matchesPerformanceScore = developer.performanceScore >= performanceScoreRange[0] && developer.performanceScore <= performanceScoreRange[1];

      // Location filter
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(developer.location);

      // Project type filter
      const matchesProjectType = selectedProjectTypes.length === 0 || selectedProjectTypes.some(type => developer.projectTypes.includes(type));

      // Specialization filter
      const matchesSpecialization = selectedSpecializations.length === 0 || selectedSpecializations.some(spec => developer.specialization.includes(spec));

      return matchesSearch && matchesRating && matchesProjects && matchesDeliveryRate && 
             matchesPerformanceScore && matchesLocation && matchesProjectType && matchesSpecialization;
    });

    // Sorting
    switch (sortBy) {
      case 'rating-high':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'projects-high':
        filtered.sort((a, b) => b.totalProjects - a.totalProjects);
        break;
      case 'projects-low':
        filtered.sort((a, b) => a.totalProjects - b.totalProjects);
        break;
      case 'delivery-rate':
        filtered.sort((a, b) => b.onTimeDeliveryRate - a.onTimeDeliveryRate);
        break;
      case 'performance-score':
        filtered.sort((a, b) => b.performanceScore - a.performanceScore);
        break;
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, ratingRange, projectsRange, deliveryRateRange, performanceScoreRange, selectedLocations, selectedProjectTypes, selectedSpecializations, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDevelopers.length / itemsPerPage);
  const paginatedDevelopers = filteredDevelopers.slice(
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
    setRatingRange([1, 5]);
    setProjectsRange([0, 50]);
    setDeliveryRateRange([80, 100]);
    setPerformanceScoreRange([70, 100]);
    setSelectedLocations([]);
    setSelectedProjectTypes([]);
    setSelectedSpecializations([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    return 'Average';
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
                <h1 className="text-2xl font-bold text-gray-900">Developer Directory</h1>
                <p className="text-sm text-gray-500">{filteredDevelopers.length} verified developers</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search developers, locations, specializations..."
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
                    <SelectItem value="rating-high">Rating: Highest First</SelectItem>
                    <SelectItem value="rating-low">Rating: Lowest First</SelectItem>
                    <SelectItem value="projects-high">Projects: Most First</SelectItem>
                    <SelectItem value="projects-low">Projects: Least First</SelectItem>
                    <SelectItem value="delivery-rate">Delivery Rate: Highest</SelectItem>
                    <SelectItem value="performance-score">Performance Score</SelectItem>
                    <SelectItem value="name-az">Name: A to Z</SelectItem>
                    <SelectItem value="name-za">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {paginatedDevelopers.length} of {filteredDevelopers.length} developers
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
                  {/* Rating Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Developer Rating
                    </label>
                    <Slider
                      value={ratingRange}
                      onValueChange={setRatingRange}
                      max={5}
                      min={1}
                      step={0.1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{ratingRange[0].toFixed(1)} Stars</span>
                      <span>{ratingRange[1].toFixed(1)} Stars</span>
                    </div>
                  </div>

                  {/* Projects Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Number of Projects
                    </label>
                    <Slider
                      value={projectsRange}
                      onValueChange={setProjectsRange}
                      max={50}
                      min={0}
                      step={1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{projectsRange[0]} Projects</span>
                      <span>{projectsRange[1]} Projects</span>
                    </div>
                  </div>

                  {/* Delivery Rate Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      On-Time Delivery Rate (%)
                    </label>
                    <Slider
                      value={deliveryRateRange}
                      onValueChange={setDeliveryRateRange}
                      max={100}
                      min={80}
                      step={1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{deliveryRateRange[0]}%</span>
                      <span>{deliveryRateRange[1]}%</span>
                    </div>
                  </div>

                  {/* Performance Score */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Performance Score
                    </label>
                    <Slider
                      value={performanceScoreRange}
                      onValueChange={setPerformanceScoreRange}
                      max={100}
                      min={70}
                      step={1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{performanceScoreRange[0]}</span>
                      <span>{performanceScoreRange[1]}</span>
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

                  {/* Project Types */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Project Types</label>
                    <div className="space-y-2">
                      {projectTypes.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={selectedProjectTypes.includes(type)}
                            onCheckedChange={() => toggleFilter(type, selectedProjectTypes, setSelectedProjectTypes)}
                          />
                          <label htmlFor={type} className="text-sm cursor-pointer">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Specializations</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {[...new Set(specializations)].map(spec => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox
                            id={spec}
                            checked={selectedSpecializations.includes(spec)}
                            onCheckedChange={() => toggleFilter(spec, selectedSpecializations, setSelectedSpecializations)}
                          />
                          <label htmlFor={spec} className="text-sm cursor-pointer">
                            {spec}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Developer Grid */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {filteredDevelopers.length === 0 ? (
              <Card className="p-12 text-center">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No developers found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
                <Button onClick={clearAllFilters}>Clear All Filters</Button>
              </Card>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
                }`}>
                  {paginatedDevelopers.map((developer) => (
                    <Card key={developer.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 ${developer.bgColor} rounded-full flex items-center justify-center`}>
                              <span className="text-white font-bold">{developer.logo}</span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{developer.name}</CardTitle>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">{developer.rating}</span>
                                <span className="text-sm text-gray-500">({developer.totalProjects} projects)</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getPerformanceColor(developer.performanceScore)}>
                            {getPerformanceLabel(developer.performanceScore)}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {developer.location}
                          <span className="ml-2 text-xs">Est. {developer.establishedYear}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-semibold text-blue-600">{developer.completedProjects}</div>
                            <div className="text-gray-600">Completed</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-semibold text-green-600">{developer.totalUnitsDelivered.toLocaleString()}</div>
                            <div className="text-gray-600">Units</div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>On-Time Delivery</span>
                            <span className="font-medium">{developer.onTimeDeliveryRate}%</span>
                          </div>
                          <Progress value={developer.onTimeDeliveryRate} className="h-2" />
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700">Specializations:</div>
                          <div className="flex flex-wrap gap-1">
                            {developer.specialization.slice(0, 2).map((spec, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                            {developer.specialization.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{developer.specialization.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700">Credentials:</div>
                          <div className="flex flex-wrap gap-1">
                            {developer.credentials.slice(0, 2).map((credential, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {credential === "RERA Verified" && <Shield className="h-3 w-3 mr-1" />}
                                {credential === "Award Winner" && <Award className="h-3 w-3 mr-1" />}
                                {credential}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Recent: {developer.recentProjects.slice(0, 2).join(', ')}
                        </div>
                      </CardContent>

                      <CardFooter className="pt-3">
                        <div className="flex space-x-2 w-full">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => onDeveloperClick(developer)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Phone className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
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
    </div>
  );
}