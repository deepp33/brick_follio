# Pages Structure

This directory contains all the page components for the BrickFolio application, organized using React Router for navigation.

## Page Components

### Home (`Home.tsx`)
- **Route**: `/`
- **Description**: Main landing page with all the core features
- **Components Used**: Header, HeroSection, FeaturedProjects, TopDevelopers, InteractiveMap, MarketInsights, CalculatorTools, NewsSection, ReviewsSection, Footer

### OnboardingFlow (`OnboardingFlow.tsx`)
- **Route**: `/onboarding`
- **Description**: User onboarding and signup flow
- **Components Used**: OnboardingFlow component
- **Navigation**: Redirects to `/map` after completion

### MapView (`MapView.tsx`)
- **Route**: `/map`
- **Description**: Interactive map view for property exploration
- **Components Used**: MapView component
- **State**: Receives userPreferences from onboarding or navigation state

### PropertyListing (`PropertyListing.tsx`)
- **Route**: `/properties`
- **Description**: List of all available properties
- **Components Used**: PropertyListing component

### DeveloperListing (`DeveloperListing.tsx`)
- **Route**: `/developers`
- **Description**: List of all developers
- **Components Used**: DeveloperListing component
- **Navigation**: Can navigate to individual developer profiles

### DeveloperProfile (`DeveloperProfile.tsx`)
- **Route**: `/developer/:id`
- **Description**: Individual developer profile page
- **Components Used**: DeveloperProfile component
- **State**: Receives developer data via navigation state
- **Fallback**: Shows "Developer Not Found" if no developer data

### MarketAnalytics (`MarketAnalytics.tsx`)
- **Route**: `/market-analytics`
- **Description**: Market insights and analytics dashboard
- **Components Used**: MarketAnalytics component

### NotFound (`NotFound.tsx`)
- **Route**: `*` (catch-all)
- **Description**: 404 error page for unmatched routes
- **Navigation**: Provides link back to home page

## Navigation Flow

1. **Home** (`/`) - Main landing page
2. **Onboarding** (`/onboarding`) - User registration and preferences
3. **Map View** (`/map`) - Interactive property map
4. **Properties** (`/properties`) - Property listings
5. **Developers** (`/developers`) - Developer listings
6. **Developer Profile** (`/developer/:id`) - Individual developer details
7. **Market Analytics** (`/market-analytics`) - Market insights

## State Management

- User preferences are passed via React Router's `location.state`
- Developer data is passed via navigation state for profile pages
- Authentication state is managed at the page level where needed

## Usage

All pages are exported from the `index.ts` file for clean imports:

```typescript
import { Home, MapViewPage, PropertyListingPage } from './pages';
```

The main App component sets up all routes using React Router's `BrowserRouter`, `Routes`, and `Route` components.
