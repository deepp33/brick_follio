import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { DeveloperProfile as DeveloperProfileComponent } from '../components/DeveloperProfile';

export default function DeveloperProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const developer = location.state?.developer || null;

  const closeDeveloperProfile = () => {
    navigate('/');
  };

  // Use the ID from URL params, fallback to developer from state
  const developerId = id || developer?._id;

  if (!developerId) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Developer Not Found</h1>
            <p className="mb-4">The developer you're looking for doesn't exist.</p>
            <button 
              onClick={closeDeveloperProfile}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <DeveloperProfileComponent developerId={developerId} onClose={closeDeveloperProfile} />
    </Layout>
  );
}
