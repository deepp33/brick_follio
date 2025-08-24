import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getDevelopers } from '../features/users/usersSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, MapPin, Building, TrendingUp } from 'lucide-react';
import { DeveloperCardSkeleton } from './ui/loader';

interface TopDevelopersProps {
  onViewAllClick: () => void;
  onDeveloperClick: (developer: any) => void;
}

export function TopDevelopers({ onViewAllClick, onDeveloperClick }: TopDevelopersProps) {
  const dispatch = useAppDispatch();
  const { developers, loading, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(getDevelopers());
  }, [dispatch]);

  // Get top developers (first 6 developers)
  const topDevelopers = developers.slice(0, 6);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Top Developers
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Leading real estate developers in Dubai
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <DeveloperCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Top Developers
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-red-500 sm:mt-4">
              Error loading developers: {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Top Developers
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Leading real estate developers in Dubai
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topDevelopers.map((developer) => (
            <Card 
              key={developer._id} 
              className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => onDeveloperClick(developer)}
            >
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {developer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {developer.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{developer.developerProfile?.companyName || 'Developer'}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm font-medium">{developer.developerProfile?.rating || 4.8}</span>
                      <span className="ml-1 text-sm text-gray-500">({developer.developerProfile?.totalProjects || 156} projects)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Projects Completed</span>
                    <span className="font-semibold text-gray-900">{developer.developerProfile?.projectsCompletedCount || 24}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Projects</span>
                    <span className="font-semibold text-gray-900">{developer.developerProfile?.activeProjects || 8}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">{developer.developerProfile?.successRate || 98}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{developer.developerProfile?.location || developer.city || 'Dubai, UAE'}</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="font-medium">+{developer.developerProfile?.avgROI || 15}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {developer.developerProfile?.specializations?.slice(0, 3).map((spec: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  )) || (
                    <>
                      <Badge variant="secondary" className="text-xs">Luxury</Badge>
                      <Badge variant="secondary" className="text-xs">Residential</Badge>
                      <Badge variant="secondary" className="text-xs">Commercial</Badge>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" onClick={onViewAllClick}>
            View All Developers
          </Button>
        </div>
      </div>
    </section>
  );
}