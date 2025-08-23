import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
export interface NewsArticle {
  _id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  author: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsData {
  title: string;
  category: string;
  description: string;
  images: string[];
  author: string;
  tags: string[];
  isFeatured: boolean;
}

interface NewsState {
  news: NewsArticle[];
  featuredNews: NewsArticle[];
  filteredNews: NewsArticle[];
  currentArticle: NewsArticle | null;
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  news: [],
  featuredNews: [],
  filteredNews: [],
  currentArticle: null,
  loading: false,
  error: null,
};

// Async thunks
export const getNews = createAsyncThunk(
  'news/getNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/news');
      // Handle potential nested response structure
      const responseData = response.data;
      if (responseData?.news && Array.isArray(responseData.news)) {
        return responseData.news;
      } else if (Array.isArray(responseData)) {
        return responseData;
      } else {
        return [];
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch news');
    }
  }
);

export const createNews = createAsyncThunk(
  'news/createNews',
  async (newsData: CreateNewsData[], { rejectWithValue }) => {
    try {
      const response = await api.post('/news', newsData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create news');
    }
  }
);

export const updateNews = createAsyncThunk(
  'news/updateNews',
  async ({ id, newsData }: { id: string; newsData: Partial<NewsArticle> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/news/${id}`, newsData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update news');
    }
  }
);

export const deleteNews = createAsyncThunk(
  'news/deleteNews',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/news/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete news');
    }
  }
);

// Filter and sort actions
export const filterNewsByCategory = createAsyncThunk(
  'news/filterByCategory',
  async (category: string, { getState }) => {
    const state = getState() as { news: NewsState };
    const filtered = state.news.news.filter(article => 
      article.category === category
    );
    return filtered;
  }
);

export const filterNewsByTag = createAsyncThunk(
  'news/filterByTag',
  async (tag: string, { getState }) => {
    const state = getState() as { news: NewsState };
    const filtered = state.news.news.filter(article => 
      article.tags.includes(tag)
    );
    return filtered;
  }
);

export const sortNewsByDate = createAsyncThunk(
  'news/sortByDate',
  async (order: 'asc' | 'desc', { getState }) => {
    const state = getState() as { news: NewsState };
    const sorted = [...state.news.news].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return sorted;
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    resetFilters: (state) => {
      state.filteredNews = state.news;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get News
      .addCase(getNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Ensure action.payload is always an array
        const news = Array.isArray(action.payload) ? action.payload : [];
        state.news = news;
        state.filteredNews = news;
        state.featuredNews = news.filter((article: any) => article.isFeatured);
      })
      .addCase(getNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.news = [];
        state.filteredNews = [];
        state.featuredNews = [];
      })
      // Create News
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both single and array responses
        const newArticles = Array.isArray(action.payload) ? action.payload : [action.payload];
        state.news.push(...newArticles);
        state.filteredNews = state.news;
        state.featuredNews = state.news.filter(article => article.isFeatured);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update News
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.news.findIndex(n => n._id === action.payload._id);
        if (index !== -1) {
          state.news[index] = action.payload;
          state.filteredNews = state.news;
          state.featuredNews = state.news.filter(article => article.isFeatured);
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete News
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = state.news.filter(n => n._id !== action.payload);
        state.filteredNews = state.news;
        state.featuredNews = state.news.filter(article => article.isFeatured);
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Filter and Sort
      .addCase(filterNewsByCategory.fulfilled, (state, action) => {
        state.filteredNews = action.payload;
      })
      .addCase(filterNewsByTag.fulfilled, (state, action) => {
        state.filteredNews = action.payload;
      })
      .addCase(sortNewsByDate.fulfilled, (state, action) => {
        state.filteredNews = action.payload;
      });
  },
});

export const { clearError, clearCurrentArticle, resetFilters } = newsSlice.actions;
export default newsSlice.reducer;
