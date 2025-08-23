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

const topDevelopers = [
  {
    id: 1,
    name: "Emaar Properties",
    logo: "E",
    rating: 4.9,
    totalProjects: 45,
    projects: 45,
    deliveryRate: 98,
    onTimeDeliveryRate: 98,
    credentials: ["RERA Verified", "Award Winner"],
    recentProject: "Dubai Hills Estate",
    recentProjects: ["Dubai Hills Estate", "Creek Harbour"],
    bgColor: "bg-blue-600",
    location: "Downtown Dubai",
    establishedYear: 1997,
    completedProjects: 42,
    totalUnitsDelivered: 25800,
    specialization: ["Luxury Residential", "Mixed-Use", "Commercial"],
    performanceScore: 95
  },
  {
    id: 2,
    name: "DAMAC Properties",
    logo: "D",
    rating: 4.7,
    totalProjects: 38,
    projects: 38,
    deliveryRate: 95,
    onTimeDeliveryRate: 95,
    credentials: ["RERA Verified", "ISO Certified"],
    recentProject: "Marina Heights",
    recentProjects: ["Marina Heights", "Damac Hills"],
    bgColor: "bg-green-600",
    location: "Business Bay",
    establishedYear: 2002,
    completedProjects: 35,
    totalUnitsDelivered: 18500,
    specialization: ["Luxury Residential", "Hotels & Resorts"],
    performanceScore: 92
  },
  {
    id: 3,
    name: "Sobha Realty",
    logo: "S",
    rating: 4.8,
    totalProjects: 28,
    projects: 28,
    deliveryRate: 97,
    onTimeDeliveryRate: 97,
    credentials: ["RERA Verified", "Quality Excellence"],
    recentProject: "Business Bay Tower",
    recentProjects: ["Business Bay Tower", "Sobha Hartland"],
    bgColor: "bg-purple-600",
    location: "Motor City",
    establishedYear: 2003,
    completedProjects: 25,
    totalUnitsDelivered: 12200,
    specialization: ["Premium Residential", "Villas"],
    performanceScore: 96
  },
  {
    id: 4,
    name: "Nakheel",
    logo: "N",
    rating: 4.6,
    totalProjects: 32,
    projects: 32,
    deliveryRate: 93,
    onTimeDeliveryRate: 93,
    credentials: ["RERA Verified", "Innovation Award"],
    recentProject: "Palm Jumeirah Villas",
    recentProjects: ["Palm Jumeirah Villas", "The World Islands"],
    bgColor: "bg-orange-600",
    location: "Dubai Marina",
    establishedYear: 2000,
    completedProjects: 28,
    totalUnitsDelivered: 15700,
    specialization: ["Master Development", "Waterfront Projects"],
    performanceScore: 90
  }
];

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