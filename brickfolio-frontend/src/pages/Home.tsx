import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageAuthRedirect } from '../hooks/usePageAuthRedirect';
import { getPageConfig } from '../config/authRedirect';
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
import { AuthRedirectBanner } from '../components';

export default function Home() {
  const navigate = useNavigate();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showOnboardingRedirect, setShowOnboardingRedirect] = useState(false);
  const [onboardingCountdown, setOnboardingCountdown] = useState(30);

  // Check if user has auth token (logged in user)
  const authToken = localStorage.getItem('authToken');
  const isAuthenticated = !!authToken;

  // Check if user has already seen the questionnaire in this session
  useEffect(() => {
    const hasSeenQuestionnaire = sessionStorage.getItem('hasSeenQuestionnaire');
    if (!hasSeenQuestionnaire && !isAuthenticated) {
      // Show countdown immediately
      setShowCountdown(true);
      
      // Set timer for 30 seconds
      const timer = setTimeout(() => {
        setShowQuestionnaire(true);
        setShowCountdown(false);
        sessionStorage.setItem('hasSeenQuestionnaire', 'true');
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Check for new users without auth token and redirect to onboarding (ONLY on home page)
  useEffect(() => {
    // Only show countdown on Home page and for unauthenticated users
    if (!isAuthenticated && window.location.pathname === '/') {
      // Check if user has already been redirected in this session
      const hasBeenRedirected = sessionStorage.getItem('hasBeenRedirectedToOnboarding');
      
      if (!hasBeenRedirected) {
        // Show onboarding redirect countdown
        setShowOnboardingRedirect(true);
        
        // Start countdown for onboarding redirect
        const countdownInterval = setInterval(() => {
          setOnboardingCountdown((prev) => {
            if (prev <= 1) {
              // Redirect to onboarding after 30 seconds
              sessionStorage.setItem('hasBeenRedirectedToOnboarding', 'true');
              navigate('/onboarding');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(countdownInterval);
      }
    }
  }, [isAuthenticated, navigate]);

  // Use page-specific auth redirect with configuration
  const homeConfig = getPageConfig('HOME');
  usePageAuthRedirect({
    ...homeConfig,
    pageName: 'Home Page'
  });

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

  const handleOnboardingRedirectSkip = () => {
    setShowOnboardingRedirect(false);
    sessionStorage.setItem('hasBeenRedirectedToOnboarding', 'true');
  };

  const handleOnboardingRedirectNow = () => {
    setShowOnboardingRedirect(false);
    sessionStorage.setItem('hasBeenRedirectedToOnboarding', 'true');
    navigate('/onboarding');
  };

  return (
    <Layout>
      <HeroSection onGetStartedClick={handleGetStarted} />
      <TopDevelopers onViewAllClick={handleViewAllDevelopers} onDeveloperClick={handleDeveloperClick} />
      <FeaturedProjects onViewAllClick={handleViewAllProjects} />
      <MarketInsights />
      <NewsSection />
      <CalculatorTools />
      <ReviewsSection />
      {/* <Footer /> */}
      <AuthRedirectBanner
        redirectDelay={30000}
        redirectPath="/onboarding"
        enabled={true}
        showCountdown={true}
      />
      
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
