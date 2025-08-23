import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const newsItems = [
  {
    id: 1,
    title: "Dubai Real Estate Market Hits Record High in Q4 2024",
    summary: "Property transactions reach AED 150 billion, marking a 25% increase from the previous year as international investors show renewed confidence in Dubai's market.",
    category: "Market Trends",
    publishedAt: "2 hours ago",
    image: "https://images.unsplash.com/photo-1609764465693-a2dc6c6f7dbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMHNreWxpbmUlMjBtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU1OTQxOTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    trending: true
  },
  {
    id: 2,
    title: "New RERA Regulations Enhance Investor Protection",
    summary: "Dubai Land Department introduces stricter developer compliance requirements and enhanced escrow account monitoring to safeguard investor interests.",
    category: "Regulations",
    publishedAt: "5 hours ago",
    image: "https://images.unsplash.com/photo-1726003354242-4ff17c3515e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzU1OTQxOTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    trending: false
  },
  {
    id: 3,
    title: "Dubai Hills Estate Launches New Phase of Luxury Villas",
    summary: "Emaar Properties unveils 200 new luxury villas with golf course views, starting from AED 2.5M with innovative smart home technology.",
    category: "New Launches",
    publishedAt: "1 day ago",
    image: "https://images.unsplash.com/photo-1696743297474-d674b8e3d82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGZhY2FkZXxlbnwxfHx8fDE3NTU4NTEyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    trending: false
  },
  {
    id: 4,
    title: "Sustainable Building Practices Drive Green Premium",
    summary: "LEED-certified properties in Dubai command 15% premium as sustainability becomes key factor in property valuation and investor decisions.",
    category: "Sustainability",
    publishedAt: "2 days ago",
    image: "https://images.unsplash.com/photo-1609764465693-a2dc6c6f7dbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMHNreWxpbmUlMjBtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU1OTQxOTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    trending: true
  },
  {
    id: 5,
    title: "Virtual Property Tours See 300% Increase in Usage",
    summary: "AI-powered virtual reality property viewings become standard practice, reducing physical site visits by 60% while maintaining high conversion rates.",
    category: "Technology",
    publishedAt: "3 days ago",
    image: "https://images.unsplash.com/photo-1726003354242-4ff17c3515e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzU1OTQxOTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    trending: false
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Market Trends":
      return "bg-blue-100 text-blue-800";
    case "Regulations":
      return "bg-purple-100 text-purple-800";
    case "New Launches":
      return "bg-green-100 text-green-800";
    case "Sustainability":
      return "bg-emerald-100 text-emerald-800";
    case "Technology":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function NewsSection() {
  const featuredNews = newsItems[0];
  const otherNews = newsItems.slice(1);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Latest Real Estate News
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Stay informed with the latest market trends, regulations, and investment opportunities
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Featured News */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <Badge className={getCategoryColor(featuredNews.category)}>
                    {featuredNews.category}
                  </Badge>
                  {featuredNews.trending && (
                    <Badge className="bg-red-100 text-red-800 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {featuredNews.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {featuredNews.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {featuredNews.publishedAt}
                  </div>
                  <Button variant="outline" size="sm">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other News */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">More News</h3>
            {otherNews.map((news) => (
              <Card key={news.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ImageWithFallback
                      src={news.image}
                      alt={news.title}
                      className="w-24 h-24 object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getCategoryColor(news.category)} variant="secondary">
                        {news.category}
                      </Badge>
                      {news.trending && (
                        <Badge className="bg-red-100 text-red-800" variant="secondary">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                      {news.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {news.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {news.publishedAt}
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Stay Updated with Market Insights
            </h3>
            <p className="text-gray-600 mb-6">
              Get weekly newsletters with market analysis, investment tips, and exclusive property previews
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              No spam. Unsubscribe at any time.
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-10">
          <Button size="lg" variant="outline">
            View All News & Reports
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}