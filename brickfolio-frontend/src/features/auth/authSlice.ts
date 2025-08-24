import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'Investor' | 'Developer';
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OnboardingData {
  step1_residence: string;
  step2_priorInvestment: string;
  step3_investmentGoal: string;
  step4_budget: {
    min: number;
    max: number;
    currency: string;
  };
  step5_offPlan: string;
  step6_preferredLocation: string[];
  step7_propertyTypes: string[];
  step8_roiTarget: number;
  step9_rentalYieldTarget: number;
  step10_riskAppetite: string;
  step11_investmentHorizon: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'Investor' | 'Developer';
  phone?: string;
  country?: string;
  city?: string;
  onboarding?: OnboardingData;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  onboardingComplete: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  loading: false,
  error: null,
  onboardingComplete: false,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('authToken', token);
    
    return { token, user };
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData) => {
    const response = await api.post('/users', userData);
    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('authToken', token);
    
    return { token, user };
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout API fails, we should still clear local storage
      console.error('Logout API error:', error);
    }
    
    // Clear token from localStorage
    localStorage.removeItem('authToken');
    
    return null;
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.onboardingComplete = false;
      localStorage.removeItem('authToken');
    },
    setOnboardingComplete: (state, action) => {
      state.onboardingComplete = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.onboardingComplete = true; // Assume onboarding is complete after login
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.onboardingComplete = true; // Onboarding is complete after registration
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.onboardingComplete = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        // Even if logout fails, clear the state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.onboardingComplete = false;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.onboardingComplete = true; // Assume onboarding is complete for existing users
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get current user';
        // If getting current user fails, user might not be authenticated
        state.user = null;
        state.isAuthenticated = false;
        state.onboardingComplete = false;
        localStorage.removeItem('authToken');
      });
  },
});

export const { clearError, setUser, clearUser, setOnboardingComplete } = authSlice.actions;
export default authSlice.reducer;

