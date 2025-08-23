import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  return (
    <Router>
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