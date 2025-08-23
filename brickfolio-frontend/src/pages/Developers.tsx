import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { usePageAuthRedirect } from '../hooks/usePageAuthRedirect';
import { getPageConfig } from '../config/authRedirect';
import { Layout } from '../components/Layout';
import { DeveloperListing } from '../components/DeveloperListing';
import { PageLoader } from '../components/ui/loader';
import { getDevelopers } from '../features/users/usersSlice';
import { useEffect } from 'react';

export default function Developers() {
  const dispatch = useAppDispatch();

  // Use page-specific auth redirect with configuration
  const developersConfig = getPageConfig('DEVELOPERS');
  usePageAuthRedirect({
    ...developersConfig,
    pageName: 'Developers Page'
  });

  const { developers, loading, error } = useAppSelector((state) => state.users);

  // Fetch developers when component mounts
  useEffect(() => {
    if (developers.length === 0) {
      dispatch(getDevelopers());
    }
  }, [dispatch, developers.length]);

  if (loading) {
    return (
      <Layout>
        <PageLoader text="Loading developers..." icon="users" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Developers</h2>
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

  return (
    <Layout>
      <DeveloperListing 
        onClose={() => window.history.back()} 
        onDeveloperClick={(developer) => {
          // Navigate to developer profile
          window.location.href = `/developer/${developer._id}`;
        }} 
      />
    </Layout>
  );
}
