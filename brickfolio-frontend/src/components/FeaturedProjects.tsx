import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getProjects } from '../features/projects/projectsSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, MapPin, TrendingUp, Calendar } from 'lucide-react';
import { PageLoader, ProjectCardSkeleton } from './ui/loader';

interface FeaturedProjectsProps {
  onViewAllClick: () => void;
}

export function FeaturedProjects({ onViewAllClick }: FeaturedProjectsProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    // Only fetch if no projects are loaded yet
    if (projects.length === 0) {
      dispatch(getProjects({ limit: 6 })); // Only get 6 projects for featured section
    }
  }, [dispatch, projects.length]);

  // Get featured projects (first 6 projects or all if less than 6)
  const featuredProjects = projects.slice(0, 6);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Featured Investment Opportunities
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Discover the best real estate investment opportunities in Dubai
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Featured Investment Opportunities
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover the best real estate investment opportunities in Dubai
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredProjects.map((project) => (
            <Card key={project._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={project.images?.[0] || '/placeholder-project.jpg'}
                  alt={project.projectName}
                  className="w-full h-48 object-cover"
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
                    <span>Handover: {project.handoverDate ? new Date(project.handoverDate).toLocaleDateString() : 'Q4 2025'}</span>
                  </div>
                  <div>
                    <span className="font-medium">{project.unitsAvailable || '30/120'}</span> units
                  </div>
                </div>

                <Button className="w-full" onClick={() => window.location.href = `/project/${project._id}`}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" onClick={() => navigate('/projects')}>
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}