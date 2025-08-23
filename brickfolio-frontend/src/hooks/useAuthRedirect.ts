import { useEffect, useRef } from 'react';
import { useAppSelector } from './redux';

interface UseAuthRedirectOptions {
  redirectDelay?: number; // in milliseconds, default 30000 (30 seconds)
  redirectPath?: string; // default '/onboarding'
  enabled?: boolean; // default true
}

export function useAuthRedirect({
  redirectDelay = 30000,
  redirectPath = '/onboarding',
  enabled = true
}: UseAuthRedirectOptions = {}) {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInteractedRef = useRef(false);

  // Track user interactions to reset the timer
  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (!isAuthenticated && !loading && enabled) {
      timeoutRef.current = setTimeout(() => {
        // Only redirect if user hasn't interacted and is still not authenticated
        if (!hasInteractedRef.current) {
          window.location.href = redirectPath;
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
    };
  }, [isAuthenticated, loading, enabled, redirectDelay, redirectPath]);

  // Reset timer when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      // User is now authenticated, clear timer and reset interaction flag
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      hasInteractedRef.current = false;
    } else if (!loading && enabled) {
      // User is not authenticated, start timer
      resetTimer();
    }
  }, [isAuthenticated, loading, enabled, redirectDelay, redirectPath]);

  return {
    isRedirecting: !isAuthenticated && !loading && enabled,
    timeRemaining: null, // Could be enhanced to show countdown
    resetTimer
  };
}
