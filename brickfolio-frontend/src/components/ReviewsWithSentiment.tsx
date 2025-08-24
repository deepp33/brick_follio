import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  Star, 
  CheckCircle, 
  TrendingUp, 
  Smile, 
  Frown, 
  Meh 
} from 'lucide-react';

interface Review {
  id: number;
  investor: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  project: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface DeveloperData {
  rating?: number;
  reraCertified?: boolean;
  legalStanding?: {
    clientLegal?: string;
  };
  employeeCount?: number;
  deliveryTrackRecord?: {
    onTime?: number;
  };
  compliance?: {
    complianceScore?: number;
  };
  certifications?: string[];
  avgROI?: number;
  activeProjects?: number;
  reviews?: Review[];
  // Additional properties from the actual developer data
  developerProfile?: {
    rating?: number;
    reraCertified?: boolean;
    employeeCount?: number;
    deliveryTrackRecord?: {
      onTime?: number;
    };
    compliance?: {
      complianceScore?: number;
    };
    certifications?: string[];
    avgROI?: number;
    activeProjects?: number;
  };
}

interface ReviewsWithSentimentProps {
  developer: DeveloperData;
}

// Sentiment analysis function
const analyzeSentiment = (comment: string): 'positive' | 'negative' | 'neutral' => {
  const positiveWords = ['excellent', 'amazing', 'great', 'good', 'wonderful', 'fantastic', 'outstanding', 'perfect', 'love', 'happy', 'satisfied', 'impressed', 'recommend', 'best', 'top', 'quality', 'professional', 'reliable', 'trustworthy', 'outstanding', 'fantastic', 'excellent', 'amazing'];
  const negativeWords = ['terrible', 'awful', 'bad', 'poor', 'disappointing', 'horrible', 'worst', 'hate', 'unhappy', 'dissatisfied', 'disappointed', 'avoid', 'problem', 'issue', 'delay', 'late', 'unprofessional', 'unreliable', 'horrible', 'terrible', 'awful', 'worst', 'avoid'];
  
  const words = comment.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// Prepare pie chart data for developer metrics
const prepareMetricsData = (developerData: DeveloperData) => {
  // Get values from either direct properties or nested developerProfile
  const rating = developerData.rating || developerData.developerProfile?.rating || 0;
  const reraCertified = developerData.reraCertified || developerData.developerProfile?.reraCertified || false;
  const employeeCount = developerData.employeeCount || developerData.developerProfile?.employeeCount || 0;
  const deliveryOnTime = developerData.deliveryTrackRecord?.onTime || developerData.developerProfile?.deliveryTrackRecord?.onTime || 0;
  const complianceScore = developerData.compliance?.complianceScore || developerData.developerProfile?.compliance?.complianceScore || 0;
  const certifications = developerData.certifications || developerData.developerProfile?.certifications || [];
  const avgROI = developerData.avgROI || developerData.developerProfile?.avgROI || 0;
  const activeProjects = developerData.activeProjects || developerData.developerProfile?.activeProjects || 0;

  const data = [
    { name: 'Rating', value: Math.min(rating * 20, 100), color: '#10B981' },
    { name: 'RERA Certified', value: reraCertified ? 100 : 0, color: '#3B82F6' },
    { name: 'Legal Standing', value: developerData.legalStanding?.clientLegal === 'Clear' ? 100 : 50, color: '#8B5CF6' },
    { name: 'Employee Count', value: Math.min(employeeCount / 10, 100), color: '#F59E0B' },
    { name: 'Delivery Track', value: deliveryOnTime, color: '#EF4444' },
    { name: 'Compliance', value: complianceScore, color: '#06B6D4' },
    { name: 'Certifications', value: Math.min(certifications.length * 20, 100), color: '#84CC16' },
    { name: 'Avg ROI', value: Math.min(avgROI * 10, 100), color: '#EC4899' },
    { name: 'Active Projects', value: Math.min(activeProjects * 5, 100), color: '#F97316' }
  ];
  
  return data.filter(item => item.value > 0);
};

// Prepare sentiment data for pie chart
const prepareSentimentData = (reviews: Review[]) => {
  const sentimentCounts = {
    positive: 0,
    negative: 0,
    neutral: 0
  };
  
  reviews.forEach(review => {
    const sentiment = review.sentiment || analyzeSentiment(review.comment);
    sentimentCounts[sentiment]++;
  });
  
  return [
    { name: 'Positive', value: sentimentCounts.positive, color: '#10B981' },
    { name: 'Negative', value: sentimentCounts.negative, color: '#EF4444' },
    { name: 'Neutral', value: sentimentCounts.neutral, color: '#6B7280' }
  ].filter(item => item.value > 0);
};

// Render stars function
const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
      }`}
    />
  ));
};

export function ReviewsWithSentiment({ developer }: ReviewsWithSentimentProps) {
  const reviews = developer.reviews || [];

  return (
    <div className="space-y-6">
      {/* Sentiment Analysis and Metrics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Developer Metrics Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Developer Metrics Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareMetricsData(developer)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareMetricsData(developer).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Analysis Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smile className="h-5 w-5 mr-2 text-green-600" />
              Review Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareSentimentData(reviews)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareSentimentData(reviews).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List with Sentiment */}
      {reviews.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => {
              const sentiment = review.sentiment || analyzeSentiment(review.comment);
              return (
                <Card key={review.id}>
                  <CardContent className="p-6">
                                         <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                           <span className="text-white font-semibold text-sm">
                             {review.investor.split(' ').map(n => n[0]).join('')}
                           </span>
                         </div>
                         <div>
                           <h4 className="font-semibold">{review.investor}</h4>
                           <div className="flex items-center space-x-2">
                             <div className="flex items-center space-x-1">
                               {renderStars(review.rating)}
                               <span className="text-sm text-gray-600">({review.rating}/5)</span>
                             </div>
                             <span className="text-xs text-gray-500">•</span>
                             <span className="text-xs text-gray-500">{review.date}</span>
                           </div>
                         </div>
                       </div>
                       <div className="flex items-center space-x-2">
                         {review.verified && (
                           <Badge className="bg-green-100 text-green-800">
                             <CheckCircle className="h-3 w-3 mr-1" />
                             Verified
                           </Badge>
                         )}
                         <Badge 
                           className={
                             sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                             sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                             'bg-gray-100 text-gray-800'
                           }
                         >
                           {sentiment === 'positive' && <Smile className="h-3 w-3 mr-1" />}
                           {sentiment === 'negative' && <Frown className="h-3 w-3 mr-1" />}
                           {sentiment === 'neutral' && <Meh className="h-3 w-3 mr-1" />}
                           {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                         </Badge>
                       </div>
                     </div>
                    
                                         <p className="text-gray-600 mb-3">"{review.comment}"</p>
                     
                                          <div className="text-sm text-gray-500">
                       <span className="font-medium">{review.project}</span> • Verified Purchase
                     </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button variant="outline">
              Load More Reviews
            </Button>
          </div>
        </>
      ) : (
        <Card className="p-12 text-center">
          <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Available</h3>
          <p className="text-gray-600">Customer reviews will appear here once available.</p>
        </Card>
      )}
    </div>
  );
}
