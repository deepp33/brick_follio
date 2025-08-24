import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { 
  X, 
  Filter,
  Search,
  Home,
  Building2,
  MapPin,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Percent,
  Shield,
  Phone,
  Mail,
  Heart,
  Share2,
  Eye,
  Layers,
  Navigation,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Menu,
  Settings,
  Info,
  Clock,
  Users,
  Car,
  Wifi,
  School,
  Hospital,
  ShoppingBag,
  Train,
  Plane,
  TreePine,
  Award,
  Activity,
  AlertTriangle,
  CheckCircle,
  Construction
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

/**
 * Investment vs Lifestyle Toggle Implementation
 * 
 * This component provides two distinct viewing modes for the Dubai property map:
 * 
 * INVESTOR VIEW:
 * - Metrics: ROI, Rental Yield, Price Growth YoY, Risk Level, Developer Rating, Units Left
 * - Map Layers: ROI Heatmap, Rental Index, Price Heatmap, Risk Zones, Growth Heatmap, Demand Zones
 * - Filters: ROI Range, Rental Yield Range, Developer Rating, Units Left, Project Status
 * - Focus: Investment performance, returns, and market analysis
 * 
 * LIFESTYLE VIEW:
 * - Metrics: Metro Distance, School Distance, Hospital Distance, Walkability Score, Mall Distance, Beach Distance
 * - Map Layers: Walkability Score, Amenities Density, Lifestyle Zones, Infrastructure
 * - Filters: Walkability Score, Metro Distance, School Distance, Amenities Count
 * - Focus: Quality of life, convenience, and community features
 * 
 * The toggle switches between these views, updating the map overlays, filters, and property detail panels accordingly.
 */

// Enhanced property data for Dubai locations with comprehensive metrics
const dubaiProperties = [
  {
    id: 1,
    name: "Burj Vista Downtown",
    coordinates: [55.2744, 25.1972],
    location: "Downtown Dubai",
    type: "Apartment",
    unitTypes: ["1BR", "2BR", "3BR"],
    priceRange: "AED 2.1M - 4.8M",
    priceMin: 2100000,
    priceMax: 4800000,
    unitsLeft: 23,
    roi: 8.7,
    rentalYield: 7.4,
    priceGrowthYoY: 12.8,
    constructionStatus: 85,
    completionDate: "Q2 2025",
    developerRating: 4.9,
    developer: "Emaar Properties",
    projectStatus: "Under Construction",
    riskLevel: "Low",
    metroDistance: 0.3,
    schoolDistance: 0.8,
    hospitalDistance: 1.2,
    mallDistance: 0.2,
    beachDistance: 8.5,
    walkabilityScore: 95,
    communityFeatures: ["Gym", "Pool", "Concierge", "Parking", "Security"],
    nearbyAmenities: ["Dubai Mall", "Burj Khalifa", "Metro Station", "Business District"],
    governmentImpact: "Metro expansion 2027 - value boost expected",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1512453979798-5ff17c3515e1?w=800",
    paymentPlan: "20% Down, 80% on Completion",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 1850,
    infraImpact: {
      metro: { status: "expansion", completion: "2027", impact: "High" },
      schools: { count: 3, avgDistance: 0.8 },
      hospitals: { count: 2, avgDistance: 1.2 }
    },
    recommended: true,
    recommendationReason: "High ROI, Prime location, Low risk"
  },
  {
    id: 1,
    name: "Burj Vista Downtown",
    coordinates: [55.2744, 25.1972],
    location: "Downtown Dubai",
    type: "Apartment",
    unitTypes: ["1BR", "2BR", "3BR"],
    priceRange: "AED 2.1M - 4.8M",
    priceMin: 2100000,
    priceMax: 4800000,
    unitsLeft: 23,
    roi: 8.7,
    rentalYield: 7.4,
    priceGrowthYoY: 12.8,
    constructionStatus: 85,
    completionDate: "Q2 2025",
    developerRating: 4.9,
    developer: "Emaar Properties",
    projectStatus: "Under Construction",
    riskLevel: "Low",
    metroDistance: 0.3,
    schoolDistance: 0.8,
    hospitalDistance: 1.2,
    mallDistance: 0.2,
    beachDistance: 8.5,
    walkabilityScore: 95,
    communityFeatures: ["Gym", "Pool", "Concierge", "Parking", "Security"],
    nearbyAmenities: ["Dubai Mall", "Burj Khalifa", "Metro Station", "Business District"],
    governmentImpact: "Metro expansion 2027 - value boost expected",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    paymentPlan: "20% Down, 80% on Completion",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 1850,
    infraImpact: {
      metro: { status: "expansion", completion: "2027", impact: "High" },
      schools: { count: 3, avgDistance: 0.8 },
      hospitals: { count: 2, avgDistance: 1.2 }
    }
  },
  {
    id: 2,
    name: "Marina Pearl Residence",
    coordinates: [55.1403, 25.0657],
    location: "Dubai Marina",
    type: "Apartment",
    unitTypes: ["1BR", "2BR"],
    priceRange: "AED 1.8M - 3.2M",
    priceMin: 1800000,
    priceMax: 3200000,
    unitsLeft: 67,
    roi: 9.4,
    rentalYield: 8.2,
    priceGrowthYoY: 8.9,
    constructionStatus: 65,
    completionDate: "Q4 2025",
    developerRating: 4.7,
    developer: "DAMAC Properties",
    projectStatus: "Under Construction",
    riskLevel: "Medium",
    metroDistance: 1.2,
    schoolDistance: 2.1,
    hospitalDistance: 1.8,
    mallDistance: 0.5,
    beachDistance: 0.3,
    walkabilityScore: 88,
    communityFeatures: ["Beach Access", "Marina Walk", "Restaurants", "Parking"],
    nearbyAmenities: ["Marina Mall", "JBR Beach", "Marina Walk", "Restaurants"],
    governmentImpact: "Beach infrastructure upgrade 2026",
    images: ["https://images.unsplash.com/photo-1696743297474-d674b8e3d82a?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1518715214357-e04c7c7b4e98?w=800",
    paymentPlan: "25% During Construction, 75% on Completion",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 1650,
    infraImpact: {
      metro: { status: "existing", completion: "completed", impact: "Medium" },
      schools: { count: 4, avgDistance: 2.1 },
      hospitals: { count: 3, avgDistance: 1.8 }
    }
  },
  {
    id: 3,
    name: "Palm Jumeirah Villa",
    coordinates: [55.1390, 25.1124],
    location: "Palm Jumeirah",
    type: "Villa",
    unitTypes: ["4BR", "5BR", "6BR"],
    priceRange: "AED 8.5M - 15.2M",
    priceMin: 8500000,
    priceMax: 15200000,
    unitsLeft: 8,
    roi: 6.2,
    rentalYield: 5.1,
    priceGrowthYoY: 18.5,
    constructionStatus: 100,
    completionDate: "Ready",
    developerRating: 4.6,
    developer: "Nakheel",
    projectStatus: "Ready to Move",
    riskLevel: "Low",
    metroDistance: 8.5,
    schoolDistance: 3.2,
    hospitalDistance: 6.8,
    mallDistance: 5.1,
    beachDistance: 0.1,
    walkabilityScore: 72,
    communityFeatures: ["Private Beach", "Golf Course", "Spa", "Marina"],
    nearbyAmenities: ["Atlantis Resort", "Private Beach", "Golf Course", "Restaurants"],
    governmentImpact: "Tourism infrastructure expansion ongoing",
    images: ["https://images.unsplash.com/photo-1726003354242-4ff17c3515e1?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    paymentPlan: "Cash or Mortgage Available",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 2100,
    infraImpact: {
      metro: { status: "planned", completion: "2030", impact: "High" },
      schools: { count: 2, avgDistance: 3.2 },
      hospitals: { count: 1, avgDistance: 6.8 }
    }
  },
  {
    id: 4,
    name: "Business Bay Elite",
    coordinates: [55.2608, 25.1869],
    location: "Business Bay",
    type: "Apartment",
    unitTypes: ["2BR", "3BR", "Penthouse"],
    priceRange: "AED 2.8M - 6.5M",
    priceMin: 2800000,
    priceMax: 6500000,
    unitsLeft: 42,
    roi: 7.8,
    rentalYield: 6.9,
    priceGrowthYoY: 11.2,
    constructionStatus: 95,
    completionDate: "Q1 2025",
    developerRating: 4.8,
    developer: "Sobha Realty",
    projectStatus: "Near Completion",
    riskLevel: "Low",
    metroDistance: 0.6,
    schoolDistance: 1.5,
    hospitalDistance: 2.1,
    mallDistance: 1.8,
    beachDistance: 6.2,
    walkabilityScore: 90,
    communityFeatures: ["Sky Lounge", "Business Center", "Canal Views", "Parking"],
    nearbyAmenities: ["Dubai Canal", "DIFC", "Business District", "Metro"],
    governmentImpact: "Financial district expansion 2025-2027",
    images: ["https://images.unsplash.com/photo-1609764465693-a2dc6c6f7dbd?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    paymentPlan: "30% During Construction, 70% on Completion",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 1750,
    infraImpact: {
      metro: { status: "existing", completion: "completed", impact: "High" },
      schools: { count: 5, avgDistance: 1.5 },
      hospitals: { count: 4, avgDistance: 2.1 }
    }
  },
  {
    id: 5,
    name: "Al Barari Green Villas",
    coordinates: [55.2285, 25.0535],
    location: "Al Barari",
    type: "Villa",
    unitTypes: ["3BR", "4BR", "5BR"],
    priceRange: "AED 6.2M - 12.8M",
    priceMin: 6200000,
    priceMax: 12800000,
    unitsLeft: 15,
    roi: 5.8,
    rentalYield: 4.9,
    priceGrowthYoY: 16.3,
    constructionStatus: 100,
    completionDate: "Ready",
    developerRating: 4.5,
    developer: "Al Barari Developers",
    projectStatus: "Ready to Move",
    riskLevel: "Low",
    metroDistance: 5.2,
    schoolDistance: 2.8,
    hospitalDistance: 3.5,
    mallDistance: 4.1,
    beachDistance: 12.8,
    walkabilityScore: 78,
    communityFeatures: ["Botanical Gardens", "Golf Course", "Spa", "Organic Farm"],
    nearbyAmenities: ["Golf Course", "International Schools", "Hospitals", "Nature Reserves"],
    governmentImpact: "Green transportation initiative 2026",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    paymentPlan: "Cash or Mortgage Available",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 2000,
    infraImpact: {
      metro: { status: "planned", completion: "2028", impact: "Medium" },
      schools: { count: 3, avgDistance: 2.8 },
      hospitals: { count: 2, avgDistance: 3.5 }
    }
  },
  {
    id: 6,
    name: "JVC Modern Living",
    coordinates: [55.2115, 25.0566],
    location: "Jumeirah Village Circle",
    type: "Apartment",
    unitTypes: ["Studio", "1BR", "2BR"],
    priceRange: "AED 580K - 1.2M",
    priceMin: 580000,
    priceMax: 1200000,
    unitsLeft: 156,
    roi: 11.8,
    rentalYield: 9.2,
    priceGrowthYoY: 7.4,
    constructionStatus: 100,
    completionDate: "Ready",
    developerRating: 4.2,
    developer: "Multiple Developers",
    projectStatus: "Ready to Move",
    riskLevel: "Medium",
    metroDistance: 3.8,
    schoolDistance: 1.2,
    hospitalDistance: 2.5,
    mallDistance: 2.1,
    beachDistance: 8.5,
    walkabilityScore: 82,
    communityFeatures: ["Community Pool", "Gym", "Parks", "Retail"],
    nearbyAmenities: ["Circle Mall", "Community Parks", "Schools", "Clinics"],
    governmentImpact: "Community infrastructure upgrade 2025",
    images: ["https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800"],
    floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
    aerialView: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    paymentPlan: "Flexible Payment Options",
    fees: "4% DLD + 2% Agent",
    pricePerSqft: 950,
    infraImpact: {
      metro: { status: "planned", completion: "2026", impact: "High" },
      schools: { count: 6, avgDistance: 1.2 },
      hospitals: { count: 3, avgDistance: 2.5 }
    }
   },
   {
     id: 7,
     name: "Dubai Hills Estate",
     coordinates: [55.2450, 25.1680],
     location: "Dubai Hills Estate",
     type: "Villa",
     unitTypes: ["3BR", "4BR", "5BR", "6BR"],
     priceRange: "AED 4.2M - 8.5M",
     priceMin: 4200000,
     priceMax: 8500000,
     unitsLeft: 34,
     roi: 7.2,
     rentalYield: 6.1,
     priceGrowthYoY: 14.2,
     constructionStatus: 100,
     completionDate: "Ready",
     developerRating: 4.8,
     developer: "Emaar Properties",
     projectStatus: "Ready to Move",
     riskLevel: "Low",
     metroDistance: 2.1,
     schoolDistance: 0.8,
     hospitalDistance: 1.5,
     mallDistance: 0.3,
     beachDistance: 6.8,
     walkabilityScore: 85,
     communityFeatures: ["Golf Course", "Parks", "Schools", "Shopping Center"],
     nearbyAmenities: ["Dubai Hills Mall", "Golf Course", "International Schools", "Hospitals"],
     governmentImpact: "Dubai Hills Mall expansion 2025",
     images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
     floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
     aerialView: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
     paymentPlan: "Cash or Mortgage Available",
     fees: "4% DLD + 2% Agent",
     pricePerSqft: 1800,
     infraImpact: {
       metro: { status: "planned", completion: "2027", impact: "High" },
       schools: { count: 4, avgDistance: 0.8 },
       hospitals: { count: 2, avgDistance: 1.5 }
     },
     recommended: true,
     recommendationReason: "Premium location, Golf course views, Excellent amenities"
   },
   {
     id: 8,
     name: "Bluewaters Island Residences",
     coordinates: [55.1350, 25.0780],
     location: "Bluewaters Island",
     type: "Apartment",
     unitTypes: ["1BR", "2BR", "3BR", "Penthouse"],
     priceRange: "AED 3.5M - 12.8M",
     priceMin: 3500000,
     priceMax: 12800000,
     unitsLeft: 28,
     roi: 6.8,
     rentalYield: 5.9,
     priceGrowthYoY: 16.8,
     constructionStatus: 100,
     completionDate: "Ready",
     developerRating: 4.7,
     developer: "Meraas",
     projectStatus: "Ready to Move",
     riskLevel: "Low",
     metroDistance: 1.8,
     schoolDistance: 2.5,
     hospitalDistance: 2.8,
     mallDistance: 0.1,
     beachDistance: 0.2,
     walkabilityScore: 92,
     communityFeatures: ["Ain Dubai Views", "Beach Access", "Restaurants", "Retail"],
     nearbyAmenities: ["Ain Dubai", "Beach", "Restaurants", "Shopping"],
     governmentImpact: "Tourism hub expansion ongoing",
     images: ["https://images.unsplash.com/photo-1696743297474-d674b8e3d82a?w=800"],
     floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
     aerialView: "https://images.unsplash.com/photo-1518715214357-e04c7c7b4e98?w=800",
     paymentPlan: "Cash or Mortgage Available",
     fees: "4% DLD + 2% Agent",
     pricePerSqft: 2200,
     infraImpact: {
       metro: { status: "existing", completion: "completed", impact: "Medium" },
       schools: { count: 3, avgDistance: 2.5 },
       hospitals: { count: 2, avgDistance: 2.8 }
     }
   },
   {
     id: 9,
     name: "Meydan Heights",
     coordinates: [55.2850, 25.2150],
     location: "Meydan",
     type: "Apartment",
     unitTypes: ["2BR", "3BR", "4BR"],
     priceRange: "AED 1.8M - 4.2M",
     priceMin: 1800000,
     priceMax: 4200000,
     unitsLeft: 89,
     roi: 9.1,
     rentalYield: 7.8,
     priceGrowthYoY: 11.5,
     constructionStatus: 75,
     completionDate: "Q3 2025",
     developerRating: 4.4,
     developer: "Meydan Group",
     projectStatus: "Under Construction",
     riskLevel: "Medium",
     metroDistance: 1.5,
     schoolDistance: 1.8,
     hospitalDistance: 2.2,
     mallDistance: 1.2,
     beachDistance: 7.5,
     walkabilityScore: 78,
     communityFeatures: ["Racing Views", "Parks", "Gym", "Pool"],
     nearbyAmenities: ["Meydan Racecourse", "Meydan Mall", "Schools", "Hospitals"],
     governmentImpact: "Meydan expansion project 2026",
     images: ["https://images.unsplash.com/photo-1609764465693-a2dc6c6f7dbd?w=800"],
     floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
     aerialView: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
     paymentPlan: "25% During Construction, 75% on Completion",
     fees: "4% DLD + 2% Agent",
     pricePerSqft: 1400,
     infraImpact: {
       metro: { status: "planned", completion: "2028", impact: "Medium" },
       schools: { count: 3, avgDistance: 1.8 },
       hospitals: { count: 2, avgDistance: 2.2 }
     }
   },
   {
     id: 10,
     name: "Silicon Oasis Tech Hub",
     coordinates: [55.3850, 25.1250],
     location: "Dubai Silicon Oasis",
     type: "Apartment",
     unitTypes: ["Studio", "1BR", "2BR", "3BR"],
     priceRange: "AED 650K - 2.1M",
     priceMin: 650000,
     priceMax: 2100000,
     unitsLeft: 234,
     roi: 12.5,
     rentalYield: 10.2,
     priceGrowthYoY: 8.9,
     constructionStatus: 100,
     completionDate: "Ready",
     developerRating: 4.1,
     developer: "DSO Development",
     projectStatus: "Ready to Move",
     riskLevel: "Medium",
     metroDistance: 4.2,
     schoolDistance: 1.5,
     hospitalDistance: 2.8,
     mallDistance: 1.8,
     beachDistance: 12.5,
     walkabilityScore: 75,
     communityFeatures: ["Tech Hub", "Co-working Spaces", "Gym", "Retail"],
     nearbyAmenities: ["Tech Companies", "Universities", "Shopping Centers", "Restaurants"],
     governmentImpact: "Tech hub expansion 2025-2027",
     images: ["https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800"],
     floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
     aerialView: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
     paymentPlan: "Flexible Payment Options",
     fees: "4% DLD + 2% Agent",
     pricePerSqft: 850,
     infraImpact: {
       metro: { status: "planned", completion: "2029", impact: "High" },
       schools: { count: 5, avgDistance: 1.5 },
       hospitals: { count: 3, avgDistance: 2.8 }
     }
   },
   {
     id: 11,
     name: "Dubai Creek Harbour",
     coordinates: [55.3200, 25.1950],
     location: "Dubai Creek Harbour",
     type: "Apartment",
     unitTypes: ["1BR", "2BR", "3BR", "Penthouse"],
     priceRange: "AED 2.8M - 8.5M",
     priceMin: 2800000,
     priceMax: 8500000,
     unitsLeft: 67,
     roi: 8.2,
     rentalYield: 7.1,
     priceGrowthYoY: 13.5,
     constructionStatus: 60,
     completionDate: "Q4 2025",
     developerRating: 4.9,
     developer: "Emaar Properties",
     projectStatus: "Under Construction",
     riskLevel: "Low",
     metroDistance: 2.8,
     schoolDistance: 2.1,
     hospitalDistance: 3.2,
     mallDistance: 0.5,
     beachDistance: 5.8,
     walkabilityScore: 88,
     communityFeatures: ["Creek Views", "Marina", "Parks", "Shopping"],
     nearbyAmenities: ["Dubai Creek Tower", "Marina", "Shopping Centers", "Restaurants"],
     governmentImpact: "Dubai Creek Tower completion 2026",
     images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
     floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
     aerialView: "https://images.unsplash.com/photo-1512453979798-5ff17c3515e1?w=800",
     paymentPlan: "20% Down, 80% on Completion",
     fees: "4% DLD + 2% Agent",
     pricePerSqft: 1900,
     infraImpact: {
       metro: { status: "planned", completion: "2027", impact: "High" },
       schools: { count: 4, avgDistance: 2.1 },
       hospitals: { count: 3, avgDistance: 3.2 }
     },
     recommended: true,
     recommendationReason: "Future tallest building location, Prime creek views, High growth potential"
   },
   {
     id: 12,
     name: "Al Furjan Gardens",
     coordinates: [55.1650, 25.0950],
     location: "Al Furjan",
     type: "Townhouse",
     unitTypes: ["3BR", "4BR", "5BR"],
     priceRange: "AED 1.2M - 2.8M",
     priceMin: 1200000,
     priceMax: 2800000,
     unitsLeft: 45,
     roi: 10.8,
     rentalYield: 8.9,
     priceGrowthYoY: 9.2,
     constructionStatus: 100,
     completionDate: "Ready",
     developerRating: 4.3,
     developer: "Nakheel",
     projectStatus: "Ready to Move",
     riskLevel: "Medium",
     metroDistance: 1.8,
     schoolDistance: 1.2,
     hospitalDistance: 2.5,
     mallDistance: 1.5,
     beachDistance: 4.2,
     walkabilityScore: 80,
     communityFeatures: ["Gardens", "Parks", "Community Center", "Retail"],
     nearbyAmenities: ["Ibn Battuta Mall", "Beach", "Schools", "Hospitals"],
     governmentImpact: "Community infrastructure upgrade 2025",
     images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
     floorPlans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"],
     aerialView: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
     paymentPlan: "Cash or Mortgage Available",
     fees: "4% DLD + 2% Agent",
     pricePerSqft: 1100,
     infraImpact: {
       metro: { status: "existing", completion: "completed", impact: "Medium" },
       schools: { count: 4, avgDistance: 1.2 },
       hospitals: { count: 2, avgDistance: 2.5 }
     }
  }
];

// Infrastructure data for Dubai
const infrastructureData = [
  { type: 'metro', coordinates: [55.2744, 25.1972], name: 'Downtown Metro', status: 'operational' },
  { type: 'metro', coordinates: [55.1403, 25.0657], name: 'Marina Metro', status: 'operational' },
  { type: 'metro', coordinates: [55.2608, 25.1869], name: 'Business Bay Metro', status: 'operational' },
  { type: 'metro', coordinates: [55.2115, 25.0566], name: 'JVC Metro', status: 'planned-2026' },
   { type: 'metro', coordinates: [55.2450, 25.1680], name: 'Dubai Hills Metro', status: 'planned-2027' },
   { type: 'metro', coordinates: [55.1350, 25.0780], name: 'Bluewaters Metro', status: 'operational' },
   { type: 'metro', coordinates: [55.2850, 25.2150], name: 'Meydan Metro', status: 'planned-2028' },
   { type: 'metro', coordinates: [55.3850, 25.1250], name: 'Silicon Oasis Metro', status: 'planned-2029' },
   { type: 'metro', coordinates: [55.3200, 25.1950], name: 'Creek Harbour Metro', status: 'planned-2027' },
   { type: 'metro', coordinates: [55.1650, 25.0950], name: 'Al Furjan Metro', status: 'operational' },
  { type: 'school', coordinates: [55.2650, 25.1890], name: 'Dubai International School', rating: 4.8 },
  { type: 'school', coordinates: [55.1450, 25.0680], name: 'Marina International School', rating: 4.6 },
   { type: 'school', coordinates: [55.2450, 25.1680], name: 'Dubai Hills School', rating: 4.9 },
   { type: 'school', coordinates: [55.3850, 25.1250], name: 'Silicon Oasis University', rating: 4.7 },
   { type: 'school', coordinates: [55.3200, 25.1950], name: 'Creek Harbour Academy', rating: 4.8 },
  { type: 'hospital', coordinates: [55.2720, 25.1950], name: 'Dubai Hospital', rating: 4.7 },
  { type: 'hospital', coordinates: [55.1380, 25.0640], name: 'Marina Medical Center', rating: 4.5 },
   { type: 'hospital', coordinates: [55.2450, 25.1680], name: 'Dubai Hills Medical Center', rating: 4.6 },
   { type: 'hospital', coordinates: [55.3850, 25.1250], name: 'Silicon Oasis Hospital', rating: 4.4 },
   { type: 'hospital', coordinates: [55.3200, 25.1950], name: 'Creek Harbour Medical', rating: 4.8 },
  { type: 'mall', coordinates: [55.2796, 25.1972], name: 'Dubai Mall', size: 'mega' },
   { type: 'mall', coordinates: [55.1420, 25.0670], name: 'Marina Mall', size: 'large' },
   { type: 'mall', coordinates: [55.2450, 25.1680], name: 'Dubai Hills Mall', size: 'large' },
   { type: 'mall', coordinates: [55.1350, 25.0780], name: 'Bluewaters Mall', size: 'medium' },
   { type: 'mall', coordinates: [55.2850, 25.2150], name: 'Meydan Mall', size: 'medium' },
   { type: 'mall', coordinates: [55.3850, 25.1250], name: 'Silicon Oasis Mall', size: 'large' },
   { type: 'mall', coordinates: [55.3200, 25.1950], name: 'Creek Harbour Mall', size: 'mega' },
   { type: 'mall', coordinates: [55.1650, 25.0950], name: 'Ibn Battuta Mall', size: 'mega' }
 ];

 // Metro line data for Dubai
 const metroLines = [
   {
     name: 'Red Line',
     color: '#22C55E', // Green color
     coordinates: [
       [55.2744, 25.1972], // Downtown Dubai
       [55.2608, 25.1869], // Business Bay
       [55.2450, 25.1680], // Dubai Hills Estate
       [55.2285, 25.0535], // Al Barari
       [55.2115, 25.0566], // JVC
       [55.1403, 25.0657], // Dubai Marina
       [55.1390, 25.1124]  // Palm Jumeirah
     ],
     status: 'operational'
   },
   {
     name: 'Green Line',
     color: '#22C55E', // Green color
     coordinates: [
       [55.2744, 25.1972], // Downtown Dubai
       [55.2650, 25.1890], // Dubai International School
       [55.2720, 25.1950], // Dubai Hospital
       [55.2796, 25.1972], // Dubai Mall
       [55.1450, 25.0680], // Marina International School
       [55.1380, 25.0640], // Marina Medical Center
       [55.1420, 25.0670], // Marina Mall
       [55.1350, 25.0780]  // Bluewaters Island
     ],
     status: 'operational'
   },
   {
     name: 'Blue Line (Planned)',
     color: '#22C55E', // Green color
     coordinates: [
       [55.2115, 25.0566], // JVC
       [55.2285, 25.0535], // Al Barari
       [55.2450, 25.1680], // Dubai Hills Estate
       [55.2608, 25.1869], // Business Bay
       [55.2744, 25.1972]  // Downtown Dubai
     ],
     status: 'planned-2026'
   },
   {
     name: 'Purple Line (Planned)',
     color: '#22C55E', // Green color
     coordinates: [
       [55.3200, 25.1950], // Dubai Creek Harbour
       [55.2850, 25.2150], // Meydan
       [55.2744, 25.1972], // Downtown Dubai
       [55.2450, 25.1680], // Dubai Hills Estate
       [55.1650, 25.0950]  // Al Furjan
     ],
     status: 'planned-2027'
   },
   {
     name: 'Orange Line (Planned)',
     color: '#22C55E', // Green color
     coordinates: [
       [55.3850, 25.1250], // Silicon Oasis
       [55.3200, 25.1950], // Dubai Creek Harbour
       [55.2850, 25.2150], // Meydan
       [55.2744, 25.1972]  // Downtown Dubai
     ],
     status: 'planned-2029'
   }
];

interface MapViewProps {
  userPreferences: any;
  onClose: () => void;
}

interface PropertyFilters {
  propertyTypes: string[];
  priceRange: [number, number];
  roiRange: [number, number];
  rentalYieldRange: [number, number];
  locations: string[];
  developerRating: number;
  projectStatus: string[];
  unitsLeft: [number, number];
}

interface MapLayer {
  id: string;
  name: string;
  description: string;
  active: boolean;
  color: string;
  type: 'heatmap' | 'overlay' | 'infrastructure';
}

export function MapView({ userPreferences, onClose }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const infrastructureMarkers = useRef<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'investor' | 'lifestyle'>('investor');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [clusteringEnabled, setClusteringEnabled] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState<any[]>([]);
  
  // Filter states - different defaults for investor vs lifestyle
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyTypes: ['Apartment', 'Villa'],
    priceRange: [500000, 20000000],
    roiRange: [5, 15],
    rentalYieldRange: [4, 12],
    locations: [],
    developerRating: 4,
    projectStatus: ['Ready to Move', 'Under Construction', 'Near Completion'],
    unitsLeft: [1, 200]
  });

  // Map layers for investor and lifestyle views
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: 'roi', name: 'ROI Heatmap', description: 'Return on Investment zones', active: true, color: '#10B981', type: 'heatmap' },
    { id: 'rental', name: 'Rental Index', description: 'Rental yield performance', active: false, color: '#3B82F6', type: 'heatmap' },
    { id: 'price', name: 'Price Heatmap', description: 'Price per square foot', active: false, color: '#F59E0B', type: 'heatmap' },
    { id: 'risk', name: 'Risk Zones', description: 'Investment risk assessment', active: false, color: '#EF4444', type: 'overlay' },
    { id: 'infrastructure', name: 'Infrastructure', description: 'Metro, schools, hospitals', active: true, color: '#8B5CF6', type: 'infrastructure' },
    { id: 'metro', name: 'Metro Lines', description: 'Dubai Metro network', active: true, color: '#22C55E', type: 'infrastructure' },
    { id: 'growth', name: 'Price Growth', description: 'Year-over-year price growth', active: false, color: '#EC4899', type: 'heatmap' },
    { id: 'yield', name: 'Rental Yield', description: 'Best rental yield areas', active: false, color: '#8B5CF6', type: 'heatmap' },
    { id: 'demand', name: 'Demand Zones', description: 'High demand areas', active: false, color: '#06B6D4', type: 'overlay' },
    // Lifestyle-specific layers
    { id: 'walkability', name: 'Walkability Score', description: 'Pedestrian-friendly areas', active: false, color: '#10B981', type: 'heatmap' },
    { id: 'amenities', name: 'Amenities Density', description: 'Nearby facilities and services', active: false, color: '#8B5CF6', type: 'heatmap' },
    { id: 'lifestyle', name: 'Lifestyle Zones', description: 'Quality of life indicators', active: false, color: '#06B6D4', type: 'overlay' }
  ]);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with Dubai center
    const mapboxgl = (window as any).mapboxgl;
    if (!mapboxgl) {
      // Load Mapbox GL JS
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js';
      script.onload = initializeMap;
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapContainer.current) return;
      
      const mapboxgl = (window as any).mapboxgl;
      mapboxgl.accessToken = 'pk.eyJ1Ijoia2h1c2hpLTExMDciLCJhIjoiY21lbzMwOTR3MHpwZDJqc2MydGZ1cTVhciJ9.DkLDO0YlTRnZshC8Uhl4aw';
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [55.2708, 25.2048], // Dubai center
        zoom: 11,
         pitch: 45, // 3D perspective
        bearing: 0
      });

      map.current.on('load', () => {
        setMapLoaded(true);
         
         // Add metro lines to the map
         metroLines.forEach((line, index) => {
           // Add metro line source
           map.current.addSource(`metro-line-${index}`, {
             type: 'geojson',
             data: {
               type: 'Feature',
               properties: {
                 name: line.name,
                 status: line.status,
                 color: line.color
               },
               geometry: {
                 type: 'LineString',
                 coordinates: line.coordinates
               }
             }
           });

           // Add metro line layer
           map.current.addLayer({
             id: `metro-line-${index}`,
             type: 'line',
             source: `metro-line-${index}`,
             layout: {
               'line-join': 'round',
               'line-cap': 'round'
             },
             paint: {
               'line-color': line.color,
               'line-width': 4,
               'line-opacity': line.status === 'operational' ? 0.8 : 0.4
             }
           });

           // Add metro line border for better visibility
           map.current.addLayer({
             id: `metro-line-border-${index}`,
             type: 'line',
             source: `metro-line-${index}`,
             layout: {
               'line-join': 'round',
               'line-cap': 'round'
             },
             paint: {
               'line-color': '#ffffff',
               'line-width': 6,
               'line-opacity': line.status === 'operational' ? 0.3 : 0.1
             }
           }, `metro-line-${index}`);

           // Add metro stations along the line
           line.coordinates.forEach((coord, stationIndex) => {
             const el = document.createElement('div');
             el.className = 'metro-station';
             
             const isOperational = line.status === 'operational';
             const stationColor = isOperational ? '#22C55E' : '#F59E0B';
             
             el.innerHTML = `
               <div class="w-4 h-4 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white" 
                    style="background-color: ${stationColor};">
                 <span class="text-xs">🚇</span>
               </div>
             `;

             const marker = new mapboxgl.Marker(el)
               .setLngLat(coord)
               .addTo(map.current);
             
             infrastructureMarkers.current.push(marker);
           });
         });

         // Add heatmap and overlay sources
         addMapOverlays();
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Filter properties based on current filters and recommendations
  const filteredProperties = useMemo(() => {
    let properties = dubaiProperties.filter(property => {
      // Property type filter
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.type)) {
        return false;
      }

      // Price range filter
      if (property.priceMin < filters.priceRange[0] || property.priceMax > filters.priceRange[1]) {
        return false;
      }

      // ROI filter
      if (property.roi < filters.roiRange[0] || property.roi > filters.roiRange[1]) {
        return false;
      }

      // Rental yield filter
      if (property.rentalYield < filters.rentalYieldRange[0] || property.rentalYield > filters.rentalYieldRange[1]) {
        return false;
      }

      // Location filter
      if (filters.locations.length > 0 && !filters.locations.includes(property.location)) {
        return false;
      }

      // Developer rating filter
      if (property.developerRating < filters.developerRating) {
        return false;
      }

      // Project status filter
      if (filters.projectStatus.length > 0 && !filters.projectStatus.includes(property.projectStatus)) {
        return false;
      }

      // Units left filter
      if (property.unitsLeft < filters.unitsLeft[0] || property.unitsLeft > filters.unitsLeft[1]) {
        return false;
      }

      // Search query filter
      if (searchQuery && !property.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !property.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Filter by recommendations if enabled
    if (showRecommendedOnly) {
      properties = properties.filter(property => property.recommended);
    }

    return properties;
  }, [filters, searchQuery, showRecommendedOnly]);

     // Add property markers to map with clustering and recommendations
  const addPropertyMarkers = useCallback(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing property markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    filteredProperties.forEach(property => {
       // Create marker element with recommendation highlighting
      const el = document.createElement('div');
      el.className = 'property-marker';
       
       const baseColor = property.type === 'Villa' ? 'bg-purple-500' : 
                        property.type === 'Apartment' ? 'bg-blue-500' : 'bg-green-500';
       
       const recommendationClass = property.recommended ? 'ring-4 ring-yellow-400 ring-opacity-75' : '';
       
      el.innerHTML = `
         <div class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 ${baseColor} ${recommendationClass}">
          <span class="text-xs">${property.type === 'Villa' ? '🏠' : '🏢'}</span>
           ${property.recommended ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>' : ''}
        </div>
      `;

      // Add click handler
      el.addEventListener('click', () => handlePropertyClick(property));
      
      // Add hover handlers
      el.addEventListener('mouseenter', () => setHoveredProperty(property.id));
      el.addEventListener('mouseleave', () => setHoveredProperty(null));

      // Create marker and add to map
      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat(property.coordinates)
        .addTo(map.current);
      
      markers.current.push(marker);
    });
  }, [mapLoaded, filteredProperties]);

   // Add property labels that show on zoom in
   const addPropertyLabels = useCallback(() => {
     if (!map.current || !mapLoaded) return;

     // Remove existing label sources and layers
     if (map.current.getSource('property-labels')) {
       map.current.removeLayer('property-labels');
       map.current.removeSource('property-labels');
     }

     // Add property labels source
     map.current.addSource('property-labels', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: filteredProperties.map(property => ({
           type: 'Feature',
           properties: {
             name: property.name,
             type: property.type,
             recommended: property.recommended
           },
           geometry: {
             type: 'Point',
             coordinates: property.coordinates
           }
         }))
       }
     });

     // Add property labels layer
     map.current.addLayer({
       id: 'property-labels',
       type: 'symbol',
       source: 'property-labels',
       layout: {
         'text-field': ['get', 'name'],
         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
         'text-size': 12,
         'text-anchor': 'top',
         'text-offset': [0, 1.5],
         'text-allow-overlap': false,
         'text-ignore-placement': false,
         'symbol-placement': 'point'
       },
       paint: {
         'text-color': [
           'case',
           ['get', 'recommended'], '#F59E0B', // Yellow for recommended
           ['get', 'type'],
           'Villa', '#8B5CF6', // Purple for villas
           'Apartment', '#3B82F6', // Blue for apartments
           '#10B981' // Green for others
         ],
         'text-halo-color': '#ffffff',
         'text-halo-width': 2,
         'text-halo-blur': 1
       },
       minzoom: 13 // Only show labels when zoomed in
     });
   }, [mapLoaded, filteredProperties]);

  // Add infrastructure layer
  const addInfrastructureLayer = useCallback(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing infrastructure markers
    infrastructureMarkers.current.forEach(marker => marker.remove());
    infrastructureMarkers.current = [];

    infrastructureData.forEach(item => {
      const el = document.createElement('div');
      el.className = 'infrastructure-marker';
      
      let icon = '';
      let color = '';
      switch (item.type) {
        case 'metro':
          icon = '🚇';
          color = item.status === 'operational' ? 'bg-green-500' : 'bg-orange-500';
          break;
        case 'school':
          icon = '🏫';
          color = 'bg-blue-500';
          break;
        case 'hospital':
          icon = '🏥';
          color = 'bg-red-500';
          break;
        case 'mall':
          icon = '🛍️';
          color = 'bg-purple-500';
          break;
        default:
          icon = '📍';
          color = 'bg-gray-500';
      }

      el.innerHTML = `
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md ${color}">
          <span class="text-xs">${icon}</span>
        </div>
      `;

      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat(item.coordinates)
        .addTo(map.current);
      
      infrastructureMarkers.current.push(marker);
    });
  }, [mapLoaded]);

  // Initialize markers when map loads
  useEffect(() => {
    if (mapLoaded) {
      addPropertyMarkers();
       addPropertyLabels();
      addInfrastructureLayer();
    }
   }, [mapLoaded, addPropertyMarkers, addPropertyLabels, addInfrastructureLayer]);

  // Update map markers when filters change
  useEffect(() => {
    if (map.current && mapLoaded) {
      addPropertyMarkers();
       addPropertyLabels();
    }
   }, [filteredProperties, addPropertyMarkers, addPropertyLabels]);

  const handlePropertyClick = useCallback((property: any) => {
    // Add to selected properties if not already selected
    setSelectedProperties(prev => {
      const isAlreadySelected = prev.find(p => p.id === property.id);
      if (isAlreadySelected) {
        return prev.filter(p => p.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
    
    setSelectedProperty(property);
    setShowPropertyPanel(true);
    
         // Fly to property location with 3D perspective
    if (map.current) {
      map.current.flyTo({
        center: property.coordinates,
        zoom: 15,
         pitch: 45, // Maintain 3D perspective
        duration: 1000
      });
    }
  }, []);

     // Add map overlays (heatmaps and zones)
   const addMapOverlays = useCallback(() => {
     if (!map.current) return;

     // ROI Heatmap
     map.current.addSource('roi-heatmap', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: dubaiProperties.map(property => ({
           type: 'Feature',
           properties: {
             roi: property.roi,
             intensity: property.roi / 15 // Normalize to 0-1
           },
           geometry: {
             type: 'Point',
             coordinates: property.coordinates
           }
         }))
       }
     });

     map.current.addLayer({
       id: 'roi-heatmap-layer',
       type: 'heatmap',
       source: 'roi-heatmap',
       paint: {
         'heatmap-weight': ['get', 'intensity'],
         'heatmap-intensity': 1,
         'heatmap-color': [
           'interpolate',
           ['linear'],
           ['heatmap-density'],
           0, 'rgba(16, 185, 129, 0)',
           0.2, 'rgba(16, 185, 129, 0.3)',
           0.4, 'rgba(16, 185, 129, 0.6)',
           0.6, 'rgba(16, 185, 129, 0.8)',
           1, 'rgba(16, 185, 129, 1)'
         ],
         'heatmap-radius': 30,
         'heatmap-opacity': 0.8
       }
     });

     // Rental Yield Heatmap
     map.current.addSource('rental-heatmap', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: dubaiProperties.map(property => ({
           type: 'Feature',
           properties: {
             rentalYield: property.rentalYield,
             intensity: property.rentalYield / 12 // Normalize to 0-1
           },
           geometry: {
             type: 'Point',
             coordinates: property.coordinates
           }
         }))
       }
     });

     map.current.addLayer({
       id: 'rental-heatmap-layer',
       type: 'heatmap',
       source: 'rental-heatmap',
       paint: {
         'heatmap-weight': ['get', 'intensity'],
         'heatmap-intensity': 1,
         'heatmap-color': [
           'interpolate',
           ['linear'],
           ['heatmap-density'],
           0, 'rgba(59, 130, 246, 0)',
           0.2, 'rgba(59, 130, 246, 0.3)',
           0.4, 'rgba(59, 130, 246, 0.6)',
           0.6, 'rgba(59, 130, 246, 0.8)',
           1, 'rgba(59, 130, 246, 1)'
         ],
         'heatmap-radius': 30,
         'heatmap-opacity': 0.8
       }
     });

     // Price Heatmap
     map.current.addSource('price-heatmap', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: dubaiProperties.map(property => ({
           type: 'Feature',
           properties: {
             pricePerSqft: property.pricePerSqft,
             intensity: property.pricePerSqft / 2500 // Normalize to 0-1
           },
           geometry: {
             type: 'Point',
             coordinates: property.coordinates
           }
         }))
       }
     });

     map.current.addLayer({
       id: 'price-heatmap-layer',
       type: 'heatmap',
       source: 'price-heatmap',
       paint: {
         'heatmap-weight': ['get', 'intensity'],
         'heatmap-intensity': 1,
         'heatmap-color': [
           'interpolate',
           ['linear'],
           ['heatmap-density'],
           0, 'rgba(245, 158, 11, 0)',
           0.2, 'rgba(245, 158, 11, 0.3)',
           0.4, 'rgba(245, 158, 11, 0.6)',
           0.6, 'rgba(245, 158, 11, 0.8)',
           1, 'rgba(245, 158, 11, 1)'
         ],
         'heatmap-radius': 30,
         'heatmap-opacity': 0.8
       }
     });

     // Price Growth Heatmap
     map.current.addSource('growth-heatmap', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: dubaiProperties.map(property => ({
           type: 'Feature',
           properties: {
             priceGrowth: property.priceGrowthYoY,
             intensity: property.priceGrowthYoY / 20 // Normalize to 0-1
           },
           geometry: {
             type: 'Point',
             coordinates: property.coordinates
           }
         }))
       }
     });

     map.current.addLayer({
       id: 'growth-heatmap-layer',
       type: 'heatmap',
       source: 'growth-heatmap',
       paint: {
         'heatmap-weight': ['get', 'intensity'],
         'heatmap-intensity': 1,
         'heatmap-color': [
           'interpolate',
           ['linear'],
           ['heatmap-density'],
           0, 'rgba(236, 72, 153, 0)',
           0.2, 'rgba(236, 72, 153, 0.3)',
           0.4, 'rgba(236, 72, 153, 0.6)',
           0.6, 'rgba(236, 72, 153, 0.8)',
           1, 'rgba(236, 72, 153, 1)'
         ],
         'heatmap-radius': 30,
         'heatmap-opacity': 0.8
       }
     });

     // Risk Zones (polygon overlay)
     map.current.addSource('risk-zones', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: [
           {
             type: 'Feature',
             properties: { risk: 'low', color: '#10B981' },
             geometry: {
               type: 'Polygon',
               coordinates: [[
                 [55.2, 25.1], [55.3, 25.1], [55.3, 25.2], [55.2, 25.2], [55.2, 25.1]
               ]]
             }
           },
           {
             type: 'Feature',
             properties: { risk: 'medium', color: '#F59E0B' },
             geometry: {
               type: 'Polygon',
               coordinates: [[
                 [55.1, 25.0], [55.2, 25.0], [55.2, 25.1], [55.1, 25.1], [55.1, 25.0]
               ]]
             }
           },
           {
             type: 'Feature',
             properties: { risk: 'high', color: '#EF4444' },
             geometry: {
               type: 'Polygon',
               coordinates: [[
                 [55.0, 25.0], [55.1, 25.0], [55.1, 25.1], [55.0, 25.1], [55.0, 25.0]
               ]]
             }
           }
         ]
       }
     });

     map.current.addLayer({
       id: 'risk-zones-layer',
       type: 'fill',
       source: 'risk-zones',
       paint: {
         'fill-color': ['get', 'color'],
         'fill-opacity': 0.3
       }
     });

     // Demand Zones
     map.current.addSource('demand-zones', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: [
           {
             type: 'Feature',
             properties: { demand: 'high', color: '#06B6D4' },
             geometry: {
               type: 'Polygon',
               coordinates: [[
                 [55.25, 25.18], [55.28, 25.18], [55.28, 25.21], [55.25, 25.21], [55.25, 25.18]
               ]]
             }
           }
         ]
       }
     });

     map.current.addLayer({
       id: 'demand-zones-layer',
       type: 'fill',
       source: 'demand-zones',
       paint: {
         'fill-color': ['get', 'color'],
         'fill-opacity': 0.4
       }
     });

     // Lifestyle-specific overlays
     // Walkability Heatmap
     map.current.addSource('walkability-heatmap', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: dubaiProperties.map(property => ({
           type: 'Feature',
           properties: {
             walkabilityScore: property.walkabilityScore,
             intensity: property.walkabilityScore / 100 // Normalize to 0-1
           },
           geometry: {
             type: 'Point',
             coordinates: property.coordinates
           }
         }))
       }
     });

     map.current.addLayer({
       id: 'walkability-heatmap-layer',
       type: 'heatmap',
       source: 'walkability-heatmap',
       paint: {
         'heatmap-weight': ['get', 'intensity'],
         'heatmap-intensity': 1,
         'heatmap-color': [
           'interpolate',
           ['linear'],
           ['heatmap-density'],
           0, 'rgba(16, 185, 129, 0)',
           0.2, 'rgba(16, 185, 129, 0.3)',
           0.4, 'rgba(16, 185, 129, 0.6)',
           0.6, 'rgba(16, 185, 129, 0.8)',
           1, 'rgba(16, 185, 129, 1)'
         ],
         'heatmap-radius': 25,
         'heatmap-opacity': 0.7
       }
     });

     // Amenities Density Heatmap
     map.current.addSource('amenities-heatmap', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: dubaiProperties.map(property => ({
           type: 'Feature',
           properties: {
             amenitiesCount: property.nearbyAmenities.length,
             intensity: Math.min(property.nearbyAmenities.length / 8, 1) // Normalize to 0-1
           },
           geometry: {
             type: 'Point',
             coordinates: property.coordinates
           }
         }))
       }
     });

     map.current.addLayer({
       id: 'amenities-heatmap-layer',
       type: 'heatmap',
       source: 'amenities-heatmap',
       paint: {
         'heatmap-weight': ['get', 'intensity'],
         'heatmap-intensity': 1,
         'heatmap-color': [
           'interpolate',
           ['linear'],
           ['heatmap-density'],
           0, 'rgba(139, 92, 246, 0)',
           0.2, 'rgba(139, 92, 246, 0.3)',
           0.4, 'rgba(139, 92, 246, 0.6)',
           0.6, 'rgba(139, 92, 246, 0.8)',
           1, 'rgba(139, 92, 246, 1)'
         ],
         'heatmap-radius': 20,
         'heatmap-opacity': 0.6
       }
     });

     // Lifestyle Zones
     map.current.addSource('lifestyle-zones', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: [
           {
             type: 'Feature',
             properties: { lifestyle: 'premium', color: '#10B981' },
             geometry: {
               type: 'Polygon',
               coordinates: [[
                 [55.27, 25.19], [55.28, 25.19], [55.28, 25.20], [55.27, 25.20], [55.27, 25.19]
               ]]
             }
           },
           {
             type: 'Feature',
             properties: { lifestyle: 'family', color: '#3B82F6' },
             geometry: {
               type: 'Polygon',
               coordinates: [[
                 [55.24, 25.16], [55.25, 25.16], [55.25, 25.17], [55.24, 25.17], [55.24, 25.16]
               ]]
             }
           },
           {
             type: 'Feature',
             properties: { lifestyle: 'urban', color: '#8B5CF6' },
             geometry: {
               type: 'Polygon',
               coordinates: [[
                 [55.14, 25.06], [55.15, 25.06], [55.15, 25.07], [55.14, 25.07], [55.14, 25.06]
               ]]
             }
           }
         ]
       }
     });

     map.current.addLayer({
       id: 'lifestyle-zones-layer',
       type: 'fill',
       source: 'lifestyle-zones',
       paint: {
         'fill-color': ['get', 'color'],
         'fill-opacity': 0.3
       }
     });

     // Initially hide all overlay layers
     map.current.setLayoutProperty('roi-heatmap-layer', 'visibility', 'none');
     map.current.setLayoutProperty('rental-heatmap-layer', 'visibility', 'none');
     map.current.setLayoutProperty('price-heatmap-layer', 'visibility', 'none');
     map.current.setLayoutProperty('growth-heatmap-layer', 'visibility', 'none');
     map.current.setLayoutProperty('risk-zones-layer', 'visibility', 'none');
     map.current.setLayoutProperty('demand-zones-layer', 'visibility', 'none');
     map.current.setLayoutProperty('walkability-heatmap-layer', 'visibility', 'none');
     map.current.setLayoutProperty('amenities-heatmap-layer', 'visibility', 'none');
     map.current.setLayoutProperty('lifestyle-zones-layer', 'visibility', 'none');
  }, []);

  const toggleLayer = useCallback((layerId: string) => {
    setMapLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, active: !layer.active } : layer
    ));

     // Handle metro line visibility
     if (layerId === 'metro' && map.current) {
       const isVisible = mapLayers.find(layer => layer.id === 'metro')?.active;
       
       metroLines.forEach((line, index) => {
         const lineLayer = map.current.getLayer(`metro-line-${index}`);
         const borderLayer = map.current.getLayer(`metro-line-border-${index}`);
         
         if (lineLayer && borderLayer) {
           if (isVisible) {
             // Hide metro lines
             map.current.setLayoutProperty(`metro-line-${index}`, 'visibility', 'none');
             map.current.setLayoutProperty(`metro-line-border-${index}`, 'visibility', 'none');
           } else {
             // Show metro lines
             map.current.setLayoutProperty(`metro-line-${index}`, 'visibility', 'visible');
             map.current.setLayoutProperty(`metro-line-border-${index}`, 'visibility', 'visible');
           }
         }
       });
     }

           // Handle other overlay layers
      if (map.current) {
        const layerVisibilityMap: { [key: string]: string } = {
          'roi': 'roi-heatmap-layer',
          'rental': 'rental-heatmap-layer',
          'price': 'price-heatmap-layer',
          'growth': 'growth-heatmap-layer',
          'risk': 'risk-zones-layer',
          'demand': 'demand-zones-layer',
          'walkability': 'walkability-heatmap-layer',
          'amenities': 'amenities-heatmap-layer',
          'lifestyle': 'lifestyle-zones-layer'
        };

        const mapLayerId = layerVisibilityMap[layerId];
        if (mapLayerId) {
          const currentLayer = mapLayers.find(layer => layer.id === layerId);
          const isVisible = currentLayer?.active;
          
          if (isVisible) {
            map.current.setLayoutProperty(mapLayerId, 'visibility', 'none');
          } else {
            map.current.setLayoutProperty(mapLayerId, 'visibility', 'visible');
          }
        }
      }
   }, [mapLayers]);

  const resetFilters = useCallback(() => {
    setFilters({
      propertyTypes: ['Apartment', 'Villa'],
      priceRange: [500000, 20000000],
      roiRange: [5, 15],
      rentalYieldRange: [4, 12],
      locations: [],
      developerRating: 4,
      projectStatus: ['Ready to Move', 'Under Construction', 'Near Completion'],
      unitsLeft: [1, 200]
    });
    setSearchQuery('');
    setSelectedProperties([]);
    setShowPropertyPanel(false);
  }, []);

  const clearSelectedProperties = useCallback(() => {
    setSelectedProperties([]);
    setShowPropertyPanel(false);
  }, []);

  const getUnitsLeftColor = (unitsLeft: number) => {
    if (unitsLeft <= 10) return 'text-red-600 font-semibold';
    if (unitsLeft <= 30) return 'text-orange-600 font-medium';
    return 'text-green-600';
  };

  const getPriceGrowthColor = (growth: number) => {
    if (growth >= 15) return 'text-green-600 font-semibold';
    if (growth >= 10) return 'text-blue-600 font-medium';
    if (growth >= 5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready to Move':
        return 'bg-green-100 text-green-800';
      case 'Under Construction':
        return 'bg-orange-100 text-orange-800';
      case 'Near Completion':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get recommended regions based on user preferences
  const getRecommendedRegions = () => {
    if (!userPreferences) return [];
    
    const { budget, investmentGoal, riskTolerance, propertyType } = userPreferences;
    
    return filteredProperties
      .filter(property => {
        if (budget && (property.priceMin > budget.max || property.priceMax < budget.min)) return false;
        if (propertyType && property.type !== propertyType) return false;
        if (riskTolerance === 'low' && property.riskLevel !== 'Low') return false;
        return true;
      })
      .map(property => property.location)
      .filter((location, index, arr) => arr.indexOf(location) === index)
      .slice(0, 3);
  };

  const recommendedRegions = getRecommendedRegions();

  // Handle view mode change
  const handleViewModeChange = useCallback((newViewMode: 'investor' | 'lifestyle') => {
    setViewMode(newViewMode);
    
    // Update map layers based on view mode
    setMapLayers(prev => prev.map(layer => {
      if (newViewMode === 'investor') {
        // Show investor-focused layers
        return {
          ...layer,
          active: ['roi', 'infrastructure', 'metro'].includes(layer.id)
        };
      } else {
        // Show lifestyle-focused layers
        return {
          ...layer,
          active: ['walkability', 'amenities', 'infrastructure', 'metro'].includes(layer.id)
        };
      }
    }));

    // Update map layer visibility
    if (map.current) {
      const investorLayers = ['roi-heatmap-layer', 'rental-heatmap-layer', 'price-heatmap-layer', 'growth-heatmap-layer', 'risk-zones-layer', 'demand-zones-layer'];
      const lifestyleLayers = ['walkability-heatmap-layer', 'amenities-heatmap-layer', 'lifestyle-zones-layer'];
      
      if (newViewMode === 'investor') {
        // Show investor layers, hide lifestyle layers
        investorLayers.forEach(layerId => {
          if (map.current.getLayer(layerId)) {
            map.current.setLayoutProperty(layerId, 'visibility', 'visible');
          }
        });
        lifestyleLayers.forEach(layerId => {
          if (map.current.getLayer(layerId)) {
            map.current.setLayoutProperty(layerId, 'visibility', 'none');
          }
        });
      } else {
        // Show lifestyle layers, hide investor layers
        lifestyleLayers.forEach(layerId => {
          if (map.current.getLayer(layerId)) {
            map.current.setLayoutProperty(layerId, 'visibility', 'visible');
          }
        });
        investorLayers.forEach(layerId => {
          if (map.current.getLayer(layerId)) {
            map.current.setLayoutProperty(layerId, 'visibility', 'none');
          }
        });
      }
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Map Controls Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Dubai Investment Map</h1>
          <Badge variant="secondary" className="hidden sm:flex">
            {filteredProperties.length} properties found
          </Badge>
          {selectedProperties.length > 0 && (
            <div className="hidden sm:flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {selectedProperties.length} selected
              </Badge>
              <Button variant="ghost" size="sm" onClick={clearSelectedProperties}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          {recommendedRegions.length > 0 && (
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600">Recommended:</span>
              {recommendedRegions.map(region => (
                <Badge key={region} variant="outline" className="text-xs">
                  {region}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Enhanced View Mode Toggle */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'investor' ? 'default' : 'ghost'}
              onClick={() => handleViewModeChange('investor')}
              className="px-3 py-1"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Investor View
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'lifestyle' ? 'default' : 'ghost'}
              onClick={() => handleViewModeChange('lifestyle')}
              className="px-3 py-1"
            >
              <Home className="h-4 w-4 mr-1" />
              Lifestyle View
            </Button>
          </div>
          
          {/* View Mode Indicator */}
          <div className="hidden lg:flex items-center space-x-2">
            <Badge variant="outline" className={viewMode === 'investor' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}>
              {viewMode === 'investor' ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Investment Metrics
                </>
              ) : (
                <>
                  <Home className="h-3 w-3 mr-1" />
                  Lifestyle Metrics
                </>
              )}
            </Badge>
          </div>

          {/* Recommendation Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            <Switch
              checked={showRecommendedOnly}
              onCheckedChange={setShowRecommendedOnly}
            />
            <span className="text-sm text-gray-600">Recommended Only</span>
          </div>

          {/* Clustering Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            <Switch
              checked={clusteringEnabled}
              onCheckedChange={setClusteringEnabled}
            />
            <span className="text-sm text-gray-600">Clustering</span>
          </div>

          {/* Mobile Filter Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="p-4 border-b flex-shrink-0">
                <SheetTitle>Filters & Layers</SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-1 h-full">
                <div className="p-4 space-y-6 pb-8">
                  {/* Mobile filter content - same as desktop */}
                  {/* Map Layers */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <Layers className="h-4 w-4" />
                        <span className="font-medium">Map Layers</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      {mapLayers
                        .filter(layer => {
                          if (viewMode === 'investor') {
                            return ['roi', 'rental', 'price', 'risk', 'growth', 'infrastructure', 'metro', 'yield', 'demand'].includes(layer.id);
                          } else {
                            return ['walkability', 'amenities', 'lifestyle', 'infrastructure', 'metro'].includes(layer.id);
                          }
                        })
                        .map(layer => (
                        <div key={layer.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-3">
                            <Switch
                              checked={layer.active}
                              onCheckedChange={() => toggleLayer(layer.id)}
                            />
                            <div>
                              <div className="font-medium text-sm">{layer.name}</div>
                              <div className="text-xs text-gray-500">{layer.description}</div>
                            </div>
                          </div>
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: layer.color }}
                          />
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* View Mode Specific Filters */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <label className="font-medium">
                        {viewMode === 'investor' ? 'Investment Filters' : 'Lifestyle Filters'}
                      </label>
                      <Badge variant="outline" className="text-xs">
                        {viewMode === 'investor' ? 'ROI & Yield' : 'Amenities & Walkability'}
                      </Badge>
                    </div>
                    
                    {viewMode === 'investor' ? (
                      <div className="space-y-4">
                        {/* ROI Range */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            ROI Range: {filters.roiRange[0]}% - {filters.roiRange[1]}%
                          </label>
                          <Slider
                            value={filters.roiRange}
                            onValueChange={(value: number[]) => setFilters(prev => ({ ...prev, roiRange: value as [number, number] }))}
                            max={15}
                            min={3}
                            step={0.5}
                            className="mt-2"
                          />
                        </div>

                        {/* Rental Yield Range */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Rental Yield: {filters.rentalYieldRange[0]}% - {filters.rentalYieldRange[1]}%
                          </label>
                          <Slider
                            value={filters.rentalYieldRange}
                            onValueChange={(value: number[]) => setFilters(prev => ({ ...prev, rentalYieldRange: value as [number, number] }))}
                            max={12}
                            min={3}
                            step={0.5}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Walkability Score Filter */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Min Walkability Score: 70+
                          </label>
                          <div className="text-xs text-gray-500 mb-2">
                            Properties with high walkability scores
                          </div>
                        </div>

                        {/* Metro Distance Filter */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Max Metro Distance: 2km
                          </label>
                          <div className="text-xs text-gray-500 mb-2">
                            Properties within walking distance to metro
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Recommendation Filter */}
                  <div>
                    <label className="font-medium mb-3 block">Recommendations</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={showRecommendedOnly}
                          onCheckedChange={setShowRecommendedOnly}
                        />
                        <label className="text-sm">Show Recommended Only</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={clusteringEnabled}
                          onCheckedChange={setClusteringEnabled}
                        />
                        <label className="text-sm">Enable Clustering</label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Property Type Filter */}
                  <div>
                    <label className="font-medium mb-3 block">Property Type</label>
                    <div className="space-y-2">
                      {['Apartment', 'Villa', 'Townhouse'].map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-${type}`}
                            checked={filters.propertyTypes.includes(type)}
                            onCheckedChange={(checked: boolean) => {
                              if (checked) {
                                setFilters(prev => ({
                                  ...prev,
                                  propertyTypes: [...prev.propertyTypes, type]
                                }));
                              } else {
                                setFilters(prev => ({
                                  ...prev,
                                  propertyTypes: prev.propertyTypes.filter(t => t !== type)
                                }));
                              }
                            }}
                          />
                          <label htmlFor={`mobile-${type}`} className="text-sm">{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="font-medium mb-3 block">
                      Price Range: AED {(filters.priceRange[0] / 1000000).toFixed(1)}M - AED {(filters.priceRange[1] / 1000000).toFixed(1)}M
                    </label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value: number[]) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                      max={20000000}
                      min={500000}
                      step={250000}
                      className="mt-2"
                    />
                  </div>

                  {/* Reset Filters */}
                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    Reset All Filters
                  </Button>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Filters Sidebar - Desktop */}
        <div className={`hidden md:flex flex-col bg-white border-r transition-all duration-300 ${showFilters ? 'w-80' : 'w-0'} overflow-hidden`}>
          <div className="p-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters & Layers</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 h-full">
            <div className="p-4 space-y-6 pb-8">
              {/* Map Layers */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4" />
                    <span className="font-medium">Map Layers</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-2">
                  {mapLayers
                    .filter(layer => {
                      if (viewMode === 'investor') {
                        return ['roi', 'rental', 'price', 'risk', 'growth', 'infrastructure', 'metro', 'yield', 'demand'].includes(layer.id);
                      } else {
                        return ['walkability', 'amenities', 'lifestyle', 'infrastructure', 'metro'].includes(layer.id);
                      }
                    })
                    .map(layer => (
                    <div key={layer.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={layer.active}
                          onCheckedChange={() => toggleLayer(layer.id)}
                        />
                        <div>
                          <div className="font-medium text-sm">{layer.name}</div>
                          <div className="text-xs text-gray-500">{layer.description}</div>
                        </div>
                      </div>
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: layer.color }}
                      />
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Recommendation Filter */}
              <div>
                <label className="font-medium mb-3 block">Recommendations</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showRecommendedOnly}
                      onCheckedChange={setShowRecommendedOnly}
                    />
                    <label className="text-sm">Show Recommended Only</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={clusteringEnabled}
                      onCheckedChange={setClusteringEnabled}
                    />
                    <label className="text-sm">Enable Clustering</label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* View Mode Specific Filters */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <label className="font-medium">
                    {viewMode === 'investor' ? 'Investment Filters' : 'Lifestyle Filters'}
                  </label>
                  <Badge variant="outline" className="text-xs">
                    {viewMode === 'investor' ? 'ROI & Yield' : 'Amenities & Walkability'}
                  </Badge>
                </div>
                
                {viewMode === 'investor' ? (
                  <div className="space-y-4">
                    {/* ROI Range */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        ROI Range: {filters.roiRange[0]}% - {filters.roiRange[1]}%
                      </label>
                      <Slider
                        value={filters.roiRange}
                        onValueChange={(value: number[]) => setFilters(prev => ({ ...prev, roiRange: value as [number, number] }))}
                        max={15}
                        min={3}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>

                    {/* Rental Yield Range */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Rental Yield: {filters.rentalYieldRange[0]}% - {filters.rentalYieldRange[1]}%
                      </label>
                      <Slider
                        value={filters.rentalYieldRange}
                        onValueChange={(value: number[]) => setFilters(prev => ({ ...prev, rentalYieldRange: value as [number, number] }))}
                        max={12}
                        min={3}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>

                    {/* Developer Rating */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Min Developer Rating: {filters.developerRating}+ ⭐
                      </label>
                      <Slider
                        value={[filters.developerRating]}
                        onValueChange={(value: number[]) => setFilters(prev => ({ ...prev, developerRating: value[0] }))}
                        max={5}
                        min={3}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>

                    {/* Units Left Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Units Left: {filters.unitsLeft[0]} - {filters.unitsLeft[1]}
                      </label>
                      <Slider
                        value={filters.unitsLeft}
                        onValueChange={(value: number[]) => setFilters(prev => ({ ...prev, unitsLeft: value as [number, number] }))}
                        max={200}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Walkability Score Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Min Walkability Score: 70+
                      </label>
                      <div className="text-xs text-gray-500 mb-2">
                        Properties with high walkability scores
                      </div>
                    </div>

                    {/* Metro Distance Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Max Metro Distance: 2km
                      </label>
                      <div className="text-xs text-gray-500 mb-2">
                        Properties within walking distance to metro
                      </div>
                    </div>

                    {/* School Distance Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Max School Distance: 3km
                      </label>
                      <div className="text-xs text-gray-500 mb-2">
                        Family-friendly locations
                      </div>
                    </div>

                    {/* Amenities Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Min Amenities: 5+
                      </label>
                      <div className="text-xs text-gray-500 mb-2">
                        Areas with good facilities
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Property Type Filter */}
              <div>
                <label className="font-medium mb-3 block">Property Type</label>
                <div className="space-y-2">
                  {['Apartment', 'Villa', 'Townhouse'].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.propertyTypes.includes(type)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setFilters(prev => ({
                              ...prev,
                              propertyTypes: [...prev.propertyTypes, type]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              propertyTypes: prev.propertyTypes.filter(t => t !== type)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={type} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="font-medium mb-3 block">
                  Price Range: AED {(filters.priceRange[0] / 1000000).toFixed(1)}M - AED {(filters.priceRange[1] / 1000000).toFixed(1)}M
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value: number[]) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                  max={20000000}
                  min={500000}
                  step={250000}
                  className="mt-2"
                />
              </div>

              {/* Project Status */}
              <div>
                <label className="font-medium mb-3 block">Project Status</label>
                <div className="space-y-2">
                  {['Ready to Move', 'Under Construction', 'Near Completion'].map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={status}
                        checked={filters.projectStatus.includes(status)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setFilters(prev => ({
                              ...prev,
                              projectStatus: [...prev.projectStatus, status]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              projectStatus: prev.projectStatus.filter(s => s !== status)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={status} className="text-sm">{status}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <Button variant="outline" onClick={resetFilters} className="w-full">
                Reset All Filters
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative min-h-0">
          {!showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(true)}
              className="absolute top-4 left-4 z-40 bg-white shadow-md"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}

          {/* Mapbox Container */}
          <div ref={mapContainer} className="w-full h-full min-h-0" />

          {/* Quick View Card for Hovered Property */}
          {hoveredProperty && (
            <div className="absolute top-4 right-4 z-30 w-80">
              {(() => {
                const property = dubaiProperties.find(p => p.id === hoveredProperty);
                if (!property) return null;
                
                return (
                  <Card className="shadow-xl border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg cursor-pointer hover:text-blue-600" 
                                     onClick={() => handlePropertyClick(property)}>
                            {property.name}
                            {property.recommended && (
                              <Badge variant="secondary" className="ml-2 text-xs bg-yellow-100 text-yellow-800">
                                Recommended
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{property.location}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(property.projectStatus)}>
                          {property.projectStatus}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Critical Data at Top */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-semibold text-blue-600">{property.priceRange}</div>
                          <div className="text-xs text-gray-600">Price Range</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className={`text-lg font-semibold ${getUnitsLeftColor(property.unitsLeft)}`}>
                            {property.unitsLeft}
                          </div>
                          <div className="text-xs text-gray-600">Units Left</div>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{property.roi}%</div>
                          <div className="text-gray-600">ROI</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">{property.rentalYield}%</div>
                          <div className="text-gray-600">Yield</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-semibold ${getPriceGrowthColor(property.priceGrowthYoY)}`}>
                            {property.priceGrowthYoY}%
                          </div>
                          <div className="text-gray-600">Growth YoY</div>
                        </div>
                      </div>

                      {/* Developer Rating */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Developer:</span>
                        <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
                          <span className="text-sm font-medium">{property.developer}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium ml-1">{property.developerRating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Construction Status */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Construction Progress</span>
                          <span className="font-medium">{property.constructionStatus}%</span>
                        </div>
                        <Progress value={property.constructionStatus} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">
                          Completion: {property.completionDate}
                        </div>
                      </div>

                      {/* Unit Types */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Unit Types:</div>
                        <div className="flex flex-wrap gap-1">
                          {property.unitTypes.map((type: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                                             {/* Recommendation Reason */}
                       {property.recommended && property.recommendationReason && (
                         <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                           <div className="text-sm font-medium text-yellow-800 mb-1">Why Recommended:</div>
                           <div className="text-xs text-yellow-700">{property.recommendationReason}</div>
                         </div>
                       )}

                       {/* Metro Completion Tag */}
                       {property.infraImpact?.metro?.completion === "2027" && (
                         <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                           <div className="flex items-center space-x-2 mb-1">
                             <Train className="h-4 w-4 text-green-600" />
                             <div className="text-sm font-medium text-green-800">Metro 2027</div>
                           </div>
                           <div className="text-xs text-green-700">
                             Metro completion expected by 2027 - value boost likely
                           </div>
                         </div>
                       )}
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          )}

                                {/* Map Legend */}
            <div className="absolute bottom-4 left-4 z-30">
              <Card className="p-4 max-w-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Map Legend</h4>
                    <Badge variant="outline" className="text-xs">
                      {viewMode === 'investor' ? 'Investment View' : 'Lifestyle View'}
                    </Badge>
                  </div>
                  
                  {/* Heatmap Legend */}
                  {mapLayers.filter(layer => layer.active && layer.type === 'heatmap').length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-600">
                        {viewMode === 'investor' ? 'Investment Heatmaps' : 'Lifestyle Heatmaps'}
                      </div>
                      {mapLayers
                        .filter(layer => layer.active && layer.type === 'heatmap')
                        .map(layer => (
                          <div key={layer.id} className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: layer.color }}
                            />
                            <span className="text-xs">{layer.name}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Overlay Legend */}
                  {mapLayers.filter(layer => layer.active && layer.type === 'overlay').length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-600">
                        {viewMode === 'investor' ? 'Investment Zones' : 'Lifestyle Zones'}
                      </div>
                      {mapLayers
                        .filter(layer => layer.active && layer.type === 'overlay')
                        .map(layer => (
                          <div key={layer.id} className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: layer.color }}
                            />
                            <span className="text-xs">{layer.name}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Infrastructure Legend */}
                  {mapLayers.filter(layer => layer.active && layer.type === 'infrastructure').length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-600">Infrastructure</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs">Metro Stations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs">Schools</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs">Hospitals</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-xs">Shopping Malls</span>
                      </div>
                    </div>
                  )}

                  {/* Property Types */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-600">Properties</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs">Apartments</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs">Villas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs">Townhouses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 ring-2 ring-yellow-400"></div>
                      <span className="text-xs">Recommended</span>
                    </div>
                  </div>

                  {/* View Mode Specific Info */}
                  {viewMode === 'investor' && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-600">Investment Focus</div>
                      <div className="text-xs text-gray-500">
                        • ROI and rental yield heatmaps<br/>
                        • Risk assessment zones<br/>
                        • Price growth indicators<br/>
                        • Demand analysis
                      </div>
                    </div>
                  )}

                  {viewMode === 'lifestyle' && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-600">Lifestyle Focus</div>
                      <div className="text-xs text-gray-500">
                        • Walkability scores<br/>
                        • Amenities density<br/>
                        • Quality of life zones<br/>
                        • Community features
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

          {/* No Results Message */}
          {filteredProperties.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
              <Card className="p-8 max-w-sm text-center">
                <div className="text-gray-400 mb-4">
                  <MapPin className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to see more properties
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Reset Filters
                </Button>
              </Card>
            </div>
          )}
        </div>

        {/* Property Detail Panel */}
        {showPropertyPanel && selectedProperty && (
          <div className="w-96 bg-white border-l flex flex-col overflow-hidden">
             <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Property Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowPropertyPanel(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

             <ScrollArea className="flex-1 h-full">
               <div className="p-4 space-y-6 pb-8">
                {/* Property Images */}
                <div className="space-y-3">
                  <ImageWithFallback
                    src={selectedProperty.aerialView}
                    alt="Aerial view"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <ImageWithFallback
                      src={selectedProperty.images[0]}
                      alt="Property"
                      className="w-full h-24 object-cover rounded"
                    />
                    <ImageWithFallback
                      src={selectedProperty.floorPlans[0]}
                      alt="Floor plan"
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div>
                  <h4 className="text-xl font-semibold mb-2">{selectedProperty.name}</h4>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedProperty.location}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {selectedProperty.priceRange}
                  </div>
                </div>

                {/* Infrastructure Impact */}
                {selectedProperty.governmentImpact && (
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-blue-700">Infrastructure Impact</div>
                          <div className="text-sm text-gray-600">{selectedProperty.governmentImpact}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                 {/* Metro Completion Tag */}
                 {selectedProperty.infraImpact?.metro?.completion === "2027" && (
                   <Card className="border-l-4 border-l-green-500">
                     <CardContent className="p-4">
                       <div className="flex items-start space-x-2">
                         <Train className="h-4 w-4 text-green-500 mt-0.5" />
                         <div>
                           <div className="font-medium text-sm text-green-700">Metro Expansion</div>
                           <div className="text-sm text-gray-600">
                             Metro line completion expected by 2027 - likely to boost property values
                           </div>
                           <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                             <Calendar className="h-3 w-3 mr-1" />
                             Completion: 2027
                           </Badge>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 )}

                {/* Investment Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      {viewMode === 'investor' ? (
                        <>
                          <TrendingUp className="h-5 w-5 mr-2" />
                          Investment Metrics
                        </>
                      ) : (
                        <>
                          <Home className="h-5 w-5 mr-2" />
                          Lifestyle Metrics
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {viewMode === 'investor' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{selectedProperty.roi}%</div>
                          <div className="text-sm text-gray-600">ROI</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{selectedProperty.rentalYield}%</div>
                          <div className="text-sm text-gray-600">Rental Yield</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{selectedProperty.priceGrowthYoY}%</div>
                          <div className="text-sm text-gray-600">Price Growth YoY</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Badge className={getRiskColor(selectedProperty.riskLevel)}>
                            {selectedProperty.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{selectedProperty.metroDistance}km</div>
                          <div className="text-sm text-gray-600">To Metro</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{selectedProperty.schoolDistance}km</div>
                          <div className="text-sm text-gray-600">To Schools</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-lg font-bold text-red-600">{selectedProperty.hospitalDistance}km</div>
                          <div className="text-sm text-gray-600">To Hospital</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">{selectedProperty.walkabilityScore}</div>
                          <div className="text-sm text-gray-600">Walk Score</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">{selectedProperty.mallDistance}km</div>
                          <div className="text-sm text-gray-600">To Mall</div>
                        </div>
                        <div className="text-center p-3 bg-cyan-50 rounded-lg">
                          <div className="text-lg font-bold text-cyan-600">{selectedProperty.beachDistance}km</div>
                          <div className="text-sm text-gray-600">To Beach</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Construction Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Construction className="h-5 w-5 mr-2" />
                      Construction Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Progress</span>
                        <span className="font-semibold">{selectedProperty.constructionStatus}%</span>
                      </div>
                      <Progress value={selectedProperty.constructionStatus} className="h-3" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Completion Date:</span>
                        <span className="font-medium">{selectedProperty.completionDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedProperty.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unit Types:</span>
                      <span className="font-medium">{selectedProperty.unitTypes.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per Sq Ft:</span>
                      <span className="font-medium">AED {selectedProperty.pricePerSqft.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Plan:</span>
                      <span className="font-medium">{selectedProperty.paymentPlan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Units Left:</span>
                      <span className={`font-medium ${getUnitsLeftColor(selectedProperty.unitsLeft)}`}>
                        {selectedProperty.unitsLeft}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Additional Fees:</span>
                      <span className="font-medium">{selectedProperty.fees}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Developer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Developer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{selectedProperty.developer}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{selectedProperty.developerRating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Community Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Community Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.communityFeatures.map((feature: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Nearby Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Nearby Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedProperty.nearbyAmenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Project
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline">
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Property
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}