import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  onSignUpClick?: () => void;
  onDevelopersClick?: () => void;
  onMapViewClick?: () => void;
}

export function Layout({ 
  children, 
  isAuthenticated = false,
  onSignUpClick,
  onDevelopersClick,
  onMapViewClick
}: LayoutProps) {
  const navigate = useNavigate();

  const defaultOnSignUpClick = () => {
    navigate('/onboarding');
  };

  const defaultOnDevelopersClick = () => {
    navigate('/developers');
  };

  const defaultOnMapViewClick = () => {
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <Header 
        onSignUpClick={onSignUpClick || defaultOnSignUpClick}
        onDevelopersClick={onDevelopersClick || defaultOnDevelopersClick}
        onMapViewClick={onMapViewClick || defaultOnMapViewClick}
        isAuthenticated={isAuthenticated}
      />
      
      {/* Main Content - Takes remaining space */}
      <main className="flex-1">
        {children}
      </main>

      {/* Fixed Footer */}
      <Footer />
    </div>
  );
}
