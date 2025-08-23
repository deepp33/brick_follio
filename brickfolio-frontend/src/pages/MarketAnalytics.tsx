import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MarketAnalytics as MarketAnalyticsComponent } from '../components/MarketAnalytics';

export default function MarketAnalyticsPage() {
  const navigate = useNavigate();

  const closeMarketAnalytics = () => {
    navigate('/');
  };

  return (
    <Layout>
      <MarketAnalyticsComponent onClose={closeMarketAnalytics} />
    </Layout>
  );
}
