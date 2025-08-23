import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { DeveloperListing as DeveloperListingComponent } from '../components/DeveloperListing';

export default function DeveloperListingPage() {
  const navigate = useNavigate();

  const closeDeveloperListing = () => {
    navigate('/');
  };

  const openDeveloperProfile = (developer: any) => {
    navigate(`/developer/${developer._id}`, { state: { developer } });
  };

  return (
    <Layout>
      <DeveloperListingComponent 
        onClose={closeDeveloperListing} 
        onDeveloperClick={openDeveloperProfile} 
      />
    </Layout>
  );
}
