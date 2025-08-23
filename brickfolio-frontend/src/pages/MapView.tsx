import { useLocation, useNavigate } from 'react-router-dom';
import { FullScreenLayout } from '../components/FullScreenLayout';
import { MapView as MapViewComponent } from '../components/MapView';

export default function MapViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userPreferences = location.state?.userPreferences || null;

  const closeMapView = () => {
    navigate('/');
  };

  return (
    <FullScreenLayout>
      <MapViewComponent userPreferences={userPreferences} onClose={closeMapView} />
    </FullScreenLayout>
  );
}
