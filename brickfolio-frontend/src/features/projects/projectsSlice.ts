import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

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
}

const initialState: ProjectsState = {
  projects: [],
  filteredProjects: [],
  currentProject: null,
  loading: false,
  error: null,
};

// Async thunks
export const getProjects = createAsyncThunk(
  'projects/getProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects');
      // Handle the new response structure with nested projects array
      const responseData = response.data;
      if (responseData?.projects && Array.isArray(responseData.projects)) {
        return responseData.projects;
      } else if (Array.isArray(responseData)) {
        return responseData;
      } else {
        return [];
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
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
        // Ensure action.payload is always an array
        const projects = Array.isArray(action.payload) ? action.payload : [];
        state.projects = projects;
        state.filteredProjects = projects;
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

export const { clearError, clearCurrentProject, resetFilters } = projectsSlice.actions;
export default projectsSlice.reducer;
