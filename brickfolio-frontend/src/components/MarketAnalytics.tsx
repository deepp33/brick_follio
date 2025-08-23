import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  getMarketData, 
  getMarketTrends, 
  getMarketFilters
} from '../features/market/marketSlice';
import type { MarketTrendsFilterPayload } from '../features/market/marketSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  ArrowRight, 
  Filter, 
  X, 
  Loader2,
  RefreshCw,
  Download,
  Building,
  MapPin,
  DollarSign,
  TrendingUp as TrendingUpIcon,
  FileText,
  Camera
} from 'lucide-react';
import { generateMarketAnalyticsPDF, generatePDFFromElement, type MarketDataForPDF } from '../utils/pdfExport';
import { PageLoader, CardLoader } from './ui/loader';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

export function MarketAnalytics() {
  const dispatch = useAppDispatch();
  const { marketData, marketTrends, marketFilters, loading, error } = useAppSelector((state) => state.market);
  
  // Filter state
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<string>('Last 1 Year');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [roiRange, setRoiRange] = useState<[number, number]>([5, 15]);
  const [rentalYieldRange, setRentalYieldRange] = useState<[number, number]>([4, 10]);
  const [priceGrowthRange, setPriceGrowthRange] = useState<[number, number]>([0, 30]);
  const [showFilters, setShowFilters] = useState(true);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Helper functions to transform data for charts
  const transformRoiDataForChart = () => {
    if (!marketTrends?.roiTrendsByArea?.options || !marketTrends?.roiTrendsByArea?.months) {
      return [];
    }

    const { options, months } = marketTrends.roiTrendsByArea;
    
    return months.map((month, monthIndex) => {
      const dataPoint: any = { month };
      options.forEach(option => {
        dataPoint[option.location] = parseFloat(option.roi[monthIndex] || '0');
      });
      return dataPoint;
    });
  };

  const transformRentalYieldDataForChart = () => {
    if (!marketTrends?.rentalYieldByArea) {
      return [];
    }

    return marketTrends.rentalYieldByArea.map(item => ({
      name: item.location,
      value: parseFloat(item.rentalYield),
      properties: item.properties
    }));
  };

  const transformTransactionVolumesDataForChart = () => {
    if (!marketTrends?.transactionVolumes?.Month || !marketTrends?.transactionVolumes?.options) {
      return [];
    }

    const { Month, options } = marketTrends.transactionVolumes;
    const months = Object.keys(Month);
    
    return months.map(month => {
      const dataPoint: any = { month };
      options.forEach(option => {
        dataPoint[option] = Month[month]?.[option] || 0;
      });
      return dataPoint;
    });
  };

  const getChartColors = (index: number) => {
    const colors = [
      '#3B82F6', // blue-500
      '#8B5CF6', // purple-500
      '#10B981', // green-500
      '#F59E0B', // amber-500
      '#EF4444', // red-500
      '#06B6D4', // cyan-500
      '#84CC16', // lime-500
      '#F97316', // orange-500
      '#EC4899', // pink-500
      '#6366F1'  // indigo-500
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    dispatch(getMarketData());
    dispatch(getMarketFilters());
  }, [dispatch]);

  // Apply default filters when component mounts and filters are loaded
  useEffect(() => {
    if (marketFilters && !marketTrends) {
      // Set default filter values
      setSelectedTimeHorizon('Last 1 Year');
      setSelectedRegions(['Dubai Marina', 'Downtown Dubai']);
      setSelectedPropertyTypes([]);
      setRoiRange([5, 15]);
      setRentalYieldRange([4, 10]);
      setPriceGrowthRange([0, 30]);
      
      // Apply default filters
      const defaultFilterPayload: MarketTrendsFilterPayload = {
        timeHorizon: 'Last 1 Year',
        regions: ['Dubai Marina', 'Downtown Dubai'],
        propertyTypes: [],
        roiRange: { min: 5, max: 15 },
        rentalYieldRange: { min: 4, max: 10 },
        priceGrowthRange: { min: 0, max: 30 }
      };
      
      dispatch(getMarketTrends(defaultFilterPayload));
    }
  }, [marketFilters, marketTrends, dispatch]);

  useEffect(() => {
    if (marketFilters) {
      // Initialize ranges from API data
      setRoiRange([marketFilters.roiRange.selectedMin, marketFilters.roiRange.selectedMax]);
      setRentalYieldRange([marketFilters.rentalYieldRange.selectedMin, marketFilters.rentalYieldRange.selectedMax]);
      setPriceGrowthRange([marketFilters.priceGrowthRange.selectedMin, marketFilters.priceGrowthRange.selectedMax]);
    }
  }, [marketFilters]);

  const applyFilters = async () => {
    setTrendsLoading(true);
    const filterPayload: MarketTrendsFilterPayload = {
      timeHorizon: selectedTimeHorizon,
      regions: selectedRegions,
      propertyTypes: selectedPropertyTypes,
      roiRange: {
        min: roiRange[0],
        max: roiRange[1]
      },
      rentalYieldRange: {
        min: rentalYieldRange[0],
        max: rentalYieldRange[1]
      },
      priceGrowthRange: {
        min: priceGrowthRange[0],
        max: priceGrowthRange[1]
      }
    };
    
    console.log('Applying filters with payload:', filterPayload);
    
    try {
      const result = await dispatch(getMarketTrends(filterPayload)).unwrap();
      console.log('Market trends result:', result);
    } catch (error) {
      console.error('Failed to fetch market trends:', error);
    } finally {
      setTrendsLoading(false);
    }
  };

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

  const clearAllFilters = () => {
    setSelectedRegions([]);
    setSelectedPropertyTypes([]);
    if (marketFilters) {
      setRoiRange([marketFilters.roiRange.selectedMin, marketFilters.roiRange.selectedMax]);
      setRentalYieldRange([marketFilters.rentalYieldRange.selectedMin, marketFilters.rentalYieldRange.selectedMax]);
      setPriceGrowthRange([marketFilters.priceGrowthRange.selectedMin, marketFilters.priceGrowthRange.selectedMax]);
    }
  };

  const getTrendIcon = (change: string) => {
    const isPositive = change.startsWith('+');
    return isPositive ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      if (marketData) {
        const pdfData: MarketDataForPDF = {
          metrics: marketData.metrics,
          topPerformingAreas: marketData.topPerformingAreas,
          investmentTrends: marketData.investmentTrends,
          marketTrends: marketTrends || undefined,
          filters: {
            timeHorizon: selectedTimeHorizon,
            regions: selectedRegions,
            propertyTypes: selectedPropertyTypes,
            roiRange: {
              min: roiRange[0],
              max: roiRange[1]
            },
            rentalYieldRange: {
              min: rentalYieldRange[0],
              max: rentalYieldRange[1]
            },
            priceGrowthRange: {
              min: priceGrowthRange[0],
              max: priceGrowthRange[1]
            }
          }
        };

        await generateMarketAnalyticsPDF(pdfData);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExportingPDF(false);
    }
  };

  const handleExportScreenshotPDF = async () => {
    setExportingPDF(true);
    try {
      if (contentRef.current) {
        await generatePDFFromElement(contentRef.current);
      }
    } catch (error) {
      console.error('Error generating screenshot PDF:', error);
      alert('Failed to generate screenshot PDF. Please try again.');
    } finally {
      setExportingPDF(false);
    }
  };

  if (loading && !marketData) {
    return <PageLoader text="Loading market analytics..." icon="chart" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Market Analytics</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Home &gt; Market Insights & Analytics
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  disabled={exportingPDF || !marketData}
                >
                  {exportingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export Report
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={handleExportPDF}
                  disabled={exportingPDF || !marketData}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export Data Report (PDF)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleExportScreenshotPDF}
                  disabled={exportingPDF}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Export Screenshot (PDF)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Market Insights & Analytics
        </h1>
        <p className="text-gray-600">
          Get comprehensive real-time analytics for Dubai's real estate market to make smarter investment decisions.
        </p>
      </div>

      <div className="flex">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="w-80 bg-white border-r border-gray-200 p-6 min-h-screen">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>

            <div className="space-y-6">
              {/* Time Horizon */}
              <div>
                <h4 className="font-medium mb-3 text-sm text-gray-700">Time Horizon</h4>
                <Select value={selectedTimeHorizon} onValueChange={setSelectedTimeHorizon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {marketFilters?.timeHorizon?.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    )) || ['Last 1 Year', 'Last 6 Months', 'Last 3 Months', 'Current Month'].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Regions */}
              <div>
                <h4 className="font-medium mb-3 text-sm text-gray-700">Regions</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {marketFilters?.regions?.map((region) => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox
                        id={region}
                        checked={selectedRegions.includes(region)}
                        onCheckedChange={() => handleRegionToggle(region)}
                      />
                      <label htmlFor={region} className="text-sm">{region}</label>
                    </div>
                  )) || ['Dubai Marina', 'Downtown Dubai', 'Business Bay', 'Palm Jumeirah', 'DIFC', 'JBR'].map((region) => (
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
                <h4 className="font-medium mb-3 text-sm text-gray-700">Property Types</h4>
                <div className="space-y-2">
                  {marketFilters?.propertyTypes?.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={selectedPropertyTypes.includes(type)}
                        onCheckedChange={() => handlePropertyTypeToggle(type)}
                      />
                      <label htmlFor={type} className="text-sm">{type}</label>
                    </div>
                  )) || ['Apartment', 'Villa', 'Townhouse', 'Commercial', 'Office'].map((type) => (
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
                <h4 className="font-medium mb-3 text-sm text-gray-700">ROI Range: {roiRange[0]}% - {roiRange[1]}%</h4>
                <Slider
                  value={roiRange}
                  onValueChange={setRoiRange}
                  max={marketFilters?.roiRange?.max || 20}
                  min={marketFilters?.roiRange?.min || 0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Rental Yield Range */}
              <div>
                <h4 className="font-medium mb-3 text-sm text-gray-700">Rental Yield Range: {rentalYieldRange[0]}% - {rentalYieldRange[1]}%</h4>
                <Slider
                  value={rentalYieldRange}
                  onValueChange={setRentalYieldRange}
                  max={marketFilters?.rentalYieldRange?.max || 15}
                  min={marketFilters?.rentalYieldRange?.min || 0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Price Growth Range */}
              <div>
                <h4 className="font-medium mb-3 text-sm text-gray-700">Price Growth Range: {priceGrowthRange[0]}% - {priceGrowthRange[1]}%</h4>
                <Slider
                  value={priceGrowthRange}
                  onValueChange={setPriceGrowthRange}
                  max={marketFilters?.priceGrowthRange?.max || 50}
                  min={marketFilters?.priceGrowthRange?.min || 0}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button 
                className="w-full" 
                onClick={applyFilters}
                disabled={trendsLoading}
              >
                {trendsLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Trends...
                  </>
                ) : (
                  'Apply Filters'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6" ref={contentRef}>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Properties Analyzed</p>
                    <p className="text-3xl font-bold text-blue-600">45,623</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      +8.2% from last month
                    </p>
                  </div>
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Average ROI</p>
                    <p className="text-3xl font-bold text-green-600">{marketData?.metrics?.averageROI || '8.2%'}</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      {marketData?.metrics?.yearlyROIChange || '+0.5%'} from last quarter
                    </p>
                  </div>
                  <TrendingUpIcon className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Average Rental Yield</p>
                    <p className="text-3xl font-bold text-purple-600">{marketData?.metrics?.rentalYield || '6.8%'}</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      +1.2% from last year
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Market Growth (YoY)</p>
                    <p className="text-3xl font-bold text-orange-600">{marketData?.metrics?.priceGrowth || '12.5%'}</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Accelerating growth
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="market-trends">Market Trends</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* ROI Trends by Area Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    ROI Trends by Area
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {marketTrends?.roiTrendsByArea?.options && marketTrends.roiTrendsByArea.options.length > 0 ? (
                    <>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={transformRoiDataForChart()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value: any) => [`${value}%`, 'ROI']}
                              labelFormatter={(label) => `Month: ${label}`}
                            />
                            <Legend />
                            {marketTrends.roiTrendsByArea.options.map((option, index) => (
                              <Line
                                key={option.location}
                                type="monotone"
                                dataKey={option.location}
                                stroke={getChartColors(index)}
                                strokeWidth={2}
                                dot={{ fill: getChartColors(index), strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {marketTrends.roiTrendsByArea.options.map((option, index) => {
                          const latestRoi = option.roi[option.roi.length - 1];
                          return (
                            <div key={option.location} className="text-center">
                              <p className="text-sm text-gray-600">{option.location}</p>
                              <p className="text-lg font-semibold text-blue-600">{latestRoi}%</p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No ROI trends data available</p>
                        <p className="text-sm text-gray-400">Apply filters to see ROI trends</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Rental Yield by Area Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Rental Yield by Area
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {marketTrends?.rentalYieldByArea && marketTrends.rentalYieldByArea.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={transformRentalYieldDataForChart()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {transformRentalYieldDataForChart().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getChartColors(index)} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: any) => [`${value}%`, 'Rental Yield']}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {marketTrends.rentalYieldByArea.map((item, index) => (
                          <div key={item.location} className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">{item.location}</p>
                            <p className="text-xl font-bold text-blue-600 mb-1">{item.rentalYield}%</p>
                            <p className="text-xs text-gray-500">{item.properties} properties</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No rental yield data available</p>
                        <p className="text-sm text-gray-400">Apply filters to see rental yield data</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Transaction Volumes Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Transaction Volumes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {marketTrends?.transactionVolumes?.options && marketTrends.transactionVolumes.options.length > 0 ? (
                    <>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={transformTransactionVolumesDataForChart()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value: any) => [value, 'Transactions']}
                              labelFormatter={(label) => `Month: ${label}`}
                            />
                            <Legend />
                            {marketTrends.transactionVolumes.options.map((option, index) => (
                              <Bar
                                key={option}
                                dataKey={option}
                                fill={getChartColors(index)}
                                stackId="a"
                              />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 flex justify-center space-x-6">
                        {marketTrends.transactionVolumes.options.map((option, index) => (
                          <div key={option} className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded" 
                              style={{ backgroundColor: getChartColors(index) }}
                            ></div>
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No transaction volume data available</p>
                        <p className="text-sm text-gray-400">Apply filters to see transaction volumes</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="market-trends" className="space-y-6">
              {/* Filtered Market Trends */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Filtered Market Trends</h3>
                  {trendsLoading && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading filtered data...
                    </div>
                  )}
                </div>

                {marketTrends ? (
                  <>
                                         {/* ROI Trends by Area */}
                     <Card>
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <BarChart3 className="w-5 h-5" />
                           ROI Trends by Area
                         </CardTitle>
                       </CardHeader>
                       <CardContent>
                         <div className="space-y-3">
                           {marketTrends.roiTrendsByArea && marketTrends.roiTrendsByArea.options && marketTrends.roiTrendsByArea.options.length > 0 ? (
                             marketTrends.roiTrendsByArea.options.map((option, index) => {
                               const latestRoi = option.roi[option.roi.length - 1];
                               return (
                                 <div key={option.location} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                   <div className="flex items-center space-x-3">
                                     <Badge variant="outline">{index + 1}</Badge>
                                     <span className="font-medium">{option.location}</span>
                                   </div>
                                   <div className="text-right">
                                     <div className="font-medium text-green-600">{latestRoi}%</div>
                                     <div className="text-sm text-gray-500">ROI</div>
                                   </div>
                                 </div>
                               );
                             })
                           ) : (
                             <div className="text-center py-8">
                               <p className="text-gray-500">No ROI trends data available for selected filters</p>
                             </div>
                           )}
                         </div>
                       </CardContent>
                     </Card>

                    {/* Rental Yield by Area */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="w-5 h-5" />
                          Rental Yield by Area
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {marketTrends.rentalYieldByArea && marketTrends.rentalYieldByArea.length > 0 ? (
                            marketTrends.rentalYieldByArea.map((yieldData, index) => (
                              <div key={yieldData.location} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Badge variant="outline">{index + 1}</Badge>
                                  <span className="font-medium">{yieldData.location}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-blue-600">{yieldData.rentalYield}%</div>
                                  <div className="text-sm text-gray-500">{yieldData.properties} properties</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">No rental yield data available for selected filters</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Transaction Volumes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Transaction Volumes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {marketTrends.transactionVolumes && marketTrends.transactionVolumes.options && marketTrends.transactionVolumes.options.length > 0 ? (
                            marketTrends.transactionVolumes.options.map((option) => (
                              <div key={option} className="p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">{option}</h4>
                                <div className="space-y-2">
                                  {marketTrends.transactionVolumes.Month && Object.entries(marketTrends.transactionVolumes.Month).map(([month, data]) => (
                                    <div key={month} className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">{month}</span>
                                      <span className="font-medium">{data[option] || 0} transactions</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">No transaction volume data available for selected filters</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="py-12">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Filtered Data</h3>
                        <p className="text-gray-500 mb-4">
                          Apply filters in the sidebar to see detailed market trends and analytics
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowFilters(true)}
                        >
                          Open Filters
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Comparison Analysis</h3>
                    <p className="text-gray-500">Comparison features coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="infrastructure" className="space-y-6">
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Building className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Infrastructure Analysis</h3>
                    <p className="text-gray-500">Infrastructure features coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}