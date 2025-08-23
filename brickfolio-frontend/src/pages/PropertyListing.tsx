import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PropertyListing as PropertyListingComponent } from '../components/PropertyListing';

export default function PropertyListingPage() {
  const navigate = useNavigate();

  const closePropertyListing = () => {
    navigate('/');
  };

  return (
    <Layout>
      <PropertyListingComponent onClose={closePropertyListing} />
    </Layout>
  );
}
