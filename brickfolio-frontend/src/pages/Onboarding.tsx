import { usePageAuthRedirect } from '../hooks/usePageAuthRedirect';
import { getPageConfig } from '../config/authRedirect';
import { Layout } from '../components/Layout';
import { OnboardingForm } from '../components/OnboardingForm';

export default function Onboarding() {
  // Use page-specific auth redirect with configuration
  const onboardingConfig = getPageConfig('ONBOARDING');
  usePageAuthRedirect({
    ...onboardingConfig,
    pageName: 'Onboarding Page'
  });

  return (
    <Layout>
      <OnboardingForm />
    </Layout>
  );
}
