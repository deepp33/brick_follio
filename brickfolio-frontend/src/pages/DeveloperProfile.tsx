import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { usePageAuthRedirect } from '../hooks/usePageAuthRedirect';
import { getPageConfig } from '../config/authRedirect';
import { Layout } from '../components/Layout';
import { DeveloperProfile as DeveloperProfileComponent } from '../components/DeveloperProfile';
import { PageLoader } from '../components/ui/loader';
import { getDeveloperProfile, getDevelopers } from '../features/users/usersSlice';
import { useEffect } from 'react';

export default function DeveloperProfile() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Use page-specific auth redirect with configuration
  const developerProfileConfig = getPageConfig('DEVELOPER_PROFILE');
  usePageAuthRedirect({
    ...developerProfileConfig,
    pageName: 'Developer Profile Page'
  });

  const { developers, loading, error } = useAppSelector((state) => state.users);

  // Fetch developers when component mounts
  useEffect(() => {
    // dispatch(getDevelopers());
    if (id) {
      dispatch(getDeveloperProfile(id));
    }
  }, [id]);

  const developer = developers.find(dev => dev._id === id);

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

  // if (!developer) {
  //   return (
  //     <Layout>
  //       <div className="min-h-screen flex items-center justify-center">
  //         <div className="text-center">
  //           <h2 className="text-2xl font-bold text-gray-600 mb-4">Developer Not Found</h2>
  //           <p className="text-gray-500 mb-4">The developer you're looking for doesn't exist.</p>
  //           <button 
  //             onClick={() => window.history.back()} 
  //             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  //           >
  //             Go Back
  //           </button>
  //         </div>
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      <DeveloperProfileComponent 
        developerId={id!} 
        onClose={() => window.history.back()} 
      />
    </Layout>
  );
}
