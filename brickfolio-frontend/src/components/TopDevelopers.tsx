import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getDevelopers } from '../features/users/usersSlice';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Star, 
  Award, 
  Building, 
  CheckCircle, 
  MapPin,
  Shield,
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

interface TopDevelopersProps {
  onDeveloperClick?: (developer: any) => void;
  onViewAllClick?: () => void;
}

const getPerformanceColor = (score: number) => {
  if (score >= 95) return "bg-green-100 text-green-800";
  if (score >= 90) return "bg-blue-100 text-blue-800";
  if (score >= 85) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

const getPerformanceLabel = (score: number) => {
  if (score >= 95) return "Excellent";
  if (score >= 90) return "Very Good";
  if (score >= 85) return "Good";
  return "Fair";
};

export function TopDevelopers({ onDeveloperClick, onViewAllClick }: TopDevelopersProps) {
  const dispatch = useAppDispatch();
  const { developers, loading, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(getDevelopers());
  }, [dispatch]);

  // Get top 4 developers sorted by rating
  const topDevelopers = [...developers]
    .sort((a, b) => (b.developerProfile?.rating || 0) - (a.developerProfile?.rating || 0))
    .slice(0, 4);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Top Rated Developers
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Loading developers...
            </p>
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
              Top Rated Developers
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
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Top Rated Developers
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Partner with Dubai's most trusted and reliable property developers
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {topDevelopers.map((developer) => (
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
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => onDeveloperClick?.(developer)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Award className="h-5 w-5 text-blue-600" />
            <span>All developers are RERA verified and regularly audited for compliance</span>
          </div>
          <div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={onViewAllClick}>
              View All Developers
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}