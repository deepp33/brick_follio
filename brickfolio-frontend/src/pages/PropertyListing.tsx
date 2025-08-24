import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  getProjects, 
  filterProjectsByCategory, 
  filterProjectsByLocation, 
  sortProjectsByROI,
  sortProjectsByPrice 
} from '../features/projects/projectsSlice';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Star, MapPin, TrendingUp, Calendar } from 'lucide-react';

export default function PropertyListing() {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category && category !== 'all') {
      dispatch(filterProjectsByCategory(category));
    } else {
      dispatch(getProjects());
    }
  };

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location);
    if (location) {
      dispatch(filterProjectsByLocation(location));
    }
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    if (sortType === 'roi') {
      dispatch(sortProjectsByROI('desc'));
    } else if (sortType === 'price') {
      dispatch(sortProjectsByPrice('asc'));
    } else if (sortType === 'default') {
      dispatch(getProjects());
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Listings</h1>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Listings</h1>
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Listings</h1>
          <p className="text-gray-600 mb-6">
            Discover the best investment opportunities in Dubai's real estate market
          </p>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Luxury">Luxury</SelectItem>
                <SelectItem value="Off-Plan">Off-Plan</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Filter by Location"
              value={locationFilter}
              onChange={(e) => handleLocationFilter(e.target.value)}
            />

            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="roi">Highest ROI</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory('all');
                setLocationFilter('');
                setSortBy('default');
                dispatch(getProjects());
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Property Grid */}
        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project._id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative">
                    <ImageWithFallback
                      src={project.thumbnail || project.images[0] || '/placeholder-project.jpg'}
                      alt={project.projectName}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-100 text-blue-800">
                        {project.completion.quarter} {project.completion.year}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-white rounded-lg px-2 py-1 flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{project.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                    {project.projectName}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mb-3">{project.developer}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {project.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      ROI: {project.roi}%
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {project.completion.quarter} {project.completion.year}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.category.slice(0, 3).map((category, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-blue-600">
                      {project.price.formatted}
                    </span>
                  </div>
                </CardContent>
                
                <div className="px-6 pb-6">
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found matching your criteria</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
