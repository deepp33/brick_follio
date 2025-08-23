import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { MapPin, TrendingUp, Star, Filter, X, Eye, Heart } from 'lucide-react';

interface UserPreferences {
  investmentGoal?: string;
  budget?: number[];
  riskAppetite?: string;
  locationPreferences?: string[];
  propertyTypes?: string[];
  investmentHorizon?: string;
  roiTarget?: number[];
  rentalYield?: number[];
  maxCommute?: number[];
}

interface InteractiveMapProps {
  userPreferences?: UserPreferences | null;
}

const mockProperties = [
  { id: 1, name: "Marina Heights", price: 950000, roi: 7.2, lat: 25.077, lng: 55.139, type: "Apartment", rating: 4.6 },
  { id: 2, name: "Dubai Hills Villa", price: 2100000, roi: 8.5, lat: 25.112, lng: 55.249, type: "Villa", rating: 4.8 },
  { id: 3, name: "Business Bay Tower", price: 1800000, roi: 9.1, lat: 25.189, lng: 55.267, type: "Apartment", rating: 4.9 },
  { id: 4, name: "Downtown Residence", price: 1350000, roi: 6.8, lat: 25.197, lng: 55.274, type: "Apartment", rating: 4.7 },
  { id: 5, name: "Palm Jumeirah Villa", price: 3500000, roi: 5.9, lat: 25.117, lng: 55.138, type: "Villa", rating: 4.5 }
];

const propertyTypes = ["Apartment", "Villa", "Townhouse", "Commercial"];

export function InteractiveMap({ userPreferences }: InteractiveMapProps) {
  // Initialize filters based on user preferences if available
  const [priceRange, setPriceRange] = useState(
    userPreferences?.budget || [500000, 4000000]
  );
  const [roiRange, setRoiRange] = useState(
    userPreferences?.roiTarget ? [userPreferences.roiTarget[0], 10] : [5, 10]
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    userPreferences?.propertyTypes || ["Apartment", "Villa"]
  );
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"investor" | "lifestyle">(
    userPreferences?.investmentGoal === "personal" ? "lifestyle" : "investor"
  );

  const filteredProperties = mockProperties.filter(property => 
    property.price >= priceRange[0] && 
    property.price <= priceRange[1] &&
    property.roi >= roiRange[0] &&
    property.roi <= roiRange[1] &&
    selectedTypes.includes(property.type)
  );

  const togglePropertyType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {userPreferences ? 'Your Personalized Investment Map' : 'Interactive Investment Map'}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {userPreferences 
              ? 'Properties tailored to your investment preferences and goals'
              : 'Discover properties with our AI-powered map and advanced filtering'
            }
          </p>
          {userPreferences && (
            <div className="mt-4 flex justify-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">
                Budget: AED {(userPreferences.budget?.[0] || 0 / 1000000).toFixed(1)}M
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                Target ROI: {userPreferences.roiTarget?.[0]}%
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                {userPreferences.investmentGoal === 'rental' ? 'Rental Income' : 
                 userPreferences.investmentGoal === 'growth' ? 'Long-term Growth' : 'Personal Use'}
              </Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </span>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* View Mode Toggle */}
              <div>
                <label className="text-sm font-medium mb-3 block">View Mode</label>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === "investor" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("investor")}
                  >
                    Investor
                  </Button>
                  <Button
                    variant={viewMode === "lifestyle" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("lifestyle")}
                  >
                    Lifestyle
                  </Button>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Price Range (AED)
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={5000000}
                  min={300000}
                  step={50000}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{(priceRange[0] / 1000000).toFixed(1)}M</span>
                  <span>{(priceRange[1] / 1000000).toFixed(1)}M</span>
                </div>
              </div>

              {/* ROI Range */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  ROI Range (%)
                </label>
                <Slider
                  value={roiRange}
                  onValueChange={setRoiRange}
                  max={12}
                  min={3}
                  step={0.1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{roiRange[0]}%</span>
                  <span>{roiRange[1]}%</span>
                </div>
              </div>

              {/* Property Types */}
              <div>
                <label className="text-sm font-medium mb-3 block">Property Types</label>
                <div className="space-y-2">
                  {propertyTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => togglePropertyType(type)}
                      />
                      <label htmlFor={type} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {filteredProperties.length} properties found
              </div>
            </CardContent>
          </Card>

          {/* Map and Details */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map Area */}
              <div className="lg:col-span-2">
                <Card className="h-96">
                  <CardContent className="p-0 h-full">
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden">
                      {/* Mock Map Background */}
                      <div className="absolute inset-0 bg-gray-200 opacity-50"></div>
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="secondary">
                          {viewMode === "investor" ? "Investment View" : "Lifestyle View"}
                        </Badge>
                      </div>
                      
                      {/* Property Pins */}
                      {filteredProperties.map((property, index) => (
                        <div
                          key={property.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                          style={{
                            left: `${20 + (index * 15)}%`,
                            top: `${30 + (index * 10)}%`
                          }}
                          onClick={() => setSelectedProperty(property)}
                        >
                          <div className="relative">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                              <MapPin className="h-4 w-4 text-white" />
                            </div>
                            {selectedProperty?.id === property.id && (
                              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-48 z-20">
                                <h4 className="font-semibold text-sm">{property.name}</h4>
                                <p className="text-xs text-gray-600">{property.type}</p>
                                <div className="flex items-center justify-between mt-2 text-xs">
                                  <span className="font-semibold text-blue-600">
                                    AED {(property.price / 1000000).toFixed(1)}M
                                  </span>
                                  <span className="text-green-600">{property.roi}% ROI</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Property Details Panel */}
              <div className="lg:col-span-1">
                {selectedProperty ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedProperty.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Badge variant="secondary">{selectedProperty.type}</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="font-semibold">
                            AED {(selectedProperty.price / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">ROI:</span>
                          <span className="font-semibold text-green-600">
                            {selectedProperty.roi}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Rating:</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-semibold">{selectedProperty.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Heart className="h-4 w-4 mr-2" />
                          Save to Wishlist
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Click on a property pin to view details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}