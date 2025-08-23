import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { HeroSection } from '../components/HeroSection';
import { FeaturedProjects } from '../components/FeaturedProjects';
import { TopDevelopers } from '../components/TopDevelopers';
import { InteractiveMap } from '../components/InteractiveMap';
import { MarketInsights } from '../components/MarketInsights';
import { CalculatorTools } from '../components/CalculatorTools';
import { NewsSection } from '../components/NewsSection';
import { ReviewsSection } from '../components/ReviewsSection';

export default function Home() {
  const navigate = useNavigate();
  const [userPreferences, setUserPreferences] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const startOnboarding = () => {
    navigate('/onboarding');
  };

  const openMapView = () => {
    navigate('/map');
  };

  const openDeveloperProfile = (developer: any) => {
    navigate(`/developer/${developer.id}`, { state: { developer } });
  };

  const openPropertyListing = () => {
    navigate('/properties');
  };

  const openDeveloperListing = () => {
    navigate('/developers');
  };

  const openMarketAnalytics = () => {
    navigate('/market-analytics');
  };

  return (
    <Layout isAuthenticated={isAuthenticated}>
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
    </Layout>
  );
}
