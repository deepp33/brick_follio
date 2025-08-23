// Auth Redirect Configuration
export const AUTH_REDIRECT_CONFIG = {
  // Default settings
  DEFAULT_REDIRECT_DELAY: 30000, // 30 seconds in milliseconds
  DEFAULT_REDIRECT_PATH: '/onboarding',
  
  // Page-specific settings
  PAGES: {
    HOME: {
      redirectDelay: 30000,
      redirectPath: '/onboarding',
      enabled: true,
      showWarning: true
    },
    MARKET_ANALYTICS: {
      redirectDelay: 45000, // 45 seconds for analytics page
      redirectPath: '/onboarding',
      enabled: true,
      showWarning: true
    },
    PROPERTY_LISTING: {
      redirectDelay: 35000, // 35 seconds for property pages
      redirectPath: '/onboarding',
      enabled: true,
      showWarning: true
    },
    DEVELOPER_LISTING: {
      redirectDelay: 35000, // 35 seconds for developer pages
      redirectPath: '/onboarding',
      enabled: true,
      showWarning: true
    },
    CONTACT: {
      redirectDelay: 60000, // 60 seconds for contact page
      redirectPath: '/onboarding',
      enabled: true,
      showWarning: false // No warning for contact page
    }
  },
  
  // Banner settings
  BANNER: {
    showAfterDelay: 5000, // Show banner after 5 seconds
    showCountdown: true,
    enabled: true
  },
  
  // User interaction events that reset the timer
  INTERACTION_EVENTS: [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
    'focus'
  ],
  
  // Warning settings
  WARNING: {
    showBeforeRedirect: 5000, // Show warning 5 seconds before redirect
    enabled: true
  }
};

// Helper function to get page-specific config
export function getPageConfig(pageName: keyof typeof AUTH_REDIRECT_CONFIG.PAGES) {
  return AUTH_REDIRECT_CONFIG.PAGES[pageName] || {
    redirectDelay: AUTH_REDIRECT_CONFIG.DEFAULT_REDIRECT_DELAY,
    redirectPath: AUTH_REDIRECT_CONFIG.DEFAULT_REDIRECT_PATH,
    enabled: true,
    showWarning: true
  };
}

// Helper function to check if auth redirect is enabled globally
export function isAuthRedirectEnabled(): boolean {
  // You can add environment-based logic here
  return process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_AUTH_REDIRECT === 'true';
}
