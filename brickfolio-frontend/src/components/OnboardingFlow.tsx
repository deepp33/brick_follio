import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { register, login, type OnboardingData } from '../features/auth/authSlice';
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
import { PageLoader } from './ui/loader';
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
  EyeOff,
  Phone,
  Globe,
  Building
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OnboardingFlowProps {
  onComplete?: (data: any) => void;
}

const TOTAL_STEPS = 12; // 1 registration + 11 onboarding steps

const residenceOptions = [
  { id: 'UAE_Resident', label: 'UAE Resident', description: 'Living in UAE' },
  { id: 'International_Investor', label: 'International Investor', description: 'Investing from abroad' },
  { id: 'GCC_Resident', label: 'GCC Resident', description: 'Living in GCC countries' }
];

const priorInvestmentOptions = [
  { id: 'Yes', label: 'Yes', description: 'I have invested in real estate before' },
  { id: 'No', label: 'No', description: 'This is my first real estate investment' }
];

const investmentGoals = [
  { id: 'rental_income', label: 'Rental Income', description: 'Focus on properties with high rental yields' },
  { id: 'capital_growth', label: 'Capital Growth', description: 'Long-term capital appreciation' },
  { id: 'personal_use', label: 'Personal Use', description: 'Buy for personal residence' },
  { id: 'diversification', label: 'Portfolio Diversification', description: 'Diversify investment portfolio' }
];

const offPlanOptions = [
  { id: 'Yes', label: 'Yes', description: 'I am interested in off-plan properties' },
  { id: 'No', label: 'No', description: 'I prefer ready properties' },
  { id: 'Both', label: 'Both', description: 'I am open to both options' }
];

const riskLevels = [
  { id: 'low', label: 'Low Risk', description: 'Stable returns with minimal volatility' },
  { id: 'moderate', label: 'Moderate Risk', description: 'Balanced approach with steady growth' },
  { id: 'high', label: 'High Risk', description: 'Higher potential returns with more volatility' }
];

const dubaiLocations = [
  'Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Business Bay', 'Jumeirah Lakes Towers (JLT)',
  'Dubai Hills Estate', 'Jumeirah Village Circle (JVC)', 'Dubai Investment Park (DIP)',
  'Al Barsha', 'Dubai Silicon Oasis', 'Dubai Sports City', 'Arabian Ranches',
  'Emirates Hills', 'Dubai Festival City', 'Mirdif', 'Jumeirah'
];

const propertyTypeOptions = [
  { id: '1-Bedroom', label: '1-Bedroom Apartments', icon: '🏢' },
  { id: '2-Bedroom', label: '2-Bedroom Apartments', icon: '🏢' },
  { id: '3-Bedroom', label: '3-Bedroom Apartments', icon: '🏢' },
  { id: 'Villas', label: 'Villas', icon: '🏘️' },
  { id: 'Penthouses', label: 'Penthouses', icon: '🏙️' },
  { id: 'Townhouses', label: 'Townhouses', icon: '🏡' },
  { id: 'Commercial', label: 'Commercial Properties', icon: '🏢' }
];

const investmentHorizons = [
  { id: 'short-term', label: 'Short-term (1-3 years)', description: 'Quick flip or short rental period' },
  { id: 'medium-term', label: 'Medium-term (3-7 years)', description: 'Moderate hold for steady returns' },
  { id: 'long-term', label: 'Long-term (7+ years)', description: 'Long-term wealth building' }
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    // Registration data
    name: '',
    email: '',
    password: '',
    phone: '',
    country: '',
    city: '',
    
    // Onboarding data
    step1_residence: '',
    step2_priorInvestment: '',
    step3_investmentGoal: '',
    step4_budget: { min: 500000, max: 2000000, currency: 'AED' },
    step5_offPlan: '',
    step6_preferredLocation: [] as string[],
    step7_propertyTypes: [] as string[],
    step8_roiTarget: 8,
    step9_rentalYieldTarget: 6,
    step10_riskAppetite: '',
    step11_investmentHorizon: ''
  });

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const handleNext = async () => {
    if (currentStep === 0) {
      // Registration/Login step
      if (isLogin) {
        // Handle login
        try {
          const result = await dispatch(login({ 
            email: formData.email, 
            password: formData.password 
          })).unwrap();
          
          if (result) {
            // Navigate to map with user preferences
            navigate('/map', { 
              state: { 
                userPreferences: {
                  investmentGoal: formData.step3_investmentGoal,
                  budget: formData.step4_budget,
                  preferredLocation: formData.step6_preferredLocation,
                  propertyTypes: formData.step7_propertyTypes,
                  roiTarget: formData.step8_roiTarget,
                  rentalYieldTarget: formData.step9_rentalYieldTarget,
                  riskAppetite: formData.step10_riskAppetite,
                  investmentHorizon: formData.step11_investmentHorizon
                }
              } 
            });
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      } else {
        // Move to next step for registration
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === TOTAL_STEPS - 1) {
      // Final step - complete registration with onboarding data
      try {
        const onboardingData: OnboardingData = {
          step1_residence: formData.step1_residence,
          step2_priorInvestment: formData.step2_priorInvestment,
          step3_investmentGoal: formData.step3_investmentGoal,
          step4_budget: formData.step4_budget,
          step5_offPlan: formData.step5_offPlan,
          step6_preferredLocation: formData.step6_preferredLocation,
          step7_propertyTypes: formData.step7_propertyTypes,
          step8_roiTarget: formData.step8_roiTarget,
          step9_rentalYieldTarget: formData.step9_rentalYieldTarget,
          step10_riskAppetite: formData.step10_riskAppetite,
          step11_investmentHorizon: formData.step11_investmentHorizon
        };

        const result = await dispatch(register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'Investor',
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          onboarding: onboardingData
        })).unwrap();

        if (result) {
          // Navigate to map with user preferences
          navigate('/map', { 
            state: { 
              userPreferences: {
                investmentGoal: formData.step3_investmentGoal,
                budget: formData.step4_budget,
                preferredLocation: formData.step6_preferredLocation,
                propertyTypes: formData.step7_propertyTypes,
                roiTarget: formData.step8_roiTarget,
                rentalYieldTarget: formData.step9_rentalYieldTarget,
                riskAppetite: formData.step10_riskAppetite,
                investmentHorizon: formData.step11_investmentHorizon
              }
            } 
          });
        }
      } catch (error) {
        console.error('Registration failed:', error);
      }
    } else {
      // Move to next step
      setCurrentStep(currentStep + 1);
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
      step6_preferredLocation: prev.step6_preferredLocation.includes(location)
        ? prev.step6_preferredLocation.filter(l => l !== location)
        : [...prev.step6_preferredLocation, location]
    }));
  };

  const handlePropertyTypeToggle = (typeId: string) => {
    setFormData(prev => ({
      ...prev,
      step7_propertyTypes: prev.step7_propertyTypes.includes(typeId)
        ? prev.step7_propertyTypes.filter(t => t !== typeId)
        : [...prev.step7_propertyTypes, typeId]
    }));
  };

  const handleSocialLogin = (provider: string) => {
    // In real implementation, this would integrate with actual OAuth
    console.log(`Logging in with ${provider}`);
    setCurrentStep(1); // Skip to questionnaire
  };

  if (loading) {
    return <PageLoader text="Processing..." icon="users" />;
  }

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

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

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
                    src="https://images.unsplash.com/photo-1611944212129-29977ae1398c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW5rZWRpbiUyMGxvZ298ZW58MXwxfHwxNzU1OTQyMTg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
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
                  <>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+97150000000"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <div className="relative mt-1">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="country"
                          type="text"
                          placeholder="Enter your country"
                          className="pl-10"
                          value={formData.country}
                          onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <div className="relative mt-1">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="city"
                          type="text"
                          placeholder="Enter your city"
                          className="pl-10"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                    </div>
                  </>
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

                <Button onClick={handleNext} className="w-full" disabled={loading}>
                  {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
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

      case 1: // Residence Status
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">What is your residence status?</h2>
              <p className="text-gray-600 mt-2">This helps us provide relevant investment opportunities</p>
            </div>

            <RadioGroup 
              value={formData.step1_residence} 
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, step1_residence: value }))}
              className="space-y-3"
            >
              {residenceOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="text-base font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 2: // Prior Investment Experience
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">Do you have prior real estate investment experience?</h2>
              <p className="text-gray-600 mt-2">This helps us tailor our recommendations</p>
            </div>

            <RadioGroup 
              value={formData.step2_priorInvestment} 
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, step2_priorInvestment: value }))}
              className="space-y-3"
            >
              {priorInvestmentOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="text-base font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 3: // Investment Goal
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your primary investment goal?</h2>
              <p className="text-gray-600 mt-2">This helps us recommend the right properties for you</p>
            </div>

            <RadioGroup 
              value={formData.step3_investmentGoal} 
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, step3_investmentGoal: value }))}
              className="space-y-3"
            >
              {investmentGoals.map((goal) => (
                <div key={goal.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={goal.id} id={goal.id} />
                  <div className="flex-1">
                    <Label htmlFor={goal.id} className="text-base font-medium cursor-pointer">
                      {goal.label}
                    </Label>
                    <p className="text-sm text-gray-500">{goal.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 4: // Budget Range
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your investment budget range?</h2>
              <p className="text-gray-600 mt-2">Select your preferred budget range in AED</p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  AED {formData.step4_budget.min.toLocaleString()} - {formData.step4_budget.max.toLocaleString()}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Minimum Budget: AED {formData.step4_budget.min.toLocaleString()}</Label>
                  <Slider
                    value={[formData.step4_budget.min]}
                    onValueChange={(value: number[]) => setFormData(prev => ({
                      ...prev,
                      step4_budget: { ...prev.step4_budget, min: value[0] }
                    }))}
                    max={5000000}
                    min={100000}
                    step={50000}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Maximum Budget: AED {formData.step4_budget.max.toLocaleString()}</Label>
                  <Slider
                    value={[formData.step4_budget.max]}
                    onValueChange={(value: number[]) => setFormData(prev => ({
                      ...prev,
                      step4_budget: { ...prev.step4_budget, max: value[0] }
                    }))}
                    max={10000000}
                    min={formData.step4_budget.min}
                    step={50000}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Off-Plan Interest
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">Are you interested in off-plan properties?</h2>
              <p className="text-gray-600 mt-2">Off-plan properties can offer better prices and payment plans</p>
            </div>

            <RadioGroup 
              value={formData.step5_offPlan} 
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, step5_offPlan: value }))}
              className="space-y-3"
            >
              {offPlanOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="text-base font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 6: // Preferred Locations
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">Which areas in Dubai interest you?</h2>
              <p className="text-gray-600 mt-2">Select all that apply (you can choose multiple locations)</p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {dubaiLocations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={location}
                    checked={formData.step6_preferredLocation.includes(location)}
                    onCheckedChange={() => handleLocationToggle(location)}
                  />
                  <Label htmlFor={location} className="text-sm cursor-pointer">
                    {location}
                  </Label>
                </div>
              ))}
            </div>

            {formData.step6_preferredLocation.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium">Selected Locations:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.step6_preferredLocation.map((location) => (
                    <Badge key={location} variant="secondary">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 7: // Property Types
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Home className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">What types of properties interest you?</h2>
              <p className="text-gray-600 mt-2">Select all that apply</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {propertyTypeOptions.map((type) => (
                <div key={type.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={type.id}
                    checked={formData.step7_propertyTypes.includes(type.id)}
                    onCheckedChange={() => handlePropertyTypeToggle(type.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={type.id} className="text-sm font-medium cursor-pointer">
                      <span className="mr-2">{type.icon}</span>
                      {type.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>

            {formData.step7_propertyTypes.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium">Selected Property Types:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.step7_propertyTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {propertyTypeOptions.find(t => t.id === type)?.label || type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 8: // ROI Target
        return (
          <div className="space-y-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your target ROI (Return on Investment)?</h2>
              <p className="text-gray-600 mt-2">Select your preferred annual ROI percentage</p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formData.step8_roiTarget}%
                </div>
                <p className="text-sm text-gray-500 mt-1">Annual Return on Investment</p>
              </div>

              <Slider
                value={[formData.step8_roiTarget]}
                onValueChange={(value: number[]) => setFormData(prev => ({ ...prev, step8_roiTarget: value[0] }))}
                max={20}
                min={3}
                step={1}
                className="mt-4"
              />

              <div className="flex justify-between text-sm text-gray-500">
                <span>3% (Conservative)</span>
                <span>20% (Aggressive)</span>
              </div>
            </div>
          </div>
        );

      case 9: // Rental Yield Target
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your target rental yield?</h2>
              <p className="text-gray-600 mt-2">Select your preferred annual rental yield percentage</p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formData.step9_rentalYieldTarget}%
                </div>
                <p className="text-sm text-gray-500 mt-1">Annual Rental Yield</p>
              </div>

              <Slider
                value={[formData.step9_rentalYieldTarget]}
                onValueChange={(value: number[]) => setFormData(prev => ({ ...prev, step9_rentalYieldTarget: value[0] }))}
                max={12}
                min={2}
                step={0.5}
                className="mt-4"
              />

              <div className="flex justify-between text-sm text-gray-500">
                <span>2% (Low Yield)</span>
                <span>12% (High Yield)</span>
              </div>
            </div>
          </div>
        );

      case 10: // Risk Appetite
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your risk appetite?</h2>
              <p className="text-gray-600 mt-2">This helps us recommend suitable investment strategies</p>
            </div>

            <RadioGroup 
              value={formData.step10_riskAppetite} 
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, step10_riskAppetite: value }))}
              className="space-y-3"
            >
              {riskLevels.map((level) => (
                <div key={level.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={level.id} id={level.id} />
                  <div className="flex-1">
                    <Label htmlFor={level.id} className="text-base font-medium cursor-pointer">
                      {level.label}
                    </Label>
                    <p className="text-sm text-gray-500">{level.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 11: // Investment Horizon
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your investment horizon?</h2>
              <p className="text-gray-600 mt-2">How long do you plan to hold your investment?</p>
            </div>

            <RadioGroup 
              value={formData.step11_investmentHorizon} 
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, step11_investmentHorizon: value }))}
              className="space-y-3"
            >
              {investmentHorizons.map((horizon) => (
                <div key={horizon.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={horizon.id} id={horizon.id} />
                  <div className="flex-1">
                    <Label htmlFor={horizon.id} className="text-base font-medium cursor-pointer">
                      {horizon.label}
                    </Label>
                    <p className="text-sm text-gray-500">{horizon.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">DubaiInvest Pro</CardTitle>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-500 mt-2">
              Step {currentStep + 1} of {TOTAL_STEPS}
            </p>
          </div>
        </CardHeader>
        <CardContent>
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
            
            {currentStep > 0 && (
              <Button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center"
              >
                {currentStep === TOTAL_STEPS - 1 ? 'Complete Setup' : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}