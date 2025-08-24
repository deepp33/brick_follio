import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { X, Clock, Target } from 'lucide-react';

interface QuestionnaireCountdownProps {
  onSkip: () => void;
  onStartNow: () => void;
}

export function QuestionnaireCountdown({ onSkip, onStartNow }: QuestionnaireCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsVisible(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!isVisible) return null;

  const progress = ((30 - timeLeft) / 30) * 100;

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-in slide-in-from-bottom-2 duration-300">
      <Card className="w-80 shadow-lg border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Personalized Experience</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-blue-800 mb-3">
            Complete a quick questionnaire to get personalized property recommendations in {timeLeft} seconds
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-blue-700">
              <span>Time remaining</span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {timeLeft}s
              </span>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={onStartNow}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Now
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onSkip}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                Skip
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
