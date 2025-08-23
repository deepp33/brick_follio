import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Investor' | 'Developer';
  phone?: string;
  country?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
  onboarding?: {
    step1_residence?: string;
    step2_priorInvestment?: string;
    step3_investmentGoal?: string;
    step4_budget?: {
      min: number;
      max: number;
      currency: string;
    };
    step5_offPlan?: string;
    step6_preferredLocation?: string[];
    step7_propertyTypes?: string[];
    step8_roiTarget?: number;
    step9_rentalYieldTarget?: number;
    step10_riskAppetite?: string;
    step11_investmentHorizon?: string;
  };
  developerProfile?: {
    companyName: string;
    rating: number;
    certifications: string[];
    reraCertified: boolean;
    projects: string[];
    specializations: string[];
    projectsCompletedCount: number;
    description: string;
    location: string;
    successRate: number;
    deliveryTrackRecord: {
      onTime: number;
      qualityScore: number;
      customerSatisfaction: number;
    };
    activeProjects: number;
    avgROI: number;
    employeeCount: number;
    totalProjects: number;
    compliance: {
      reraLicense: string;
      complianceScore: number;
      lastAudit: string;
    };
    legalStanding: {
      clientLegal: string;
      escrow: string;
      insurance: string;
    };
  };
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'Investor' | 'Developer';
  phone?: string;
  country?: string;
  city?: string;
  onboarding?: User['onboarding'];
  developerProfile?: User['developerProfile'];
}

export interface BulkCreateUserData {
  users: CreateUserData[];
}

interface UsersState {
  users: User[];
  developers: User[];
  currentUser: User | null;
  selectedDeveloper: User | null; // Added for individual developer profile
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  developers: [],
  currentUser: null,
  selectedDeveloper: null, // Initialized
  loading: false,
  error: null,
};

// Async thunks
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserData) => {
    const response = await api.post('/users', userData);
    return response.data;
  }
);

export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (role?: string, { rejectWithValue }) => {
    try {
      const params = role ? { role } : {};
      const response = await api.get('/users', { params });
      // Handle the new response structure with nested data array
      const responseData = response.data;
      if (responseData?.data && Array.isArray(responseData.data)) {
        return responseData.data;
      } else if (Array.isArray(responseData)) {
        return responseData;
      } else {
        return [];
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }: { userId: string; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const bulkCreateUsers = createAsyncThunk(
  'users/bulkCreateUsers',
  async (bulkData: BulkCreateUserData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/bulk', bulkData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create users in bulk');
    }
  }
);

export const getRecommendations = createAsyncThunk(
  'users/getRecommendations',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/calculate/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

// Specific thunk for getting developers
export const getDevelopers = createAsyncThunk(
  'users/getDevelopers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users?role=Developer');
      // Handle the new response structure with nested data array
      const responseData = response.data;
      if (responseData?.data && Array.isArray(responseData.data)) {
        return responseData.data;
      } else if (Array.isArray(responseData)) {
        return responseData;
      } else {
        return [];
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch developers');
    }
  }
);

// Thunk for getting individual developer profile
export const getDeveloperProfile = createAsyncThunk(
  'users/getDeveloperProfile',
  async (developerId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${developerId}`);
      const responseData = response.data;
      if (responseData?.data) {
        return responseData.data;
      } else {
        return responseData;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch developer profile');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create user';
      })
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Ensure action.payload is always an array
        const users = Array.isArray(action.payload) ? action.payload : [];
        state.users = users;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.users = [];
      })
      // Get User by ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?._id === action.payload._id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Bulk Create Users
      .addCase(bulkCreateUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkCreateUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(...action.payload);
      })
      .addCase(bulkCreateUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Developers
      .addCase(getDevelopers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDevelopers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Ensure action.payload is always an array
        const developers = Array.isArray(action.payload) ? action.payload : [];
        state.developers = developers;
      })
                   .addCase(getDevelopers.rejected, (state, action) => {
               state.loading = false;
               state.error = action.payload as string;
               state.developers = [];
             })
             // Get Developer Profile
             .addCase(getDeveloperProfile.pending, (state) => {
               state.loading = true;
               state.error = null;
             })
             .addCase(getDeveloperProfile.fulfilled, (state, action) => {
               state.loading = false;
               state.error = null;
               state.selectedDeveloper = action.payload;
             })
             .addCase(getDeveloperProfile.rejected, (state, action) => {
               state.loading = false;
               state.error = action.payload as string;
               state.selectedDeveloper = null;
             });
  },
});

export const { clearError, setCurrentUser, clearCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;

