import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { usePageAuthRedirect } from '../hooks/usePageAuthRedirect';
import { getPageConfig } from '../config/authRedirect';
import { Layout } from '../components/Layout';
import { DevelopersList } from '../components/DevelopersList';
import { PageLoader } from '../components/ui/loader';

export default function Developers() {
  const dispatch = useAppDispatch();

  // Use page-specific auth redirect with configuration
  const developersConfig = getPageConfig('DEVELOPERS');
  usePageAuthRedirect({
    ...developersConfig,
    pageName: 'Developers Page'
  });

  const { developers, loading, error } = useAppSelector((state) => state.developers);

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
      <DevelopersList developers={developers} />
    </Layout>
  );
}
