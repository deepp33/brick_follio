import { useState, useEffect } from 'react';
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
  X,
  Target,
  DollarSign,
  TrendingUp,
  MapPin,
  Home,
  Clock,
  Shield,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface QuestionnaireData {
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

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: QuestionnaireData) => void;
}

const TOTAL_STEPS = 6; // Changed from 8 to 6 (removed registration step)

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

export function QuestionnaireModal({ isOpen, onClose, onComplete }: QuestionnaireModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuestionnaireData>({
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

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.investmentGoal;
      case 1:
        return formData.budget[0] > 0;
      case 2:
        return formData.riskAppetite;
      case 3:
        return formData.locationPreferences.length > 0;
      case 4:
        return formData.propertyTypes.length > 0;
      case 5:
        return formData.investmentHorizon;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Investment Goals
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your primary investment goal?</h2>
              <p className="text-gray-600 mt-2">This helps us recommend the right properties for you</p>
            </div>

            <RadioGroup 
              value={formData.investmentGoal} 
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, investmentGoal: value }))}
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

      case 1: // Investment Budget
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
                  onValueChange={(value: number[]) => setFormData(prev => ({ ...prev, budget: value }))}
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

      case 2: // Risk Appetite
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your risk appetite?</h2>
              <p className="text-gray-600 mt-2">Choose your comfort level with investment risk</p>
            </div>

            <RadioGroup 
              value={formData.riskAppetite} 
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, riskAppetite: value }))}
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

      case 3: // Location Preferences
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

      case 4: // Property Types
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

      case 5: // Investment Horizon
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold">What's your investment timeline?</h2>
              <p className="text-gray-600 mt-2">How long do you plan to hold your investment?</p>
            </div>

            <RadioGroup 
              value={formData.investmentHorizon} 
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, investmentHorizon: value }))}
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

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex-1">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Step {currentStep + 1} of {TOTAL_STEPS}</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-120px)]">
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
