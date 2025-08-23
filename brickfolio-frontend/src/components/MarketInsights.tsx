import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, BarChart3, PieChart, ArrowRight } from 'lucide-react';

const marketData = [
  {
    title: "Average ROI",
    value: "8.2%",
    change: "+0.5%",
    trend: "up",
    description: "Yearly return on investment"
  },
  {
    title: "Price Growth",
    value: "12.3%",
    change: "+2.1%",
    trend: "up",
    description: "Year-over-year price appreciation"
  },
  {
    title: "Rental Yield",
    value: "6.8%",
    change: "-0.2%",
    trend: "down",
    description: "Average rental yield"
  },
  {
    title: "Market Volume",
    value: "AED 45.2B",
    change: "+8.7%",
    trend: "up",
    description: "Total transaction volume"
  }
];

const topPerformingAreas = [
  { area: "Dubai Hills", growth: "+15.2%", color: "bg-green-500" },
  { area: "Business Bay", growth: "+12.8%", color: "bg-blue-500" },
  { area: "Dubai Marina", growth: "+11.4%", color: "bg-purple-500" },
  { area: "Downtown", growth: "+9.7%", color: "bg-orange-500" }
];

interface MarketInsightsProps {
  onViewAnalytics?: () => void;
}

export function MarketInsights({ onViewAnalytics }: MarketInsightsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Market Insights & Analytics
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Real-time market data to help you make informed investment decisions
          </p>
        </div>

        {/* Market Metrics */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {marketData.map((metric, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </h3>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {metric.title}
                </p>
                <div className={`inline-flex items-center space-x-1 text-sm ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  <span>{metric.change}</span>
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Top Performing Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Top Performing Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${area.color}`}></div>
                      <span className="font-medium">{area.area}</span>
                    </div>
                    <span className="text-green-600 font-semibold">
                      {area.growth}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">
                View Detailed Analysis
              </Button>
            </CardContent>
          </Card>

          {/* Investment Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Investment Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Apartments</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Villas</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Commercial</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6">
                Explore Market Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-10">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={onViewAnalytics}>
            Access Full Analytics Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}