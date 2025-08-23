import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { QuestionnaireModal } from '../components/QuestionnaireModal';
import { QuestionnaireCountdown } from '../components/QuestionnaireCountdown';

export default function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [hasShownQuestionnaire, setHasShownQuestionnaire] = useState(false);

  // Check if user has already seen the questionnaire in this session
  useEffect(() => {
    const hasSeenQuestionnaire = sessionStorage.getItem('hasSeenQuestionnaire');
    if (!hasSeenQuestionnaire) {
      // Show countdown immediately
      setShowCountdown(true);
      
      // Set timer for 30 seconds
      const timer = setTimeout(() => {
        setShowQuestionnaire(true);
        setShowCountdown(false);
        setHasShownQuestionnaire(true);
        sessionStorage.setItem('hasSeenQuestionnaire', 'true');
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, []);

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

  const handleQuestionnaireClose = () => {
    setShowQuestionnaire(false);
  };

  const handleQuestionnaireComplete = (data: any) => {
    // Handle questionnaire completion
    console.log('Questionnaire completed:', data);
    
    // Navigate to map view with user preferences
    navigate('/map', { 
      state: { 
        userPreferences: {
          budget: { min: data.budget[0] * 0.8, max: data.budget[0] * 1.2 },
          investmentGoal: data.investmentGoal,
          riskTolerance: data.riskAppetite,
          propertyType: data.propertyTypes[0] || 'apartment',
          locations: data.locationPreferences,
          roiTarget: data.roiTarget[0],
          rentalYield: data.rentalYield[0]
        }
      }
    });
    
    setShowQuestionnaire(false);
  };

  const handleCountdownSkip = () => {
    setShowCountdown(false);
    sessionStorage.setItem('hasSeenQuestionnaire', 'true');
  };

  const handleStartNow = () => {
    setShowCountdown(false);
    setShowQuestionnaire(true);
    sessionStorage.setItem('hasSeenQuestionnaire', 'true');
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
      
      {/* Questionnaire Countdown */}
      {showCountdown && (
        <QuestionnaireCountdown
          onSkip={handleCountdownSkip}
          onStartNow={handleStartNow}
        />
      )}
      
      {/* Questionnaire Modal */}
      <QuestionnaireModal
        isOpen={showQuestionnaire}
        onClose={handleQuestionnaireClose}
        onComplete={handleQuestionnaireComplete}
      />
    </Layout>
  );
}
