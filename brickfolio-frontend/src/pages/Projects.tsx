import { useAppSelector } from '../hooks/redux';
import { usePageAuthRedirect } from '../hooks/usePageAuthRedirect';
import { getPageConfig } from '../config/authRedirect';
import { Layout } from '../components/Layout';
import { ProjectsList } from '../components/ProjectsList';

export default function Projects() {
  const { projects, total } = useAppSelector((state) => state.projects);

  // Use page-specific auth redirect with configuration
  const projectsConfig = getPageConfig('PROJECTS');
  usePageAuthRedirect({
    ...projectsConfig,
    pageName: 'Projects Page'
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Projects</h1>
          <p className="text-gray-600 mb-6">
            Explore all available real estate investment opportunities in Dubai
          </p>
          {total > 0 && (
            <p className="text-sm text-gray-500">
              Showing {projects.length} of {total} projects
            </p>
          )}
        </div>
        <ProjectsList />
      </div>
    </Layout>
  );
}
