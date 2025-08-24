import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  isAuthenticated: propIsAuthenticated,
  onSignUpClick,
  onDevelopersClick,
  onMapViewClick
}: LayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for auth token in localStorage
  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = localStorage.getItem('authToken');
      const hasToken = !!authToken;
      setIsAuthenticated(hasToken);
    };

    // Check on mount
    checkAuthStatus();

    // Listen for storage changes (when token is added/removed)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check when window gains focus (in case token was added in another tab)
    const handleFocus = () => {
      checkAuthStatus();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Use prop value if provided, otherwise use localStorage check
  const finalIsAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : isAuthenticated;
  const navigate = useNavigate();
  const location = useLocation();
  const isMapPage = location.pathname === '/map';

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
    <div className={`min-h-screen bg-background flex flex-col ${isMapPage ? 'h-screen' : ''}`}>
      {/* Fixed Header */}
      <Header 
        onSignUpClick={onSignUpClick || defaultOnSignUpClick}
        onDevelopersClick={onDevelopersClick || defaultOnDevelopersClick}
        onMapViewClick={onMapViewClick || defaultOnMapViewClick}
        isAuthenticated={finalIsAuthenticated}
      />
      
      {/* Main Content - Takes remaining space */}
      <main className={`flex-1 ${isMapPage ? 'h-full overflow-hidden' : ''}`}>
        {children}
      </main>

      {/* Fixed Footer */}
      {!isMapPage && <Footer />}
    </div>
  );
}
