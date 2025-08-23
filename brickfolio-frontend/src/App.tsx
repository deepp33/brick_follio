import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedProjects } from './components/FeaturedProjects';
import { TopDevelopers } from './components/TopDevelopers';
import { InteractiveMap } from './components/InteractiveMap';
import { MarketInsights } from './components/MarketInsights';
import { MarketAnalytics } from './components/MarketAnalytics';
import { OnboardingFlow } from './components/OnboardingFlow';
import { MapView } from './components/MapView';
import { CalculatorTools } from './components/CalculatorTools';
import { NewsSection } from './components/NewsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { DeveloperProfile } from './components/DeveloperProfile';
import { PropertyListing } from './components/PropertyListing';
import { DeveloperListing } from './components/DeveloperListing';
import { Footer } from './components/Footer';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [showPropertyListing, setShowPropertyListing] = useState(false);
  const [showDeveloperListing, setShowDeveloperListing] = useState(false);
  const [showDeveloperProfile, setShowDeveloperProfile] = useState(false);
  const [showMarketAnalytics, setShowMarketAnalytics] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleOnboardingComplete = (data: any) => {
    setUserPreferences(data);
    setIsAuthenticated(true);
    setShowOnboarding(false);
    setShowMapView(true); // Redirect to map view after onboarding
    console.log('User onboarding completed:', data);
    // In a real app, this would save to database and redirect to personalized map
  };

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  const openMapView = () => {
    setShowMapView(true);
  };

  const closeMapView = () => {
    setShowMapView(false);
  };

  const openDeveloperProfile = (developer: any) => {
    setSelectedDeveloper(developer);
    setShowDeveloperProfile(true);
  };

  const closeDeveloperProfile = () => {
    setSelectedDeveloper(null);
    setShowDeveloperProfile(false);
  };

  const openPropertyListing = () => {
    setShowPropertyListing(true);
  };

  const closePropertyListing = () => {
    setShowPropertyListing(false);
  };

  const openDeveloperListing = () => {
    setShowDeveloperListing(true);
  };

  const closeDeveloperListing = () => {
    setShowDeveloperListing(false);
  };

  const openMarketAnalytics = () => {
    setShowMarketAnalytics(true);
  };

  const closeMarketAnalytics = () => {
    setShowMarketAnalytics(false);
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (showMapView) {
    return <MapView userPreferences={userPreferences} onClose={closeMapView} />;
  }

  if (showPropertyListing) {
    return <PropertyListing onClose={closePropertyListing} />;
  }

  if (showDeveloperListing) {
    return <DeveloperListing onClose={closeDeveloperListing} onDeveloperClick={openDeveloperProfile} />;
  }

  if (showDeveloperProfile && selectedDeveloper) {
    return <DeveloperProfile developer={selectedDeveloper} onClose={closeDeveloperProfile} />;
  }

  if (showMarketAnalytics) {
    return <MarketAnalytics onClose={closeMarketAnalytics} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSignUpClick={startOnboarding} 
        onDevelopersClick={openDeveloperListing}
        onMapViewClick={openMapView}
        isAuthenticated={isAuthenticated} 
      />
      
      <main>
        {/* Hero Section */}
        <section className="cursor-pointer">
          <HeroSection onGetStartedClick={startOnboarding} />
        </section>

        {/* Featured Content */}
        <FeaturedProjects onViewAllClick={openPropertyListing} />
        <TopDevelopers 
          onDeveloperClick={openDeveloperProfile} 
          onViewAllClick={openDeveloperListing}
        />
        
        {/* Interactive Map - Core Feature */}
        <InteractiveMap userPreferences={userPreferences} />
        
        {/* Market Insights */}
        <MarketInsights onViewAnalytics={openMarketAnalytics} />

        {/* Calculator Tools */}
        <CalculatorTools />

        {/* News Section */}
        <NewsSection />

        {/* Reviews and Testimonials */}
        <ReviewsSection />
      </main>

      <Footer />
    </div>
  );
}