import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  MapPin, 
  Filter,
  Download,
  Maximize2,
  RefreshCw,
  Info,
  Calendar,
  Building,
  DollarSign,
  Percent,
  Home,
  ChevronDown,
  ChevronUp,
  Eye,
  Users,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart,
  ComposedChart,
  Scatter,
  ScatterChart
} from 'recharts';

interface MarketAnalyticsProps {
  onClose: () => void;
}

// Mock data
const kpiData = {
  totalProperties: 45623,
  averageROI: 8.2,
  averageRentalYield: 6.8,
  marketGrowth: 12.5
};

const roiTrendData = [
  { month: 'Jan', dubai_marina: 7.2, downtown: 8.1, business_bay: 9.2, palm_jumeirah: 5.8 },
  { month: 'Feb', dubai_marina: 7.4, downtown: 8.0, business_bay: 9.4, palm_jumeirah: 6.0 },
  { month: 'Mar', dubai_marina: 7.6, downtown: 8.3, business_bay: 9.1, palm_jumeirah: 6.2 },
  { month: 'Apr', dubai_marina: 7.8, downtown: 8.5, business_bay: 9.3, palm_jumeirah: 6.1 },
  { month: 'May', dubai_marina: 8.0, downtown: 8.7, business_bay: 9.5, palm_jumeirah: 6.3 },
  { month: 'Jun', dubai_marina: 8.2, downtown: 8.9, business_bay: 9.7, palm_jumeirah: 6.5 }
];

const rentalYieldData = [
  { area: 'Dubai Marina', yield: 6.8, change: 2.3, properties: 1245, color: '#0ea5e9' },
  { area: 'Downtown Dubai', yield: 6.2, change: 1.8, properties: 987, color: '#3b82f6' },
  { area: 'Business Bay', yield: 7.5, change: 3.1, properties: 756, color: '#6366f1' },
  { area: 'Palm Jumeirah', yield: 5.2, change: -0.5, properties: 432, color: '#8b5cf6' },
  { area: 'DIFC', yield: 8.1, change: 4.2, properties: 234, color: '#a855f7' },
  { area: 'JBR', yield: 6.9, change: 2.7, properties: 678, color: '#d946ef' }
];

const priceAppreciationData = [
  { area: 'Dubai Marina', appreciation: 15.2, avgPrice: 1250000, volume: 234 },
  { area: 'Downtown Dubai', appreciation: 18.7, avgPrice: 1650000, volume: 187 },
  { area: 'Business Bay', appreciation: 22.3, avgPrice: 1450000, volume: 156 },
  { area: 'Palm Jumeirah', appreciation: 8.9, avgPrice: 3200000, volume: 89 },
  { area: 'DIFC', appreciation: 25.1, avgPrice: 2100000, volume: 67 },
  { area: 'JBR', appreciation: 12.6, avgPrice: 1380000, volume: 145 }
];

const transactionVolumeData = [
  { month: 'Jan', apartments: 1234, villas: 567, commercial: 89, total: 1890 },
  { month: 'Feb', apartments: 1456, villas: 634, commercial: 98, total: 2188 },
  { month: 'Mar', apartments: 1678, villas: 723, commercial: 112, total: 2513 },
  { month: 'Apr', apartments: 1834, villas: 801, commercial: 134, total: 2769 },
  { month: 'May', apartments: 1567, villas: 689, commercial: 156, total: 2412 },
  { month: 'Jun', apartments: 1789, villas: 756, commercial: 145, total: 2690 }
];

const supplyDemandData = [
  { area: 'Dubai Marina', supply: 85, demand: 92, index: 1.08, trend: 'up' },
  { area: 'Downtown Dubai', supply: 78, demand: 95, index: 1.22, trend: 'up' },
  { area: 'Business Bay', supply: 72, demand: 88, index: 1.22, trend: 'up' },
  { area: 'Palm Jumeirah', supply: 45, demand: 67, index: 1.49, trend: 'up' },
  { area: 'DIFC', supply: 34, demand: 58, index: 1.71, trend: 'up' },
  { area: 'JBR', supply: 67, demand: 79, index: 1.18, trend: 'up' }
];

const infrastructureProjects = [
  { 
    name: 'Dubai Metro Blue Line Extension', 
    completion: '2026 Q2', 
    impact: 'High', 
    areas: ['Business Bay', 'Dubai Marina'],
    progress: 65,
    investment: '2.8B AED'
  },
  { 
    name: 'Al Maktoum International Airport Expansion', 
    completion: '2027 Q4', 
    impact: 'Very High', 
    areas: ['Dubai South', 'Al Garhoud'],
    progress: 35,
    investment: '12.5B AED'
  },
  { 
    name: 'Dubai Hills Mall Phase 2', 
    completion: '2025 Q1', 
    impact: 'Medium', 
    areas: ['Dubai Hills Estate'],
    progress: 85,
    investment: '1.2B AED'
  },
  { 
    name: 'Mohammed Bin Rashid City Central Park', 
    completion: '2025 Q3', 
    impact: 'High', 
    areas: ['MBR City', 'Downtown Dubai'],
    progress: 72,
    investment: '3.4B AED'
  }
];

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

export function MarketAnalytics({ onClose }: MarketAnalyticsProps) {
  // State management
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['Dubai Marina', 'Downtown Dubai']);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(['Apartment']);
  const [timeHorizon, setTimeHorizon] = useState('1year');
  const [roiRange, setRoiRange] = useState([5, 15]);
  const [rentalYieldRange, setRentalYieldRange] = useState([4, 10]);
  const [priceGrowthRange, setPriceGrowthRange] = useState([0, 30]);
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  // Filter options
  const regions = ['Dubai Marina', 'Downtown Dubai', 'Business Bay', 'Palm Jumeirah', 'DIFC', 'JBR', 'Dubai Hills Estate', 'MBR City'];
  const propertyTypes = ['Apartment', 'Villa', 'Townhouse', 'Commercial', 'Office'];

  // Helper functions
  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setSelectedRegions([]);
    setSelectedPropertyTypes([]);
    setRoiRange([5, 15]);
    setRentalYieldRange([4, 10]);
    setPriceGrowthRange([0, 30]);
    setTimeHorizon('1year');
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Animated counter component
  const AnimatedCounter = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => {
    return (
      <span className="tabular-nums">
        {prefix}{value.toLocaleString()}{suffix}
      </span>
    );
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
              
              {/* Breadcrumbs */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink onClick={onClose} className="cursor-pointer">
                      <Home className="h-4 w-4" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">Market Insights & Analytics</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Hero */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Insights & Analytics</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Get comprehensive real-time analytics for Dubai's real estate market to make smarter investment decisions.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Total Properties Analyzed</p>
                    <div className="text-2xl font-bold text-blue-900">
                      <AnimatedCounter value={kpiData.totalProperties} />
                    </div>
                    <div className="flex items-center text-xs text-blue-700 mt-2">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.2% from last month
                    </div>
                  </div>
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Average ROI</p>
                    <div className="text-2xl font-bold text-green-900">
                      <AnimatedCounter value={kpiData.averageROI} suffix="%" />
                    </div>
                    <div className="flex items-center text-xs text-green-700 mt-2">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +0.5% from last quarter
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Average Rental Yield</p>
                    <div className="text-2xl font-bold text-purple-900">
                      <AnimatedCounter value={kpiData.averageRentalYield} suffix="%" />
                    </div>
                    <div className="flex items-center text-xs text-purple-700 mt-2">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +1.2% from last year
                    </div>
                  </div>
                  <Percent className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 mb-1">Market Growth (YoY)</p>
                    <div className="text-2xl font-bold text-orange-900">
                      <AnimatedCounter value={kpiData.marketGrowth} suffix="%" />
                    </div>
                    <div className="flex items-center text-xs text-orange-700 mt-2">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Accelerating growth
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Filter className="h-5 w-5 mr-2" />
                      Filters
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Time Horizon */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Time Horizon</label>
                    <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6months">Last 6 Months</SelectItem>
                        <SelectItem value="1year">Last 1 Year</SelectItem>
                        <SelectItem value="3years">Last 3 Years</SelectItem>
                        <SelectItem value="5years">Last 5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Regions */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Regions</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {regions.map(region => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={region}
                            checked={selectedRegions.includes(region)}
                            onCheckedChange={() => toggleRegion(region)}
                          />
                          <label htmlFor={region} className="text-sm cursor-pointer">
                            {region}
                          </label>
                        </div>
                      ))}
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
                            checked={selectedPropertyTypes.includes(type)}
                            onCheckedChange={() => togglePropertyType(type)}
                          />
                          <label htmlFor={type} className="text-sm cursor-pointer">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ROI Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">ROI Range (%)</label>
                    <Slider
                      value={roiRange}
                      onValueChange={setRoiRange}
                      max={20}
                      min={0}
                      step={0.5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{roiRange[0]}%</span>
                      <span>{roiRange[1]}%</span>
                    </div>
                  </div>

                  {/* Rental Yield Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Rental Yield Range (%)</label>
                    <Slider
                      value={rentalYieldRange}
                      onValueChange={setRentalYieldRange}
                      max={12}
                      min={2}
                      step={0.1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{rentalYieldRange[0]}%</span>
                      <span>{rentalYieldRange[1]}%</span>
                    </div>
                  </div>

                  {/* Price Growth Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Price Growth Range (%)</label>
                    <Slider
                      value={priceGrowthRange}
                      onValueChange={setPriceGrowthRange}
                      max={50}
                      min={-10}
                      step={1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{priceGrowthRange[0]}%</span>
                      <span>{priceGrowthRange[1]}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Market Trends</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* ROI Trends Chart */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        ROI Trends by Area
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={roiTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="dubai_marina" stroke="#0ea5e9" strokeWidth={2} />
                        <Line type="monotone" dataKey="downtown" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="business_bay" stroke="#6366f1" strokeWidth={2} />
                        <Line type="monotone" dataKey="palm_jumeirah" stroke="#8b5cf6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Rental Yield Heatmap */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Rental Yield by Area
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rentalYieldData.map((area, index) => (
                        <div 
                          key={area.area}
                          className="p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer"
                          style={{ borderColor: area.color + '30', backgroundColor: area.color + '10' }}
                          onClick={() => setSelectedArea(area.area)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{area.area}</h4>
                            <div className="flex items-center space-x-1">
                              {area.change > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              <span className={`text-sm font-medium ${area.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {area.change > 0 ? '+' : ''}{area.change}%
                              </span>
                            </div>
                          </div>
                          <div className="text-2xl font-bold mb-1" style={{ color: area.color }}>
                            {area.yield}%
                          </div>
                          <div className="text-sm text-gray-600">
                            {area.properties} properties
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction Volumes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Transaction Volumes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={transactionVolumeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="apartments" stackId="a" fill="#0ea5e9" />
                        <Bar dataKey="villas" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="commercial" stackId="a" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Market Trends Tab */}
              <TabsContent value="trends" className="space-y-6">
                {/* Price Appreciation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Price Appreciation by Area
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={priceAppreciationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="area" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="appreciation" fill="#0ea5e9" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Supply & Demand Index */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Supply & Demand Index
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {supplyDemandData.map((item, index) => (
                        <Card key={item.area} className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{item.area}</h4>
                            <Badge variant={item.index > 1.2 ? 'default' : 'secondary'}>
                              Index: {item.index}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Supply</span>
                              <span>{item.supply}</span>
                            </div>
                            <Progress value={item.supply} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span>Demand</span>
                              <span>{item.demand}</span>
                            </div>
                            <Progress value={item.demand} className="h-2" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Comparison Tab */}
              <TabsContent value="comparison" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Regional Comparison Tool</CardTitle>
                    <p className="text-sm text-gray-600">Compare key metrics across selected regions</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">Select regions to compare:</label>
                      <div className="flex flex-wrap gap-2">
                        {regions.slice(0, 6).map(region => (
                          <Badge
                            key={region}
                            variant={selectedRegions.includes(region) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => toggleRegion(region)}
                          >
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {selectedRegions.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Region</th>
                              <th className="text-center py-2">Avg ROI</th>
                              <th className="text-center py-2">Rental Yield</th>
                              <th className="text-center py-2">Price Growth</th>
                              <th className="text-center py-2">Supply/Demand</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedRegions.map(region => {
                              const yieldData = rentalYieldData.find(d => d.area === region);
                              const priceData = priceAppreciationData.find(d => d.area === region);
                              const supplyData = supplyDemandData.find(d => d.area === region);
                              
                              return (
                                <tr key={region} className="border-b">
                                  <td className="py-3 font-medium">{region}</td>
                                  <td className="text-center py-3">
                                    {roiTrendData[roiTrendData.length - 1]?.[region.toLowerCase().replace(' ', '_')] || 'N/A'}%
                                  </td>
                                  <td className="text-center py-3">{yieldData?.yield || 'N/A'}%</td>
                                  <td className="text-center py-3">{priceData?.appreciation || 'N/A'}%</td>
                                  <td className="text-center py-3">{supplyData?.index || 'N/A'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Infrastructure Tab */}
              <TabsContent value="infrastructure" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Government Development Tracker
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Major infrastructure projects impacting property values
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {infrastructureProjects.map((project, index) => (
                        <div key={project.name} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">{project.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {project.completion}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  {project.investment}
                                </div>
                              </div>
                            </div>
                            <Badge className={getImpactColor(project.impact)}>
                              {project.impact} Impact
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Impacted Areas:</p>
                            <div className="flex flex-wrap gap-1">
                              {project.areas.map(area => (
                                <Badge key={area} variant="outline" className="text-xs">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}