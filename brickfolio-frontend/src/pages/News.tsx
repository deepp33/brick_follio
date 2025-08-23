import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { usePageAuthRedirect } from '../hooks/usePageAuthRedirect';
import { getPageConfig } from '../config/authRedirect';
import { Layout } from '../components/Layout';
import { NewsList } from '../components/NewsList';
import { PageLoader } from '../components/ui/loader';

export default function News() {
  const dispatch = useAppDispatch();

  // Use page-specific auth redirect with configuration
  const newsConfig = getPageConfig('NEWS');
  usePageAuthRedirect({
    ...newsConfig,
    pageName: 'News Page'
  });

  const { news, loading, error } = useAppSelector((state) => state.news);

  if (loading) {
    return (
      <Layout>
        <PageLoader text="Loading news..." icon="newspaper" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading News</h2>
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
      <NewsList news={news} />
    </Layout>
  );
}
