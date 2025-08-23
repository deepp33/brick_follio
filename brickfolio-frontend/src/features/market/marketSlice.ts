import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
export interface MarketData {
  _id: string;
  // Add specific market data fields based on your backend response
  [key: string]: any;
}

export interface MarketTrendsFilters {
  timeHorizon: string;
  regions: string[];
  propertyTypes: string[];
  roiRange: {
    min: number;
    max: number;
  };
  rentalYieldRange: {
    min: number;
    max: number;
  };
  priceGrowthRange: {
    min: number;
    max: number;
  };
}

export interface MarketFilters {
  regions: string[];
  propertyTypes: string[];
  priceRanges: string[];
  roiRanges: string[];
  rentalYieldRanges: string[];
}

interface MarketState {
  marketData: MarketData | null;
  marketTrends: any[];
  marketFilters: MarketFilters | null;
  marketOverview: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  marketData: null,
  marketTrends: [],
  marketFilters: null,
  marketOverview: null,
  loading: false,
  error: null,
};

// Async thunks
export const getMarketData = createAsyncThunk(
  'market/getMarketData',
  async () => {
    const response = await api.get('/market');
    return response.data;
  }
);

export const getMarketOverview = createAsyncThunk(
  'market/getMarketOverview',
  async () => {
    const response = await api.get('/market-overview');
    return response.data;
  }
);

export const getMarketTrends = createAsyncThunk(
  'market/getMarketTrends',
  async (filters: MarketTrendsFilters) => {
    const response = await api.post('/market/trends', filters);
    return response.data;
  }
);

export const getMarketFilters = createAsyncThunk(
  'market/getMarketFilters',
  async () => {
    const response = await api.get('/market/filters');
    return response.data;
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMarketData: (state) => {
      state.marketData = null;
    },
    clearMarketTrends: (state) => {
      state.marketTrends = [];
    },
    setMarketFilters: (state, action) => {
      state.marketFilters = action.payload;
    },
    updateMarketTrendsFilters: (state, action) => {
      // This can be used to update filters without making an API call
      // The actual API call should be made in the component
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Market Data
      .addCase(getMarketData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketData.fulfilled, (state, action) => {
        state.loading = false;
        state.marketData = action.payload;
      })
      .addCase(getMarketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch market data';
      })
      // Get Market Overview
      .addCase(getMarketOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.marketOverview = action.payload;
      })
      .addCase(getMarketOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch market overview';
      })
      // Get Market Trends
      .addCase(getMarketTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.marketTrends = action.payload;
      })
      .addCase(getMarketTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch market trends';
      })
      // Get Market Filters
      .addCase(getMarketFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.marketFilters = action.payload;
      })
      .addCase(getMarketFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch market filters';
      });
  },
});

export const {
  clearError,
  clearMarketData,
  clearMarketTrends,
  setMarketFilters,
  updateMarketTrendsFilters,
} = marketSlice.actions;

export default marketSlice.reducer;

