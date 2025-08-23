import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/redux';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { Button } from './ui/button';
import { X, Clock, UserPlus } from 'lucide-react';

interface AuthRedirectBannerProps {
  redirectDelay?: number;
  redirectPath?: string;
  enabled?: boolean;
  showCountdown?: boolean;
}

export function AuthRedirectBanner({
  redirectDelay = 30000,
  redirectPath = '/onboarding',
  enabled = true,
  showCountdown = true
}: AuthRedirectBannerProps) {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [timeRemaining, setTimeRemaining] = useState(redirectDelay);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const { isRedirecting } = useAuthRedirect({
    redirectDelay,
    redirectPath,
    enabled
  });

  // Show banner after 5 seconds if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading && enabled && !isDismissed) {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 5000); // Show banner after 5 seconds

      return () => clearTimeout(showTimer);
    } else {
      setIsVisible(false);
    }
  }, [isAuthenticated, loading, enabled, isDismissed]);

  // Countdown timer
  useEffect(() => {
    if (!isVisible || !showCountdown || isAuthenticated || loading) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, showCountdown, isAuthenticated, loading]);

  // Reset countdown when user interacts
  useEffect(() => {
    if (isVisible && !isAuthenticated && !loading) {
      setTimeRemaining(redirectDelay);
    }
  }, [isVisible, isAuthenticated, loading, redirectDelay]);

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleGetStarted = () => {
    window.location.href = redirectPath;
  };

  if (!isVisible || isAuthenticated || loading) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <UserPlus className="w-5 h-5" />
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                Get started with your real estate investment journey
              </span>
              {showCountdown && (
                <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-mono">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetStarted}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Get Started
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
