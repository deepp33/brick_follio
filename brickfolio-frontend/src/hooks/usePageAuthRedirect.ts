import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './redux';

interface UsePageAuthRedirectOptions {
  redirectDelay?: number; // in milliseconds, default 30000 (30 seconds)
  redirectPath?: string; // default '/onboarding'
  enabled?: boolean; // default true
  pageName?: string; // for logging purposes
  showWarning?: boolean; // show console warning when redirect is about to happen
}

export function usePageAuthRedirect({
  redirectDelay = 30000,
  redirectPath = '/onboarding',
  enabled = true,
  pageName = 'Current Page',
  showWarning = true
}: UsePageAuthRedirectOptions = {}) {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInteractedRef = useRef(false);

  // Track user interactions to reset the timer
  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    
    if (!isAuthenticated && !loading && enabled) {
      // Show warning 5 seconds before redirect
      if (showWarning) {
        warningTimeoutRef.current = setTimeout(() => {
          console.warn(`⚠️ ${pageName}: Redirecting to ${redirectPath} in 5 seconds. User interaction will reset the timer.`);
        }, redirectDelay - 5000);
      }
      
      timeoutRef.current = setTimeout(() => {
        // Only redirect if user hasn't interacted and is still not authenticated
        if (!hasInteractedRef.current) {
          console.log(`🔄 ${pageName}: Auto-redirecting to ${redirectPath} after ${redirectDelay / 1000} seconds of inactivity`);
          navigate(redirectPath);
        }
      }, redirectDelay);
    }
  };

  // Set up event listeners for user interactions
  useEffect(() => {
    if (!enabled || isAuthenticated || loading) {
      return;
    }

    const handleUserInteraction = () => {
      hasInteractedRef.current = true;
      resetTimer();
    };

    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { passive: true });
    });

    // Start the initial timer
    resetTimer();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [isAuthenticated, loading, enabled, redirectDelay, redirectPath, navigate, pageName, showWarning]);

  // Reset timer when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      // User is now authenticated, clear timer and reset interaction flag
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
      
      hasInteractedRef.current = false;
    } else if (!loading && enabled) {
      // User is not authenticated, start timer
      resetTimer();
    }
  }, [isAuthenticated, loading, enabled, redirectDelay, redirectPath, navigate, pageName, showWarning]);

  return {
    isRedirecting: !isAuthenticated && !loading && enabled,
    timeRemaining: null, // Could be enhanced to show countdown
    resetTimer,
    hasInteracted: hasInteractedRef.current
  };
}
