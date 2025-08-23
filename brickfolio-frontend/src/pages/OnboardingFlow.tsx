import { useNavigate } from 'react-router-dom';
import { FullScreenLayout } from '../components/FullScreenLayout';
import { OnboardingFlow as OnboardingFlowComponent } from '../components/OnboardingFlow';

export default function OnboardingFlowPage() {
  const navigate = useNavigate();

  const handleOnboardingComplete = (data: any) => {
    console.log('User onboarding completed:', data);
    // In a real app, this would save to database and redirect to personalized map
    navigate('/map', { state: { userPreferences: data } });
  };

  return (
    <FullScreenLayout>
      <OnboardingFlowComponent onComplete={handleOnboardingComplete} />
    </FullScreenLayout>
  );
}
