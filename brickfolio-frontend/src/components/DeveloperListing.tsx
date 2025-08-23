import { useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getDevelopers } from '../features/users/usersSlice';
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

// Helper function to get background color based on developer name
const getDeveloperBgColor = (name: string) => {
  const colors = [
    'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600',
    'bg-red-600', 'bg-indigo-600', 'bg-pink-600', 'bg-teal-600'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Helper function to get logo from name
const getDeveloperLogo = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

interface DeveloperListingProps {
  onClose: () => void;
  onDeveloperClick: (developer: any) => void;
}



export function DeveloperListing({ onClose, onDeveloperClick }: DeveloperListingProps) {
  const dispatch = useAppDispatch();
  const { developers, loading, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(getDevelopers());
  }, [dispatch]);

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

  // Filter options - dynamically generated from developers data
  const locations = useMemo(() => {
    const uniqueLocations = new Set<string>();
    developers.forEach(developer => {
      const location = developer.developerProfile?.location || developer.city;
      if (location) uniqueLocations.add(location);
    });
    return Array.from(uniqueLocations);
  }, [developers]);

  const projectTypes = useMemo(() => {
    const uniqueTypes = new Set<string>();
    developers.forEach(developer => {
      developer.developerProfile?.specializations?.forEach(spec => uniqueTypes.add(spec));
    });
    return Array.from(uniqueTypes);
  }, [developers]);

  const specializations = useMemo(() => {
    const uniqueSpecs = new Set<string>();
    developers.forEach(developer => {
      developer.developerProfile?.specializations?.forEach(spec => uniqueSpecs.add(spec));
    });
    return Array.from(uniqueSpecs);
  }, [developers]);

  // Filter and search logic
  const filteredDevelopers = useMemo(() => {
    let filtered = developers.filter(developer => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        developer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (developer.developerProfile?.location || developer.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        developer.developerProfile?.specializations?.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) || false;

      // Rating filter
      const matchesRating = (developer.developerProfile?.rating || 0) >= ratingRange[0] && (developer.developerProfile?.rating || 0) <= ratingRange[1];

      // Projects filter
      const matchesProjects = (developer.developerProfile?.totalProjects || 0) >= projectsRange[0] && (developer.developerProfile?.totalProjects || 0) <= projectsRange[1];

      // Delivery rate filter
      const matchesDeliveryRate = (developer.developerProfile?.deliveryTrackRecord?.onTime || 0) >= deliveryRateRange[0] && (developer.developerProfile?.deliveryTrackRecord?.onTime || 0) <= deliveryRateRange[1];

      // Performance score filter
      const matchesPerformanceScore = (developer.developerProfile?.successRate || 0) >= performanceScoreRange[0] && (developer.developerProfile?.successRate || 0) <= performanceScoreRange[1];

      // Location filter
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(developer.developerProfile?.location || developer.city || '');

      // Project type filter - using specializations as project types
      const matchesProjectType = selectedProjectTypes.length === 0 || selectedProjectTypes.some(type => developer.developerProfile?.specializations?.includes(type) || false);

      // Specialization filter
      const matchesSpecialization = selectedSpecializations.length === 0 || selectedSpecializations.some(spec => developer.developerProfile?.specializations?.includes(spec) || false);

      return matchesSearch && matchesRating && matchesProjects && matchesDeliveryRate && 
             matchesPerformanceScore && matchesLocation && matchesProjectType && matchesSpecialization;
    });

    // Sorting
    switch (sortBy) {
      case 'rating-high':
        filtered.sort((a, b) => (b.developerProfile?.rating || 0) - (a.developerProfile?.rating || 0));
        break;
      case 'rating-low':
        filtered.sort((a, b) => (a.developerProfile?.rating || 0) - (b.developerProfile?.rating || 0));
        break;
      case 'projects-high':
        filtered.sort((a, b) => (b.developerProfile?.totalProjects || 0) - (a.developerProfile?.totalProjects || 0));
        break;
      case 'projects-low':
        filtered.sort((a, b) => (a.developerProfile?.totalProjects || 0) - (b.developerProfile?.totalProjects || 0));
        break;
      case 'delivery-rate':
        filtered.sort((a, b) => (b.developerProfile?.deliveryTrackRecord?.onTime || 0) - (a.developerProfile?.deliveryTrackRecord?.onTime || 0));
        break;
      case 'performance-score':
        filtered.sort((a, b) => (b.developerProfile?.successRate || 0) - (a.developerProfile?.successRate || 0));
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
  }, [developers, searchQuery, ratingRange, projectsRange, deliveryRateRange, performanceScoreRange, selectedLocations, selectedProjectTypes, selectedSpecializations, sortBy]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onClose} className="p-2">
                <X className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Developer Directory</h1>
                <p className="text-sm text-gray-500">Loading developers...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Developers</h3>
            <p className="text-gray-600">Please wait while we fetch the latest developer information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onClose} className="p-2">
                <X className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Developer Directory</h1>
                <p className="text-sm text-red-500">Error loading developers</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Building className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Developers</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => dispatch(getDevelopers())}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

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
                    <Card key={developer._id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 ${getDeveloperBgColor(developer.name)} rounded-full flex items-center justify-center`}>
                              <span className="text-white font-bold">{getDeveloperLogo(developer.name)}</span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{developer.name}</CardTitle>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">{developer.developerProfile?.rating || 0}</span>
                                <span className="text-sm text-gray-500">({developer.developerProfile?.totalProjects || 0} projects)</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getPerformanceColor(developer.developerProfile?.successRate || 0)}>
                            {getPerformanceLabel(developer.developerProfile?.successRate || 0)}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {developer.developerProfile?.location || developer.city || 'Dubai'}
                          <span className="ml-2 text-xs">Est. {new Date(developer.createdAt).getFullYear()}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-semibold text-blue-600">{developer.developerProfile?.projectsCompletedCount || 0}</div>
                            <div className="text-gray-600">Completed</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-semibold text-green-600">{developer.developerProfile?.activeProjects || 0}</div>
                            <div className="text-gray-600">Active</div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>On-Time Delivery</span>
                            <span className="font-medium">{developer.developerProfile?.deliveryTrackRecord?.onTime || 0}%</span>
                          </div>
                          <Progress value={developer.developerProfile?.deliveryTrackRecord?.onTime || 0} className="h-2" />
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700">Specializations:</div>
                          <div className="flex flex-wrap gap-1">
                            {developer.developerProfile?.specializations?.slice(0, 2).map((spec, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            )) || []}
                            {developer.developerProfile?.specializations && developer.developerProfile.specializations.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{developer.developerProfile.specializations.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700">Credentials:</div>
                          <div className="flex flex-wrap gap-1">
                            {developer.developerProfile?.reraCertified && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                RERA Verified
                              </Badge>
                            )}
                            {developer.developerProfile?.certifications?.map((cert, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            )) || []}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Avg ROI: {developer.developerProfile?.avgROI || 0}%
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