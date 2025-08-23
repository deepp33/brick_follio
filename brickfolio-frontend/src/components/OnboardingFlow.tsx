import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Target,
  DollarSign,
  TrendingUp,
  MapPin,
  Home,
  Clock,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OnboardingData {
  // Registration data
  email: string;
  password: string;
  fullName: string;
  
  // Questionnaire data
  investmentGoal: string;
  budget: number[];
  currency: string;
  riskAppetite: string;
  locationPreferences: string[];
  propertyTypes: string[];
  investmentHorizon: string;
  
  // Additional preferences
  roiTarget: number[];
  rentalYield: number[];
  maxCommute: number[];
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const TOTAL_STEPS = 8;

const investmentGoals = [
  { id: 'rental', label: 'Steady Rental Income', description: 'Focus on properties with high rental yields', icon: DollarSign },
  { id: 'growth', label: 'Long-term Growth', description: 'Capital appreciation over time', icon: TrendingUp },
  { id: 'personal', label: 'Personal Use', description: 'Buy for personal residence or vacation home', icon: Home }
];

const riskLevels = [
  { id: 'low', label: 'Low Risk', description: 'Stable returns with minimal volatility', color: 'bg-green-100 text-green-800' },
  { id: 'moderate', label: 'Moderate Risk', description: 'Balanced approach with steady growth', color: 'bg-blue-100 text-blue-800' },
  { id: 'high', label: 'High Risk', description: 'Higher potential returns with more volatility', color: 'bg-orange-100 text-orange-800' }
];

const dubaiLocations = [
  'Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Business Bay', 'Jumeirah Lakes Towers (JLT)',
  'Dubai Hills Estate', 'Jumeirah Village Circle (JVC)', 'Dubai Investment Park (DIP)',
  'Al Barsha', 'Dubai Silicon Oasis', 'Dubai Sports City', 'Arabian Ranches',
  'Emirates Hills', 'Dubai Festival City', 'Mirdif', 'Jumeirah'
];

const propertyTypeOptions = [
  { id: 'apartment', label: 'Apartments', icon: '🏢' },
  { id: 'villa', label: 'Villas', icon: '🏘️' },
  { id: 'townhouse', label: 'Townhouses', icon: '🏡' },
  { id: 'penthouse', label: 'Penthouses', icon: '🏙️' },
  { id: 'commercial', label: 'Commercial', icon: '🏢' },
  { id: 'office', label: 'Office Space', icon: '🏬' },
  { id: 'retail', label: 'Retail', icon: '🛍️' },
  { id: 'warehouse', label: 'Warehouse', icon: '🏭' }
];

const investmentHorizons = [
  { id: 'short', label: 'Short-term (1-3 years)', description: 'Quick flip or short rental period' },
  { id: 'medium', label: 'Medium-term (3-7 years)', description: 'Moderate hold for steady returns' },
  { id: 'long', label: 'Long-term (7+ years)', description: 'Long-term wealth building' }
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    email: '',
    password: '',
    fullName: '',
    investmentGoal: '',
    budget: [500000],
    currency: 'AED',
    riskAppetite: '',
    locationPreferences: [],
    propertyTypes: [],
    investmentHorizon: '',
    roiTarget: [8],
    rentalYield: [6],
    maxCommute: [30]
  });

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLocationToggle = (location: string) => {
    setFormData(prev => ({
      ...prev,
      locationPreferences: prev.locationPreferences.includes(location)
        ? prev.locationPreferences.filter(l => l !== location)
        : [...prev.locationPreferences, location]
    }));
  };

  const handlePropertyTypeToggle = (typeId: string) => {
    setFormData(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(typeId)
        ? prev.propertyTypes.filter(t => t !== typeId)
        : [...prev.propertyTypes, typeId]
    }));
  };

  const handleSocialLogin = (provider: string) => {
    // In real implementation, this would integrate with actual OAuth
    console.log(`Logging in with ${provider}`);
    setCurrentStep(1); // Skip to questionnaire
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Registration/Login
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Join DubaiInvest Pro'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isLogin ? 'Sign in to access your personalized investment dashboard' : 'Start your real estate investment journey in Dubai'}
              </p>
            </div>

            <div className="space-y-4">
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleSocialLogin('google')}
                  className="w-full"
                >
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb29nbGUlMjBsb2dvfGVufDF8fHx8MTc1NTk0MjE4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Google"
                    className="w-5 h-5 mr-2"
                  />
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSocialLogin('linkedin')}
                  className="w-full"
                >
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1611944212129-29977ae1398c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW5rZWRpbiUyMGxvZ298ZW58MXx8fHwxNzU1OTQyMTg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="LinkedIn"
                    className="w-5 h-5 mr-2"
                  />
                  LinkedIn
                </Button>
              </div>

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500">or continue with email</span>
                </div>
              </div>

              {/* Email Form */}
              <div className="space-y-4">
                {!isLogin && (
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <Button variant="link" className="px-0 text-sm">
                      Forgot Password?
                    </Button>
                  </div>
                )}

                <Button onClick={handleNext} className="w-full">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm"
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Investment Goals
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your primary investment goal?</h2>
              <p className="text-gray-600 mt-2">This helps us recommend the right properties for you</p>
            </div>

            <RadioGroup 
              value={formData.investmentGoal} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, investmentGoal: value }))}
              className="space-y-3"
            >
              {investmentGoals.map((goal) => {
                const IconComponent = goal.icon;
                return (
                  <div key={goal.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value={goal.id} id={goal.id} />
                    <IconComponent className="h-6 w-6 text-blue-600" />
                    <div className="flex-1">
                      <Label htmlFor={goal.id} className="cursor-pointer font-medium">
                        {goal.label}
                      </Label>
                      <p className="text-sm text-gray-500">{goal.description}</p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );

      case 2: // Investment Budget
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your investment budget?</h2>
              <p className="text-gray-600 mt-2">Set your comfortable investment range</p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {formData.currency} {formData.budget[0].toLocaleString()}
                </div>
                <p className="text-gray-500">Investment Budget</p>
              </div>

              <div className="px-4">
                <Slider
                  value={formData.budget}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                  max={10000000}
                  min={100000}
                  step={50000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>AED 100K</span>
                  <span>AED 10M+</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[500000, 1000000, 2000000, 5000000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, budget: [amount] }))}
                    className={formData.budget[0] === amount ? 'bg-blue-50 border-blue-300' : ''}
                  >
                    {(amount / 1000000).toFixed(amount >= 1000000 ? 0 : 1)}M
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Risk Appetite
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your risk appetite?</h2>
              <p className="text-gray-600 mt-2">Choose your comfort level with investment risk</p>
            </div>

            <RadioGroup 
              value={formData.riskAppetite} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, riskAppetite: value }))}
              className="space-y-3"
            >
              {riskLevels.map((risk) => (
                <div key={risk.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value={risk.id} id={risk.id} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={risk.id} className="cursor-pointer font-medium">
                        {risk.label}
                      </Label>
                      <Badge className={risk.color}>{risk.id.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{risk.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 4: // Location Preferences
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <h2 className="text-2xl font-bold">Preferred locations in Dubai?</h2>
              <p className="text-gray-600 mt-2">Select all areas you're interested in (minimum 1)</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dubaiLocations.map((location) => (
                <div
                  key={location}
                  onClick={() => handleLocationToggle(location)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.locationPreferences.includes(location)
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={formData.locationPreferences.includes(location)}
                      readOnly
                    />
                    <span className="text-sm font-medium">{location}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-gray-500">
              Selected: {formData.locationPreferences.length} location{formData.locationPreferences.length !== 1 ? 's' : ''}
            </div>
          </div>
        );

      case 5: // Property Types
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Home className="h-12 w-12 mx-auto text-orange-600 mb-4" />
              <h2 className="text-2xl font-bold">What property types interest you?</h2>
              <p className="text-gray-600 mt-2">Select all that apply (minimum 1)</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {propertyTypeOptions.map((type) => (
                <div
                  key={type.id}
                  onClick={() => handlePropertyTypeToggle(type.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors text-center ${
                    formData.propertyTypes.includes(type.id)
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                  <Checkbox 
                    checked={formData.propertyTypes.includes(type.id)}
                    className="mt-2 mx-auto"
                    readOnly
                  />
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-gray-500">
              Selected: {formData.propertyTypes.length} property type{formData.propertyTypes.length !== 1 ? 's' : ''}
            </div>
          </div>
        );

      case 6: // Investment Horizon
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your investment timeline?</h2>
              <p className="text-gray-600 mt-2">How long do you plan to hold your investment?</p>
            </div>

            <RadioGroup 
              value={formData.investmentHorizon} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, investmentHorizon: value }))}
              className="space-y-3"
            >
              {investmentHorizons.map((horizon) => (
                <div key={horizon.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value={horizon.id} id={horizon.id} />
                  <div className="flex-1">
                    <Label htmlFor={horizon.id} className="cursor-pointer font-medium">
                      {horizon.label}
                    </Label>
                    <p className="text-sm text-gray-500">{horizon.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 7: // Final Preferences
        return (
          <div className="space-y-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold">Final preferences</h2>
              <p className="text-gray-600 mt-2">Fine-tune your investment criteria</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Expected ROI Target</Label>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-bold text-green-600">{formData.roiTarget[0]}%</span>
                  <p className="text-sm text-gray-500">Annual Return on Investment</p>
                </div>
                <Slider
                  value={formData.roiTarget}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, roiTarget: value }))}
                  max={15}
                  min={3}
                  step={0.5}
                  className="mt-4"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>3%</span>
                  <span>15%</span>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Minimum Rental Yield</Label>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-bold text-blue-600">{formData.rentalYield[0]}%</span>
                  <p className="text-sm text-gray-500">Annual Rental Yield</p>
                </div>
                <Slider
                  value={formData.rentalYield}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, rentalYield: value }))}
                  max={12}
                  min={2}
                  step={0.5}
                  className="mt-4"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>2%</span>
                  <span>12%</span>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Maximum Commute Time (if applicable)</Label>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-bold text-purple-600">{formData.maxCommute[0]} min</span>
                  <p className="text-sm text-gray-500">To key business districts</p>
                </div>
                <Slider
                  value={formData.maxCommute}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, maxCommute: value }))}
                  max={60}
                  min={10}
                  step={5}
                  className="mt-4"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>10 min</span>
                  <span>60 min</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.email && formData.password && (isLogin || formData.fullName);
      case 1:
        return formData.investmentGoal;
      case 2:
        return formData.budget[0] > 0;
      case 3:
        return formData.riskAppetite;
      case 4:
        return formData.locationPreferences.length > 0;
      case 5:
        return formData.propertyTypes.length > 0;
      case 6:
        return formData.investmentHorizon;
      case 7:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          {currentStep > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Step {currentStep} of {TOTAL_STEPS - 1}</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center"
            >
              {currentStep === TOTAL_STEPS - 1 ? 'Complete Setup' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}