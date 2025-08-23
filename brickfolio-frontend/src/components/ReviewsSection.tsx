import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, Quote, ThumbsUp, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const reviews = [
  {
    id: 1,
    name: "Ahmed Al-Mansouri",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "Dubai, UAE",
    rating: 5,
    review: "Dubai Invest made my property investment journey incredibly smooth. Their AI-powered insights helped me identify the perfect apartment in Business Bay with excellent ROI potential. The platform's transparency and real-time market data gave me the confidence to make informed decisions.",
    property: "Business Bay Apartment",
    investmentAmount: "AED 1.2M",
    dateInvested: "March 2024",
    verified: true,
    helpful: 24
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    location: "London, UK",
    rating: 5,
    review: "As an international investor, I was initially hesitant about investing in Dubai real estate. Dubai Invest's platform provided comprehensive market analysis, developer ratings, and legal compliance information that made me feel secure about my investment decision.",
    property: "Dubai Hills Villa",
    investmentAmount: "AED 2.8M",
    dateInvested: "January 2024",
    verified: true,
    helpful: 18
  },
  {
    id: 3,
    name: "Mohamed Hassan",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "Abu Dhabi, UAE",
    rating: 4,
    review: "The interactive map feature is a game-changer. Being able to visualize ROI, rental yields, and market trends geographically helped me compare different areas effectively. The onboarding questionnaire perfectly matched my investment goals with suitable properties.",
    property: "Marina Heights",
    investmentAmount: "AED 950K",
    dateInvested: "February 2024",
    verified: true,
    helpful: 15
  },
  {
    id: 4,
    name: "Lisa Chen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    location: "Singapore",
    rating: 5,
    review: "The platform's calculator tools are incredibly detailed and accurate. I was able to model different scenarios and understand the complete financial picture before making my investment. The customer service team was also exceptional in guiding me through the process.",
    property: "Downtown Residence",
    investmentAmount: "AED 1.5M",
    dateInvested: "April 2024",
    verified: true,
    helpful: 21
  },
  {
    id: 5,
    name: "Omar Al-Rashid",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    location: "Riyadh, Saudi Arabia",
    rating: 4,
    review: "Great platform for first-time investors. The educational resources and market insights helped me understand Dubai's real estate market dynamics. The developer ratings and RERA verification badges provided the trust factor I needed to invest confidently.",
    property: "JVC Townhouse",
    investmentAmount: "AED 1.8M",
    dateInvested: "May 2024",
    verified: true,
    helpful: 12
  }
];

const platformStats = [
  { label: "Total Investments Facilitated", value: "AED 2.5B+", icon: "💰" },
  { label: "Happy Investors", value: "5,000+", icon: "👥" },
  { label: "Average ROI Achieved", value: "8.7%", icon: "📈" },
  { label: "Properties Listed", value: "15,000+", icon: "🏢" }
];

export function ReviewsSection() {
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Trusted by Investors Worldwide
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Real reviews from real investors who have successfully grown their wealth through our platform
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {platformStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {reviews.map((review) => (
            <Card key={review.id} className="relative">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4">
                  <Quote className="h-8 w-8 text-blue-100" />
                </div>
                
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <ImageWithFallback
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      {review.verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{review.location}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600 ml-2">({review.rating}/5)</span>
                </div>

                {/* Review Text */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  "{review.review}"
                </p>

                {/* Investment Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Property:</span>
                    <span className="font-medium">{review.property}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Investment:</span>
                    <span className="font-medium">{review.investmentAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">{review.dateInvested}</span>
                  </div>
                </div>

                {/* Helpful Button */}
                <div className="flex items-center justify-between text-sm">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <span className="text-gray-400">Verified Purchase</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Join Thousands of Successful Investors
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Start your investment journey with Dubai's most trusted real estate platform. 
              Get personalized recommendations, transparent data, and expert support every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Investing Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-4 text-blue-100">
                <div className="flex items-center space-x-1">
                  {renderStars(5).map((star, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-300 fill-current" />
                  ))}
                </div>
                <span className="text-sm">4.8/5 Average Rating</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* External Reviews */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Also Featured On
          </h3>
          <div className="flex flex-wrap justify-center items-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-medium">Trustpilot: 4.7/5 (1,200+ reviews)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-medium">Google Reviews: 4.8/5 (800+ reviews)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-medium">Property Finder: 4.6/5 (500+ reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}