import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MapView as MapViewComponent } from '../components/MapView';

export default function MapViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userPreferences = location.state?.userPreferences || null;

  const closeMapView = () => {
    navigate('/');
  };

  const handleMapViewClick = () => {
    // Already on map view, do nothing or refresh
    window.location.reload();
  };

  const handleDevelopersClick = () => {
    navigate('/developers');
  };

  const handleSignUpClick = () => {
    navigate('/onboarding');
  };

  return (
    <Layout 
      isAuthenticated={true}
      onSignUpClick={handleSignUpClick}
      onDevelopersClick={handleDevelopersClick}
      onMapViewClick={handleMapViewClick}
    >
      <MapViewComponent userPreferences={userPreferences} onClose={closeMapView} />
    </Layout>
  );
}
