import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  getProjects, 
  filterProjectsByCategory, 
  filterProjectsByLocation, 
  sortProjectsByROI,
  sortProjectsByPrice 
} from '../features/projects/projectsSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';

export function ProjectsList() {
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
      // Reset to original projects
      dispatch(getProjects());
    }
  };

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location);
    if (location) {
      dispatch(filterProjectsByLocation(location));
    } else {
      // Reset to original projects
      dispatch(getProjects());
    }
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    if (sortType === 'roi-asc') {
      dispatch(sortProjectsByROI('asc'));
    } else if (sortType === 'roi-desc') {
      dispatch(sortProjectsByROI('desc'));
    } else if (sortType === 'price-asc') {
      dispatch(sortProjectsByPrice('asc'));
    } else if (sortType === 'price-desc') {
      dispatch(sortProjectsByPrice('desc'));
    } else if (sortType === 'default') {
      dispatch(getProjects());
    }
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
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.projectName}</CardTitle>
                <Badge variant="secondary">{project.location}</Badge>
              </div>
              <div className="flex gap-2">
                {project.category.map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="font-semibold">{project.price.formatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ROI:</span>
                  <span className="font-semibold text-green-600">{project.roi}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rental Yield:</span>
                  <span className="font-semibold text-blue-600">{project.rentalYield}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion:</span>
                  <span className="font-semibold">
                    {project.completion.quarter} {project.completion.year}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Progress:</span>
                  <span className="font-semibold">{project.constructionProgress}%</span>
                </div>
                <div className="pt-2">
                  <Button className="w-full">View Details</Button>
                </div>
              </div>
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

