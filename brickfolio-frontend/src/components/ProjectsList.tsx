import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { 
  getProjects, 
  setFilters,
  resetFilters
} from '../features/projects/projectsSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Star, MapPin, TrendingUp, Calendar } from 'lucide-react';

export function ProjectsList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects, loading, error, currentFilters } = useAppSelector((state) => state.projects);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');

  // Initial data fetch - only once on mount
  useEffect(() => {
    dispatch(getProjects({ limit: 50 }));
  }, []); // Empty dependency array - only runs once

  // Memoized function to fetch projects with filters
  const fetchProjectsWithFilters = useCallback((filters: any) => {
    dispatch(getProjects({ ...filters, limit: 50 }));
  }, [dispatch]);

  // Debounced filter application
  useEffect(() => {
    // Skip the initial render and when all filters are default
    if (selectedCategory === 'all' && !locationFilter && sortBy === 'default') {
      return;
    }

    const timeoutId = setTimeout(() => {
      const filters: any = {};
      
      if (selectedCategory && selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      if (locationFilter) {
        filters.location = locationFilter;
      }
      if (sortBy && sortBy !== 'default') {
        const [field, order] = sortBy.split('-');
        filters.sortBy = field;
        filters.sortOrder = order;
      }
      
      // Use memoized function to dispatch API call with filters
      fetchProjectsWithFilters(filters);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, locationFilter, sortBy, fetchProjectsWithFilters]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location);
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setLocationFilter('');
    setSortBy('default');
    dispatch(resetFilters());
    // Fetch all projects without filters
    fetchProjectsWithFilters({});
  };

  const handleViewDetails = (developerId: string) => {
    navigate(`/developer/${developerId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => handleLocationFilter(e.target.value)}
            className="w-[200px]"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="roi-desc">ROI (High to Low)</SelectItem>
              <SelectItem value="roi-asc">ROI (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Actions</label>
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            className="w-[180px]"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img
                src={project.images?.[0] || '/placeholder-project.jpg'}
                alt={project.projectName}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x300?text=Project+Image';
                }}
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-gray-900">
                  {project.category?.[0] || 'Premium'}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <div className="flex items-center bg-white/90 rounded-full px-2 py-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm font-medium">{project.rating || 4.5}</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <Badge variant="secondary" className="bg-black/70 text-white">
                  {project.constructionProgress}% Complete
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {project.projectName}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{project.roi || 8.5}%</div>
                  <div className="text-xs text-gray-600">ROI</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{project.rentalYield || 6.8}%</div>
                  <div className="text-xs text-gray-600">Rental Yield</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  {project.price?.formatted || 'AED 2.2M'}
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+12.5%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Handover: {project.handoverDate ? new Date(project.handoverDate).toLocaleDateString() : `${project.completion?.quarter || 'Q4'} ${project.completion?.year || '2025'}`}</span>
                </div>
                <div>
                  <span className="font-medium">{project.unitsAvailable || '30/120'}</span> units
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={() => handleViewDetails(project.developer)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No projects found.</p>
        </div>
      )}
    </div>
  );
}

