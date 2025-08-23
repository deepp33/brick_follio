import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getMarketData } from '../features/market/marketSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, BarChart3, PieChart, ArrowRight } from 'lucide-react';

interface MarketInsightsProps {
  onViewAnalytics?: () => void;
}

export function MarketInsights({ onViewAnalytics }: MarketInsightsProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { marketData, loading } = useAppSelector((state) => state.market);

  useEffect(() => {
    dispatch(getMarketData());
  }, [dispatch]);

  const getTrendIcon = (change: string) => {
    const isPositive = change.startsWith('+');
    return isPositive ? <TrendingUp className="h-8 w-8 text-green-500" /> : <TrendingDown className="h-8 w-8 text-red-500" />;
  };

  const getTrendIconSmall = (change: string) => {
    const isPositive = change.startsWith('+');
    return isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const handleViewAnalytics = () => {
    if (onViewAnalytics) {
      onViewAnalytics();
    } else {
      navigate('/market-analytics');
    }
  };

  const marketMetrics = [
    {
      title: "Average ROI",
      value: marketData?.metrics?.averageROI || "8.2%",
      change: marketData?.metrics?.yearlyROIChange || "+0.5%",
      trend: marketData?.metrics?.yearlyROIChange?.startsWith('+') ? "up" : "down",
      description: "Yearly return on investment"
    },
    {
      title: "Price Growth",
      value: marketData?.metrics?.priceGrowth || "12.3%",
      change: marketData?.metrics?.priceYoYChange || "+2.1%",
      trend: marketData?.metrics?.priceYoYChange?.startsWith('+') ? "up" : "down",
      description: "Year-over-year price appreciation"
    },
    {
      title: "Rental Yield",
      value: marketData?.metrics?.rentalYield || "6.8%",
      change: marketData?.metrics?.rentalYieldChange || "-0.2%",
      trend: marketData?.metrics?.rentalYieldChange?.startsWith('+') ? "up" : "down",
      description: "Average rental yield"
    },
    {
      title: "Market Volume",
      value: marketData?.metrics?.marketVolume || "AED 45.2B",
      change: marketData?.metrics?.totalTransactionVolumeChange || "+8.7%",
      trend: marketData?.metrics?.totalTransactionVolumeChange?.startsWith('+') ? "up" : "down",
      description: "Total transaction volume"
    }
  ];

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
          {marketMetrics.map((metric, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2">
                  {getTrendIcon(metric.change)}
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
                  {getTrendIconSmall(metric.change)}
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
                {marketData?.topPerformingAreas?.map((area, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-green-500' : 
                        index === 1 ? 'bg-blue-500' : 
                        index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                      <span className="font-medium">{area.area}</span>
                    </div>
                    <span className="text-green-600 font-semibold">
                      {area.growth}
                    </span>
                  </div>
                )) || (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Loading market data...</p>
                  </div>
                )}
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
                {marketData?.investmentTrends?.map((trend, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{trend.type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-blue-600' : 
                            index === 1 ? 'bg-green-600' : 'bg-purple-600'
                          }`} 
                          style={{ width: trend.percentage }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{trend.percentage}</span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Loading investment trends...</p>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full mt-6">
                {marketData?.reportLink || "Explore Market Reports"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-10">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={handleViewAnalytics}>
            Access Full Analytics Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}