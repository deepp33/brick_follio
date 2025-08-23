import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { usePageAuthRedirect } from '../hooks/usePageAuthRedirect';
import { getPageConfig } from '../config/authRedirect';
import { Layout } from '../components/Layout';
import { DeveloperProfile as DeveloperProfileComponent } from '../components/DeveloperProfile';
import { PageLoader } from '../components/ui/loader';
import { getDeveloperProfile } from '../features/users/usersSlice';

export default function DeveloperProfile() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Use page-specific auth redirect with configuration
  const developerProfileConfig = getPageConfig('DEVELOPER_PROFILE');
  usePageAuthRedirect({
    ...developerProfileConfig,
    pageName: 'Developer Profile Page'
  });

  // Access developers from the users slice
  const { developers, selectedDeveloper, loading, error } = useAppSelector((state) => state.users);
  
  // Try to find developer in the developers array first, then use selectedDeveloper
  const developer = developers.find(dev => dev._id === id) || selectedDeveloper;

  // Fetch developer profile if not found in current state
  useEffect(() => {
    if (id && !developer) {
      dispatch(getDeveloperProfile(id));
    }
  }, [id, developer, dispatch]);

  if (loading) {
    return (
      <Layout>
        <PageLoader text="Loading developer profile..." icon="user" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Developer Profile</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!developer) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Developer Not Found</h2>
            <p className="text-gray-500 mb-4">The developer you're looking for doesn't exist.</p>
            <button 
              onClick={() => window.history.back()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <DeveloperProfileComponent developer={developer} />
    </Layout>
  );
}
