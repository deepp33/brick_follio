import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getProjects } from '../features/projects/projectsSlice';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, MapPin, TrendingUp, Calendar } from 'lucide-react';

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ready":
      return "bg-green-100 text-green-800";
    case "Off Plan":
      return "bg-blue-100 text-blue-800";
    case "Construction":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface FeaturedProjectsProps {
  onViewAllClick: () => void;
}

export function FeaturedProjects({ onViewAllClick }: FeaturedProjectsProps) {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  // Get featured projects (first 6 projects or all if less than 6)
  const featuredProjects = projects.slice(0, 6);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Featured Investment Opportunities
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Loading featured projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Featured Investment Opportunities
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-red-500 sm:mt-4">
              Error loading projects: {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Featured Investment Opportunities
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover handpicked properties with high growth potential and strong ROI projections
          </p>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <Card key={project._id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative">
                    <ImageWithFallback
                      src={project.thumbnail || project.images[0] || '/placeholder-project.jpg'}
                      alt={project.projectName}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getStatusColor(project.completion.quarter)}>
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
                
                <CardFooter className="px-6 pb-6">
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-lg">No featured projects available</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={onViewAllClick}>
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
}