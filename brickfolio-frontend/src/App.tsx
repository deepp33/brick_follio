import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthRedirectBanner } from './components/AuthRedirectBanner';
import { useAuthRedirect } from './hooks/useAuthRedirect';
import {
  Home,
  OnboardingFlowPage,
  MapViewPage,
  PropertyListingPage,
  DeveloperListingPage,
  DeveloperProfilePage,
  MarketAnalyticsPage,
  ContactPage,
  NotFound
} from './pages';

export default function App() {
  // Initialize auth redirect hook
  useAuthRedirect({
    redirectDelay: 30000, // 30 seconds
    redirectPath: '/onboarding',
    enabled: true
  });

  return (
    <Router>
      {/* Auth Redirect Banner - shows countdown for non-authenticated users */}
      <AuthRedirectBanner 
        redirectDelay={30000}
        redirectPath="/onboarding"
        enabled={true}
        showCountdown={true}
      />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<OnboardingFlowPage />} />
        <Route path="/map" element={<MapViewPage />} />
        <Route path="/properties" element={<PropertyListingPage />} />
        <Route path="/developers" element={<DeveloperListingPage />} />
        <Route path="/developer/:id" element={<DeveloperProfilePage />} />
        <Route path="/market-analytics" element={<MarketAnalyticsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}