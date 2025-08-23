import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  getMarketData, 
  getMarketTrends, 
  getMarketFilters 
} from '../features/market/marketSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';

export function MarketAnalytics() {
  const dispatch = useAppDispatch();
  const { marketData, marketTrends, marketFilters, loading, error } = useAppSelector((state) => state.market);
  
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [roiRange, setRoiRange] = useState<[number, number]>([0, 20]);
  const [rentalYieldRange, setRentalYieldRange] = useState<[number, number]>([0, 15]);

  useEffect(() => {
    dispatch(getMarketData());
    dispatch(getMarketTrends({
      timeHorizon: '1year',
      regions: [],
      propertyTypes: [],
      roiRange: { min: 0, max: 20 },
      rentalYieldRange: { min: 0, max: 15 },
      priceGrowthRange: { min: 0, max: 30 }
    }));
    dispatch(getMarketFilters());
  }, [dispatch]);

  const handleRegionToggle = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handlePropertyTypeToggle = (type: string) => {
    setSelectedPropertyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading market data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Market Analytics</h2>
        <Badge variant="secondary">Real-time Data</Badge>
            </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {marketData?.averageROI || '8.5'}%
            </div>
            <p className="text-xs text-gray-500 mt-1">+2.1% from last month</p>
              </CardContent>
            </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Rental Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {marketData?.averageRentalYield || '6.2'}%
                    </div>
            <p className="text-xs text-gray-500 mt-1">+0.8% from last month</p>
              </CardContent>
            </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Price Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {marketData?.priceGrowth || '4.3'}%
                    </div>
            <p className="text-xs text-gray-500 mt-1">+1.2% from last month</p>
              </CardContent>
            </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {marketData?.activeProjects || '156'}
                    </div>
            <p className="text-xs text-gray-500 mt-1">+12 from last month</p>
              </CardContent>
            </Card>
        </div>

      {/* Filters Section */}
      <Card>
                <CardHeader>
          <CardTitle>Market Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Regions */}
                  <div>
            <h4 className="font-medium mb-3">Regions</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {marketFilters?.regions?.map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={region}
                            checked={selectedRegions.includes(region)}
                    onCheckedChange={() => handleRegionToggle(region)}
                          />
                  <label htmlFor={region} className="text-sm">{region}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Types */}
                  <div>
            <h4 className="font-medium mb-3">Property Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {marketFilters?.propertyTypes?.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={selectedPropertyTypes.includes(type)}
                    onCheckedChange={() => handlePropertyTypeToggle(type)}
                          />
                  <label htmlFor={type} className="text-sm">{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ROI Range */}
                  <div>
            <h4 className="font-medium mb-3">ROI Range: {roiRange[0]}% - {roiRange[1]}%</h4>
                    <Slider
                      value={roiRange}
                      onValueChange={setRoiRange}
                      max={20}
                      min={0}
                      step={0.5}
              className="w-full"
                    />
                  </div>

                  {/* Rental Yield Range */}
                  <div>
            <h4 className="font-medium mb-3">Rental Yield Range: {rentalYieldRange[0]}% - {rentalYieldRange[1]}%</h4>
                    <Slider
                      value={rentalYieldRange}
                      onValueChange={setRentalYieldRange}
              max={15}
              min={0}
              step={0.5}
              className="w-full"
            />
                  </div>

          <Button className="w-full">Apply Filters</Button>
                  </CardContent>
                </Card>

      {/* Market Trends */}
                <Card>
                  <CardHeader>
          <CardTitle>Market Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
          {marketTrends && marketTrends.length > 0 ? (
            <div className="space-y-4">
              {marketTrends.slice(0, 5).map((trend, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{trend.title}</h4>
                    <p className="text-sm text-gray-600">{trend.description}</p>
                            </div>
                  <Badge variant={trend.type === 'positive' ? 'default' : 'destructive'}>
                    {trend.change}
                  </Badge>
                        </div>
                      ))}
                    </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No market trends available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

      {/* Top Performing Regions */}
                <Card>
                  <CardHeader>
          <CardTitle>Top Performing Regions</CardTitle>
                  </CardHeader>
                  <CardContent>
          <div className="space-y-3">
            {marketData?.topRegions?.map((region: any, index: number) => (
              <div key={region.name} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span className="font-medium">{region.name}</span>
                                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">{region.roi}% ROI</div>
                  <div className="text-sm text-gray-500">{region.rentalYield}% Yield</div>
                                </div>
                              </div>
            )) || (
              <div className="text-center py-8">
                <p className="text-gray-500">No regional data available</p>
                            </div>
            )}
                    </div>
                  </CardContent>
                </Card>
    </div>
  );
}