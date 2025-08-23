# BrickFolio Redux Integration Guide

This document explains how the frontend integrates with the backend API using Redux Toolkit for state management.

## 🎯 **Overview**

The frontend uses Redux Toolkit with RTK Query patterns to manage state and API calls. The integration is based on the backend API documentation provided in `brickfolio-backend/collections/docs.txt`.

## 🏗️ **Architecture**

### **Store Structure**
```
src/
├── store/
│   └── index.ts                 # Main Redux store configuration
├── services/
│   └── api.ts                   # Axios configuration and interceptors
├── features/
│   ├── auth/
│   │   └── authSlice.ts         # Authentication state management
│   ├── users/
│   │   └── usersSlice.ts        # User management
│   ├── projects/
│   │   └── projectsSlice.ts     # Project management
│   ├── news/
│   │   └── newsSlice.ts         # News management
│   ├── wishlist/
│   │   └── wishlistSlice.ts     # Wishlist management
│   └── market/
│       └── marketSlice.ts       # Market analytics
├── hooks/
│   └── redux.ts                 # Typed Redux hooks
└── components/
    ├── AuthForm.tsx             # Authentication component
    ├── ProjectsList.tsx         # Projects listing with Redux
    ├── NewsList.tsx             # News listing with Redux
    ├── WishlistManager.tsx      # Wishlist management
    └── MarketAnalytics.tsx      # Market analytics
```

## 🚀 **Quick Start**

### **1. API Configuration**
The API service is configured in `src/services/api.ts`:
```typescript
const api = axios.create({
  baseURL: 'http://localhost:5000', // Backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### **2. Using Redux in Components**
```typescript
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getProjects } from '../features/projects/projectsSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  // Component logic...
}
```

## 📋 **Available Features**

### **1. Authentication (authSlice)**
- **Login**: `dispatch(login(credentials))`
- **Register**: `dispatch(register(userData))`
- **Logout**: `dispatch(logout())`
- **Auto-login**: Checks localStorage for existing token

### **2. Projects (projectsSlice)**
- **Get All Projects**: `dispatch(getProjects())`
- **Create Project**: `dispatch(createProject(projectData))`
- **Update Project**: `dispatch(updateProject({ id, data }))`
- **Delete Project**: `dispatch(deleteProject(id))`
- **Filter by Category**: `dispatch(filterProjectsByCategory(category))`
- **Filter by Location**: `dispatch(filterProjectsByLocation(location))`
- **Sort by ROI**: `dispatch(sortProjectsByROI('desc'))`
- **Sort by Price**: `dispatch(sortProjectsByPrice('asc'))`

### **3. News (newsSlice)**
- **Get All News**: `dispatch(getNews())`
- **Create News**: `dispatch(createNews(newsData))`
- **Update News**: `dispatch(updateNews({ id, data }))`
- **Delete News**: `dispatch(deleteNews(id))`
- **Filter by Category**: `dispatch(filterNewsByCategory(category))`
- **Filter by Tag**: `dispatch(filterNewsByTag(tag))`
- **Sort by Date**: `dispatch(sortNewsByDate('desc'))`

### **4. Wishlist (wishlistSlice)**
- **Get User Wishlist**: `dispatch(getWishlistByUserId(userId))`
- **Add to Wishlist**: `dispatch(addToWishlist(wishlistData))`
- **Remove from Wishlist**: `dispatch(removeFromWishlist(wishlistId))`

### **5. Market Analytics (marketSlice)**
- **Get Market Data**: `dispatch(getMarketData())`
- **Get Market Trends**: `dispatch(getMarketTrends(filters))`
- **Get Market Filters**: `dispatch(getMarketFilters())`

### **6. Users (usersSlice)**
- **Get All Users**: `dispatch(getUsers())`
- **Get User by ID**: `dispatch(getUserById(userId))`
- **Update User**: `dispatch(updateUser({ id, data }))`
- **Delete User**: `dispatch(deleteUser(userId))`
- **Update Onboarding**: `dispatch(updateOnboarding({ userId, data }))`
- **Get Developers**: `dispatch(getDevelopers())` - Fetches users with role=Developer
- **Get Developer Profile**: `dispatch(getDeveloperProfile(developerId))` - Fetches individual developer details

## 🔧 **Component Examples**

### **Authentication Form**
```typescript
import { AuthForm } from '../components/AuthForm';

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm />
    </div>
  );
}
```

### **Projects List with Filters**
```typescript
import { ProjectsList } from '../components/ProjectsList';

function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectsList />
    </div>
  );
}
```

### **News Section**
```typescript
import { NewsList } from '../components/NewsList';

function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <NewsList />
    </div>
  );
}
```

### **Developer Profile**
```typescript
import { DeveloperProfile } from '../components/DeveloperProfile';

function DeveloperProfilePage() {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen">
      <DeveloperProfile developerId={id} onClose={() => navigate('/')} />
    </div>
  );
}
```

## 🛠️ **Error Handling**

All Redux slices include comprehensive error handling:

```typescript
// In components
const { loading, error } = useAppSelector((state) => state.projects);

if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>Error: {error}</div>;
}
```

## 🔐 **Authentication Flow**

1. **Login/Register**: User submits credentials
2. **Token Storage**: JWT token stored in localStorage
3. **Auto-login**: App checks for existing token on startup
4. **API Calls**: Token automatically included in request headers
5. **Token Expiry**: 401 responses trigger automatic logout

## 📊 **State Management**

### **Loading States**
Each slice tracks loading states for different operations:
```typescript
interface State {
  loading: boolean;
  error: string | null;
  // ... other state properties
}
```

### **Data Caching**
Redux automatically caches API responses. Subsequent calls to the same endpoint will use cached data unless explicitly refreshed.

## 🔗 **API Integration Details**

### **Developer Profile API**
The developer profile integration uses the following API endpoints:

1. **Get Developers List**: `GET /users?role=Developer`
   - Returns list of all developers with basic information
   - Used in `TopDevelopers` and `DeveloperListing` components

2. **Get Individual Developer**: `GET /users/{developerId}`
   - Returns detailed developer profile information including projects
   - Used in `DeveloperProfile` component
   - API Response Structure:
   ```json
   {
     "success": true,
     "message": "User fetched successfully",
     "data": {
       "_id": "68a9c8b5aff20d04ff2d33b9",
       "name": "Omniyat",
       "email": "info@omniyat.com",
       "role": "Developer",
       "developerProfile": {
         "rating": 4.7,
         "totalProjects": 30,
         "projectsCompletedCount": 20,
         "activeProjects": 10,
         "deliveryTrackRecord": { 
           "onTime": 92, 
           "qualityScore": 96, 
           "customerSatisfaction": 4.7 
         },
         "specializations": ["Luxury Developments", "Mixed-use Projects"],
         "certifications": ["RERA", "ISO 9001"],
         "reraCertified": true,
         "compliance": {
           "reraLicense": "RERA-33445",
           "complianceScore": 96,
           "lastAudit": "2025-03-22T00:00:00.000Z"
         },
         "projects": [
           {
             "_id": "68a9ce972be0579e4e97a4fb",
             "projectName": "The Grand Polo Club & Resort",
             "location": "Meydan",
             "description": "Luxury resort-style living with polo facilities.",
             "amenities": ["Polo Field", "Pool", "Gym", "Spa"],
             "constructionProgress": 70,
             "handoverDate": "2025-12-31T00:00:00.000Z",
             "paymentPlan": ["Cash", "Bank Loan"],
             "unitsAvailable": "10/40",
             "category": ["Premium", "Equestrian"],
             "roi": 8,
             "rentalYield": 6.5,
             "rating": 4.6,
             "images": ["https://example.com/images/polo1.jpg"],
             "price": { "formatted": "AED 4.5M" },
             "completion": { "quarter": "Q4", "year": 2025 }
           }
         ]
       }
     }
   }
   ```

### **State Management for Developers**
The `usersSlice` manages developer data with the following state structure:
```typescript
interface UsersState {
  users: User[];
  developers: User[];           // List of all developers
  selectedDeveloper: User | null; // Currently viewed developer profile
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}
```

### **Enhanced Project Display Features**
The DeveloperProfile component now includes comprehensive project information:

1. **Projects Overview Dashboard**:
   - Total projects count
   - Completed projects
   - Under construction projects
   - New launches

2. **Detailed Project Cards**:
   - Project images with fallback
   - Construction progress with visual progress bar
   - Project categories and amenities
   - ROI and rental yield information
   - Unit availability
   - Handover dates
   - Project ratings

3. **Smart Status Classification**:
   - Launch Phase (0-20% progress)
   - Pre-Launch (20-50% progress)
   - Construction (50-80% progress)
   - Near Completion (80-100% progress)
   - Completed (100% progress)

4. **Rich Project Data**:
   - Project categories (Luxury, Premium, etc.)
   - Amenities list with overflow handling
   - Payment plans
   - Price ranges
   - Location information

## 🎨 **UI Integration**
```typescript
{loading && (
  <div className="flex items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin" />
    <span className="ml-2">Loading...</span>
  </div>
)}
```

### **Error Messages**
```typescript
{error && (
  <Alert variant="destructive">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

## 🔄 **API Endpoints**

The integration supports all backend endpoints:

- **Authentication**: `/auth/login`, `/auth/register`
- **Users**: `/users`, `/users/:id`
- **Projects**: `/projects`, `/projects/:id`
- **News**: `/news`, `/news/:id`
- **Wishlist**: `/wishlist`, `/wishlist/:id`
- **Market**: `/market/data`, `/market/trends`, `/market/filters`

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"projects.slice is not a function"**
   - **Solution**: Ensure the API returns an array. The Redux slice now handles this automatically.

2. **"action.payload.filter is not a function"**
   - **Solution**: The news slice now ensures payload is always an array.

3. **API Connection Issues**
   - **Check**: Backend server is running on `http://localhost:5000`
   - **Check**: CORS is properly configured on the backend

4. **Authentication Issues**
   - **Check**: Token is properly stored in localStorage
   - **Check**: Backend JWT secret is configured

### **Debug Mode**
Enable Redux DevTools in your browser to inspect state changes and actions.

## 📝 **Best Practices**

1. **Always handle loading and error states** in components
2. **Use TypeScript** for better type safety
3. **Dispatch actions in useEffect** for data fetching
4. **Clear errors** before new API calls
5. **Use proper error boundaries** for component-level error handling

## 🔗 **Related Files**

- `src/store/index.ts` - Main store configuration
- `src/services/api.ts` - API service setup
- `src/hooks/redux.ts` - Typed Redux hooks
- `src/features/*/slice.ts` - Individual feature slices
- `src/components/*.tsx` - Redux-integrated components

## 🎯 **Next Steps**

1. **Test API Integration**: Ensure backend is running and test all endpoints
2. **Add Error Boundaries**: Implement React error boundaries for better UX
3. **Optimize Performance**: Consider implementing pagination for large datasets
4. **Add Real-time Updates**: Consider WebSocket integration for live data
5. **Implement Caching**: Add more sophisticated caching strategies

---

This Redux integration provides a robust foundation for managing application state and API communication. All components are now connected to the backend API and will automatically fetch and display real data.
