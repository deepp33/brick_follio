import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { Layout } from '../components/Layout';
import { HeroSection } from '../components/HeroSection';
import { FeaturedProjects } from '../components/FeaturedProjects';
import { NewsSection } from '../components/NewsSection';
import { MarketInsights } from '../components/MarketInsights';
import { TopDevelopers } from '../components/TopDevelopers';
import { ReviewsSection } from '../components/ReviewsSection';
import { CalculatorTools } from '../components/CalculatorTools';
import { Footer } from '../components/Footer';

export default function Home() {
  const dispatch = useAppDispatch();

  const handleViewAllProjects = () => {
    // Navigate to projects page
    window.location.href = '/projects';
  };

  const handleGetStarted = () => {
    // Navigate to onboarding
    window.location.href = '/onboarding';
  };

  const handleViewAllDevelopers = () => {
    // Navigate to developers page
    window.location.href = '/developers';
  };

  const handleDeveloperClick = (developer: any) => {
    // Navigate to developer profile
    window.location.href = `/developer/${developer._id}`;
  };

  return (
    <Layout>
      <HeroSection onGetStartedClick={handleGetStarted} />
      <FeaturedProjects onViewAllClick={handleViewAllProjects} />
      <MarketInsights />
      <NewsSection />
      <TopDevelopers onViewAllClick={handleViewAllDevelopers} onDeveloperClick={handleDeveloperClick} />
      <CalculatorTools />
      <ReviewsSection />
      <Footer />
    </Layout>
  );
}
