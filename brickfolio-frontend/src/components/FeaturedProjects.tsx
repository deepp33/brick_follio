import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, TrendingUp, Calendar, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const featuredProjects = [
  {
    id: 1,
    name: "Dubai Hills Estate",
    developer: "Emaar Properties",
    location: "Dubai Hills",
    price: "From AED 1.2M",
    roi: "8.5%",
    completion: "Q4 2024",
    rating: 4.8,
    status: "Launch Phase",
    image: "https://images.unsplash.com/photo-1726003354242-4ff17c3515e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzU1OTQxOTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    features: ["Golf Course Views", "Metro Access", "Shopping Mall"]
  },
  {
    id: 2,
    name: "Marina Heights",
    developer: "DAMAC Properties",
    location: "Dubai Marina",
    price: "From AED 950K",
    roi: "7.2%",
    completion: "Q2 2025",
    rating: 4.6,
    status: "Pre-Launch",
    image: "https://images.unsplash.com/photo-1696743297474-d674b8e3d82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGZhY2FkZXxlbnwxfHx8fDE3NTU4NTEyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    features: ["Marina Views", "Beach Access", "Luxury Amenities"]
  },
  {
    id: 3,
    name: "Business Bay Tower",
    developer: "Sobha Realty",
    location: "Business Bay",
    price: "From AED 1.8M",
    roi: "9.1%",
    completion: "Q1 2026",
    rating: 4.9,
    status: "Construction",
    image: "https://images.unsplash.com/photo-1609764465693-a2dc6c6f7dbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMHNreWxpbmUlMjBtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU1OTQxOTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    features: ["City Views", "Business District", "High ROI"]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Launch Phase":
      return "bg-green-100 text-green-800";
    case "Pre-Launch":
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

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
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
                  {project.name}
                </CardTitle>
                <p className="text-sm text-gray-600 mb-3">{project.developer}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {project.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    ROI: {project.roi}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {project.completion}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-blue-600">
                    {project.price}
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

        <div className="text-center mt-10">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={onViewAllClick}>
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
}