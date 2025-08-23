import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { usePageAuthRedirect } from '../hooks/usePageAuthRedirect';
import { getPageConfig } from '../config/authRedirect';
import { Layout } from '../components/Layout';
import { ProjectsList } from '../components/ProjectsList';
import { PageLoader } from '../components/ui/loader';

export default function Projects() {
  const dispatch = useAppDispatch();

  // Use page-specific auth redirect with configuration
  const projectsConfig = getPageConfig('PROJECTS');
  usePageAuthRedirect({
    ...projectsConfig,
    pageName: 'Projects Page'
  });

  const { projects, loading, error } = useAppSelector((state) => state.projects);

  if (loading) {
    return (
      <Layout>
        <PageLoader text="Loading projects..." icon="building" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Projects</h2>
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
      <ProjectsList projects={projects} />
    </Layout>
  );
}
