import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsApi } from '../../services/api';

// Types
export interface Project {
  _id: string;
  projectName: string;
  location: string;
  category: string[];
  roi: number;
  rentalYield: number;
  rating: number;
  completion: {
    quarter: string;
    year: number;
  };
  price: {
    currency: string;
    value: number;
    formatted: string;
  };
  developer: string;
  description: string;
  amenities: string[];
  constructionProgress: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  handoverDate: string;
  paymentPlan: string[];
  unitsAvailable: string;
  images: string[];
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  projectName: string;
  location: string;
  category: string[];
  roi: number;
  rentalYield: number;
  rating: number;
  completion: {
    quarter: string;
    year: number;
  };
  price: {
    currency: string;
    value: number;
    formatted: string;
  };
  developer: string;
  description: string;
  amenities: string[];
  constructionProgress: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  handoverDate: string;
  paymentPlan: string[];
  unitsAvailable: string;
  images: string[];
  thumbnail: string;
}

interface ProjectsState {
  projects: Project[];
  filteredProjects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  // Pagination
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  // Filters
  currentFilters: {
    category?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
}

const initialState: ProjectsState = {
  projects: [],
  filteredProjects: [],
  currentProject: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  currentFilters: {},
};

// Async thunks
export const getProjects = createAsyncThunk(
  'projects/getProjects',
  async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }, { rejectWithValue }) => {
    try {
      const response = await projectsApi.getProjects(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: CreateProjectData, { rejectWithValue }) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }: { id: string; projectData: Partial<Project> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

// Filter and sort actions
export const filterProjectsByCategory = createAsyncThunk(
  'projects/filterByCategory',
  async (category: string, { getState }) => {
    const state = getState() as { projects: ProjectsState };
    const filtered = state.projects.projects.filter(project => 
      project.category.includes(category)
    );
    return filtered;
  }
);

export const filterProjectsByLocation = createAsyncThunk(
  'projects/filterByLocation',
  async (location: string, { getState }) => {
    const state = getState() as { projects: ProjectsState };
    const filtered = state.projects.projects.filter(project => 
      project.location.toLowerCase().includes(location.toLowerCase())
    );
    return filtered;
  }
);

export const sortProjectsByROI = createAsyncThunk(
  'projects/sortByROI',
  async (order: 'asc' | 'desc', { getState }) => {
    const state = getState() as { projects: ProjectsState };
    const sorted = [...state.projects.projects].sort((a, b) => {
      return order === 'asc' ? a.roi - b.roi : b.roi - a.roi;
    });
    return sorted;
  }
);

export const sortProjectsByPrice = createAsyncThunk(
  'projects/sortByPrice',
  async (order: 'asc' | 'desc', { getState }) => {
    const state = getState() as { projects: ProjectsState };
    const sorted = [...state.projects.projects].sort((a, b) => {
      return order === 'asc' ? a.price.value - b.price.value : b.price.value - a.price.value;
    });
    return sorted;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    resetFilters: (state) => {
      state.filteredProjects = state.projects;
      state.currentFilters = {};
    },
    setFilters: (state, action) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.page = action.payload.page || state.page;
      state.limit = action.payload.limit || state.limit;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Projects
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Handle the new API response structure
        const responseData = action.payload;
        
        if (responseData?.projects && Array.isArray(responseData.projects)) {
          state.projects = responseData.projects;
          state.filteredProjects = responseData.projects;
          state.total = responseData.total || 0;
          state.page = responseData.page || 1;
          state.limit = responseData.limit || 10;
          state.totalPages = responseData.totalPages || 0;
        } else {
          // Fallback for old format
          const projects = Array.isArray(responseData) ? responseData : [];
          state.projects = projects;
          state.filteredProjects = projects;
          state.total = projects.length;
          state.totalPages = 1;
        }
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.projects = [];
        state.filteredProjects = [];
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
        state.filteredProjects = state.projects;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
          state.filteredProjects = state.projects;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p._id !== action.payload);
        state.filteredProjects = state.projects;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Filter and Sort
      .addCase(filterProjectsByCategory.fulfilled, (state, action) => {
        state.filteredProjects = action.payload;
      })
      .addCase(filterProjectsByLocation.fulfilled, (state, action) => {
        state.filteredProjects = action.payload;
      })
      .addCase(sortProjectsByROI.fulfilled, (state, action) => {
        state.filteredProjects = action.payload;
      })
      .addCase(sortProjectsByPrice.fulfilled, (state, action) => {
        state.filteredProjects = action.payload;
      });
  },
});

export const { clearError, clearCurrentProject, resetFilters, setFilters, setPagination } = projectsSlice.actions;
export default projectsSlice.reducer;
