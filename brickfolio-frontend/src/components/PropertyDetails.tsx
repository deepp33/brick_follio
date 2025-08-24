import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  MapPin, 
  Star, 
  TrendingUp, 
  Calendar, 
  Building, 
  Home, 
  Car, 
  Wifi, 
  Dumbbell, 
  ShoppingBag,
  Heart,
  Share2,
  Calculator,
  Phone,
  Eye
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PropertyDetailsProps {
  property: {
    id: number;
    name: string;
    developer: string;
    location: string;
    price: string;
    roi: string;
    completion: string;
    rating: number;
    status: string;
    images: string[];
    description: string;
    specifications: {
      bedrooms: string;
      bathrooms: string;
      area: string;
      parking: string;
      floor: string;
    };
    amenities: string[];
    paymentPlan: {
      downPayment: string;
      duringConstruction: string;
      onCompletion: string;
    };
    nearbyPlaces: Array<{
      name: string;
      distance: string;
      type: string;
    }>;
  };
  onClose: () => void;
}

export function PropertyDetails({ property, onClose }: PropertyDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const amenityIcons = {
    'Gym': Dumbbell,
    'Pool': Home,
    'Parking': Car,
    'WiFi': Wifi,
    'Shopping': ShoppingBag,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
              <p className="text-gray-600">{property.developer} • {property.location}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsSaved(!isSaved)}
                className={isSaved ? 'text-red-600 border-red-600' : ''}
              >
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <ImageWithFallback
                      src={property.images[currentImageIndex]}
                      alt={property.name}
                      className="w-full h-96 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-100 text-green-800">
                        {property.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </div>
                  <div className="flex space-x-2 p-4 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <ImageWithFallback
                          src={image}
                          alt={`${property.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <p className="text-gray-600 leading-relaxed">{property.description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Home className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <div className="text-sm text-gray-600">Bedrooms</div>
                          <div className="font-semibold">{property.specifications.bedrooms}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Building className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <div className="text-sm text-gray-600">Bathrooms</div>
                          <div className="font-semibold">{property.specifications.bathrooms}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <div className="text-sm text-gray-600">Area</div>
                          <div className="font-semibold">{property.specifications.area}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="amenities">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Building Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {property.amenities.map((amenity, index) => {
                          const IconComponent = amenityIcons[amenity] || Home;
                          return (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <IconComponent className="h-5 w-5 text-blue-600" />
                              <span className="text-sm font-medium">{amenity}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="location">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Nearby Places</h3>
                      <div className="space-y-3">
                        {property.nearbyPlaces.map((place, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="font-medium">{place.name}</div>
                                <div className="text-sm text-gray-600">{place.type}</div>
                              </div>
                            </div>
                            <Badge variant="secondary">{place.distance}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payment">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Payment Plan</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                          <span className="font-medium">Down Payment</span>
                          <span className="text-blue-600 font-semibold">{property.paymentPlan.downPayment}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium">During Construction</span>
                          <span className="font-semibold">{property.paymentPlan.duringConstruction}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                          <span className="font-medium">On Completion</span>
                          <span className="text-green-600 font-semibold">{property.paymentPlan.onCompletion}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price & Key Metrics */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{property.price}</div>
                  <div className="flex items-center space-x-1 mb-4">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-gray-600">• {property.developer}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROI:</span>
                      <span className="font-semibold text-green-600">{property.roi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion:</span>
                      <span className="font-semibold">{property.completion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-semibold">{property.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Construction Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Construction Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="w-full" />
                    <div className="text-xs text-gray-600">Expected completion: {property.completion}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {/* <Phone className="h-4 w-4 mr-2" />
                  Contact Developer
                </Button> */}
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Schedule Viewing
                </Button>
                <Button variant="outline" className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate ROI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}