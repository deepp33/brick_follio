import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getDeveloperProfile } from '../features/users/usersSlice';
import { 
  X, 
  Star, 
  Award, 
  Building, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  Shield,
  Users,
  FileText,
  Phone,
  Mail,
  Globe,
  Eye,
  Heart,
  Share2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DeveloperData {
  id: number;
  name: string;
  logo: string;
  bgColor: string;
  rating: number;
  projects: number;
  deliveryRate: number;
  credentials: string[];
  recentProject: string;
  established: number;
  totalDelivered: number;
  marketCap: string;
  description: string;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  legalStatus: {
    reraLicense: string;
    disputes: number;
    lastAudit: string;
    complianceScore: number;
  };
  projects: Array<{
    id: number;
    name: string;
    location: string;
    status: string;
    completion: string;
    units: number;
    startPrice: string;
    roi: string;
    deliveryDate: string;
    progress: number;
    image: string;
  }>;
  reviews: Array<{
    id: number;
    investor: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
    project: string;
  }>;
}

interface DeveloperProfileProps {
  developerId: string; // Changed to accept developer ID instead of full developer data
  onClose: () => void;
}

const mockDeveloperData: Record<number, DeveloperData> = {
  1: {
    id: 1,
    name: "Emaar Properties",
    logo: "E",
    bgColor: "bg-blue-600",
    rating: 4.9,
    projects: 45,
    deliveryRate: 98,
    credentials: ["RERA Verified", "Award Winner"],
    recentProject: "Dubai Hills Estate",
    established: 1997,
    totalDelivered: 42,
    marketCap: "AED 25.8B",
    description: "Emaar Properties is a leading real estate development company in the UAE, known for iconic projects like Burj Khalifa and Dubai Mall. With over 25 years of experience, Emaar has established itself as a pioneer in luxury real estate development.",
    contactInfo: {
      phone: "+971 4 367 3333",
      email: "info@emaar.ae",
      website: "www.emaar.com",
      address: "Emaar Square, Downtown Dubai, UAE"
    },
    legalStatus: {
      reraLicense: "RERA-DEV-001",
      disputes: 0,
      lastAudit: "March 2024",
      complianceScore: 98
    },
    projects: [
      {
        id: 1,
        name: "Dubai Hills Estate",
        location: "Dubai Hills",
        status: "Launch Phase",
        completion: "Q4 2024",
        units: 500,
        startPrice: "AED 1.2M",
        roi: "8.5%",
        deliveryDate: "December 2024",
        progress: 85,
        image: "https://images.unsplash.com/photo-1726003354242-4ff17c3515e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzU1OTQxOTAzfDA&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        id: 2,
        name: "Creek Harbour",
        location: "Dubai Creek",
        status: "Construction",
        completion: "Q2 2025",
        units: 800,
        startPrice: "AED 980K",
        roi: "7.8%",
        deliveryDate: "June 2025",
        progress: 65,
        image: "https://images.unsplash.com/photo-1609764465693-a2dc6c6f7dbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMHNreWxpbmUlMjBtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU1OTQxOTAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ],
    reviews: [
      {
        id: 1,
        investor: "Ahmed Al-Rashid",
        rating: 5,
        comment: "Exceptional build quality and timely delivery. Emaar's reputation is well-deserved.",
        date: "March 2024",
        verified: true,
        project: "Dubai Hills Estate"
      },
      {
        id: 2,
        investor: "Sarah Johnson",
        rating: 5,
        comment: "Professional service throughout the investment process. Great ROI achieved.",
        date: "February 2024",
        verified: true,
        project: "Creek Harbour"
      }
    ]
  },
  2: {
    id: 2,
    name: "DAMAC Properties",
    logo: "D",
    bgColor: "bg-green-600",
    rating: 4.7,
    projects: 38,
    deliveryRate: 95,
    credentials: ["RERA Verified", "ISO Certified"],
    recentProject: "Marina Heights",
    established: 2002,
    totalDelivered: 35,
    marketCap: "AED 18.5B",
    description: "DAMAC Properties is a luxury real estate developer known for premium residential, commercial and leisure properties across the Middle East, with partnerships with renowned brands like Versace and Fendi.",
    contactInfo: {
      phone: "+971 4 420 0000",
      email: "info@damacproperties.com",
      website: "www.damacproperties.com",
      address: "DAMAC Tower, Business Bay, Dubai, UAE"
    },
    legalStatus: {
      reraLicense: "RERA-DEV-002",
      disputes: 0,
      lastAudit: "February 2024",
      complianceScore: 94
    },
    projects: [
      {
        id: 1,
        name: "Marina Heights",
        location: "Dubai Marina",
        status: "Pre-Launch",
        completion: "Q2 2025",
        units: 300,
        startPrice: "AED 950K",
        roi: "7.2%",
        deliveryDate: "April 2025",
        progress: 25,
        image: "https://images.unsplash.com/photo-1696743297474-d674b8e3d82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGZhY2FkZXxlbnwxfHx8fDE3NTU4NTEyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ],
    reviews: [
      {
        id: 1,
        investor: "Michael Chen",
        rating: 5,
        comment: "Luxury finishes and excellent amenities. DAMAC delivered exactly as promised.",
        date: "March 2024",
        verified: true,
        project: "Marina Heights"
      }
    ]
  },
  3: {
    id: 3,
    name: "Sobha Realty",
    logo: "S",
    bgColor: "bg-purple-600",
    rating: 4.8,
    projects: 28,
    deliveryRate: 97,
    credentials: ["RERA Verified", "Quality Excellence"],
    recentProject: "Business Bay Tower",
    established: 2003,
    totalDelivered: 25,
    marketCap: "AED 12.2B",
    description: "Sobha Realty is known for crafting premium residential and commercial properties with exceptional attention to detail and quality. The company has a strong track record of delivering projects on time.",
    contactInfo: {
      phone: "+971 4 440 1111",
      email: "info@sobharealty.com",
      website: "www.sobharealty.com", 
      address: "Sobha Pavilion, Motor City, Dubai, UAE"
    },
    legalStatus: {
      reraLicense: "RERA-DEV-003",
      disputes: 0,
      lastAudit: "January 2024",
      complianceScore: 96
    },
    projects: [
      {
        id: 1,
        name: "Business Bay Tower",
        location: "Business Bay",
        status: "Construction",
        completion: "Q1 2026",
        units: 400,
        startPrice: "AED 1.8M",
        roi: "9.1%",
        deliveryDate: "March 2026",
        progress: 45,
        image: "https://images.unsplash.com/photo-1609764465693-a2dc6c6f7dbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMHNreWxpbmUlMjBtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU1OTQxOTAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ],
    reviews: [
      {
        id: 1,
        investor: "Priya Sharma",
        rating: 5,
        comment: "Outstanding quality and attention to detail. Sobha truly delivers excellence.",
        date: "February 2024",
        verified: true,
        project: "Business Bay Tower"
      }
    ]
  },
  4: {
    id: 4,
    name: "Nakheel",
    logo: "N",
    bgColor: "bg-orange-600",
    rating: 4.6,
    projects: 32,
    deliveryRate: 93,
    credentials: ["RERA Verified", "Innovation Award"],
    recentProject: "Palm Jumeirah Villas",
    established: 2000,
    totalDelivered: 28,
    marketCap: "AED 15.7B",
    description: "Nakheel is a world-leading master developer known for iconic developments like Palm Jumeirah and The World Islands. The company continues to shape Dubai's skyline with innovative projects.",
    contactInfo: {
      phone: "+971 4 390 3333",
      email: "info@nakheel.com",
      website: "www.nakheel.com",
      address: "Nakheel Tower, Dubai Marina, UAE"
    },
    legalStatus: {
      reraLicense: "RERA-DEV-004",
      disputes: 1,
      lastAudit: "December 2023",
      complianceScore: 91
    },
    projects: [
      {
        id: 1,
        name: "Palm Jumeirah Villas",
        location: "Palm Jumeirah",
        status: "Launch Phase",
        completion: "Q3 2025",
        units: 150,
        startPrice: "AED 3.5M",
        roi: "5.9%",
        deliveryDate: "September 2025",
        progress: 70,
        image: "https://images.unsplash.com/photo-1726003354242-4ff17c3515e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzU1OTQxOTAzfDA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ],
    reviews: [
      {
        id: 1,
        investor: "Robert Williams",
        rating: 4,
        comment: "Unique location and innovative design. Some delays but overall satisfied with the investment.",
        date: "January 2024",
        verified: true,
        project: "Palm Jumeirah Villas"
      }
    ]
  }
};

export function DeveloperProfile({ developerId, onClose }: DeveloperProfileProps) {
  const dispatch = useAppDispatch();
  const { selectedDeveloper, loading, error } = useAppSelector((state) => state.users);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    if (developerId) {
      dispatch(getDeveloperProfile(developerId));
    }
  }, [dispatch, developerId]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading developer profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !selectedDeveloper) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Profile</div>
          <p className="text-gray-600 mb-4">{error || 'Developer not found'}</p>
          <Button onClick={onClose} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Helper function to get developer background color
  const getDeveloperBgColor = (name: string) => {
    const colors = [
      "bg-blue-600", "bg-green-600", "bg-purple-600", "bg-orange-600", 
      "bg-red-600", "bg-indigo-600", "bg-pink-600", "bg-teal-600"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Transform API data to match component expectations
  const developer = {
    id: selectedDeveloper._id,
    name: selectedDeveloper.name,
    logo: selectedDeveloper.name.charAt(0).toUpperCase(),
    bgColor: getDeveloperBgColor(selectedDeveloper.name),
    rating: selectedDeveloper.developerProfile?.rating || 4.5,
    projects: selectedDeveloper.developerProfile?.totalProjects || 0,
    deliveryRate: selectedDeveloper.developerProfile?.deliveryTrackRecord?.onTime || 90,
    credentials: selectedDeveloper.developerProfile?.certifications || [],
    recentProject: "Latest Project", // Would come from projects API
    established: 2000, // Would come from developer profile
    totalDelivered: selectedDeveloper.developerProfile?.projectsCompletedCount || 0,
    marketCap: "N/A", // Would come from financial data
    description: selectedDeveloper.developerProfile?.description || `${selectedDeveloper.name} is a leading real estate developer in Dubai with a strong track record of delivering quality projects.`,
    contactInfo: {
      phone: selectedDeveloper.phone || "+971 4 XXX XXXX",
      email: selectedDeveloper.email || "info@example.com",
      website: "www.example.com", // Would come from developer profile
      address: selectedDeveloper.developerProfile?.location || "Dubai, UAE"
    },
    legalStatus: {
      reraLicense: selectedDeveloper.developerProfile?.compliance?.reraLicense || "RERA-DEV-XXX",
      disputes: 0, // Would come from legal data
      lastAudit: selectedDeveloper.developerProfile?.compliance?.lastAudit || "Recent",
      complianceScore: selectedDeveloper.developerProfile?.compliance?.complianceScore || 90
    },
    projects: selectedDeveloper.developerProfile?.projects?.map((project: any, index: number) => ({
      id: project._id || index,
      name: project.projectName,
      location: project.location,
      status: project.constructionProgress >= 100 ? "Completed" : 
              project.constructionProgress >= 80 ? "Near Completion" :
              project.constructionProgress >= 50 ? "Construction" :
              project.constructionProgress >= 20 ? "Pre-Launch" : "Launch Phase",
      completion: `${project.completion?.quarter} ${project.completion?.year}`,
      units: parseInt(project.unitsAvailable?.split('/')[1]) || 0,
      startPrice: project.price?.formatted || "AED 1M",
      roi: `${project.roi}%`,
      deliveryDate: new Date(project.handoverDate).toLocaleDateString(),
      progress: project.constructionProgress || 0,
      image: project.images?.[0] || "https://via.placeholder.com/400x300?text=Project+Image",
      category: project.category || [],
      amenities: project.amenities || [],
      rating: project.rating || 4.5,
      rentalYield: project.rentalYield || 6.0,
      paymentPlan: project.paymentPlan || []
    })) || [],
    reviews: [] // Would come from reviews API
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Launch Phase":
        return "bg-green-100 text-green-800";
      case "Pre-Launch":
        return "bg-blue-100 text-blue-800";
      case "Construction":
        return "bg-orange-100 text-orange-800";
      case "Near Completion":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onClose} className="p-2">
                <X className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 ${developer.bgColor} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-2xl font-bold">{developer.logo}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{developer.name}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.floor(developer.rating))}
                      <span className="ml-2 font-medium">{developer.rating}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      RERA Verified
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      <Award className="h-3 w-3 mr-1" />
                      Award Winner
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="compliance">Legal & Compliance</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Company Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {developer.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {developer.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-sm text-gray-600">Established</div>
                        <div className="font-semibold">{developer.established}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Building className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <div className="text-sm text-gray-600">Delivered</div>
                        <div className="font-semibold">{developer.totalDelivered}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                        <div className="text-sm text-gray-600">Success Rate</div>
                        <div className="font-semibold">{developer.deliveryRate}%</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                        <div className="text-sm text-gray-600">Market Cap</div>
                        <div className="font-semibold">{developer.marketCap}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Track Record */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Track Record</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>On-Time Delivery Rate</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={developer.deliveryRate} className="w-32" />
                          <span className="font-semibold text-green-600">{developer.deliveryRate}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Quality Score</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={92} className="w-32" />
                          <span className="font-semibold text-blue-600">92%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Customer Satisfaction</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={89} className="w-32" />
                          <span className="font-semibold text-purple-600">89%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{developer.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{developer.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{developer.contactInfo.website}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{developer.contactInfo.address}</span>
                    </div>
                    <Button className="w-full mt-4">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Developer
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Projects:</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Units:</span>
                      <span className="font-semibold">12,500+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg. ROI:</span>
                      <span className="font-semibold text-green-600">8.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee Count:</span>
                      <span className="font-semibold">2,800+</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            {developer.projects && developer.projects.length > 0 ? (
              <div className="space-y-6">
                {/* Projects Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Projects Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{developer.projects.length}</div>
                        <div className="text-sm text-gray-600">Total Projects</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {developer.projects.filter(p => p.status === "Completed").length}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {developer.projects.filter(p => p.status === "Construction").length}
                        </div>
                        <div className="text-sm text-gray-600">Under Construction</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {developer.projects.filter(p => p.status === "Launch Phase" || p.status === "Pre-Launch").length}
                        </div>
                        <div className="text-sm text-gray-600">New Launches</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Projects Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {developer.projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative">
                        <ImageWithFallback
                          src={project.image}
                          alt={project.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                            <span className="text-xs font-medium">{project.rating}</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                        
                        {/* Project Categories */}
                        {project.category && project.category.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.category.slice(0, 2).map((cat: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {project.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {project.deliveryDate}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            ROI: {project.roi}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {project.units} units
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Construction Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} />
                        </div>

                        {/* Key Amenities */}
                        {project.amenities && project.amenities.length > 0 && (
                          <div className="mb-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">Key Amenities:</div>
                            <div className="flex flex-wrap gap-1">
                              {project.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                              {project.amenities.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.amenities.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-lg font-semibold text-blue-600">
                              {project.startPrice}
                            </span>
                            <div className="text-xs text-gray-500">
                              Rental Yield: {project.rentalYield}%
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Available</h3>
                <p className="text-gray-600">Project information will be available soon.</p>
              </Card>
            )}
          </TabsContent>

          {/* Legal & Compliance Tab */}
          <TabsContent value="compliance">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    RERA Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>RERA License</span>
                    <Badge className="bg-green-100 text-green-800">{developer.legalStatus.reraLicense}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Compliance Score</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={developer.legalStatus.complianceScore} className="w-20" />
                      <span className="font-semibold text-green-600">{developer.legalStatus.complianceScore}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Last Audit</span>
                    <span className="font-semibold">{developer.legalStatus.lastAudit}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Legal Standing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold">Clean Legal Record</div>
                      <div className="text-sm text-gray-600">No active disputes or violations</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold">Escrow Compliance</div>
                      <div className="text-sm text-gray-600">100% funds in escrow accounts</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold">Insurance Coverage</div>
                      <div className="text-sm text-gray-600">Comprehensive project insurance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              {developer.reviews && developer.reviews.length > 0 ? (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    {developer.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{review.investor}</h4>
                              <p className="text-sm text-gray-600">{review.project}</p>
                            </div>
                            {review.verified && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1 mb-3">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                          </div>

                          <p className="text-gray-600 mb-3">"{review.comment}"</p>

                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>{review.date}</span>
                            <span>Verified Purchase</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="text-center">
                    <Button variant="outline">
                      Load More Reviews
                    </Button>
                  </div>
                </>
              ) : (
                <Card className="p-12 text-center">
                  <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Available</h3>
                  <p className="text-gray-600">Customer reviews will appear here once available.</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}