import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Market Data Interfaces
export interface MarketMetrics {
  averageROI: string;
  yearlyROIChange: string;
  priceGrowth: string;
  priceYoYChange: string;
  rentalYield: string;
  rentalYieldChange: string;
  marketVolume: string;
  totalTransactionVolumeChange: string;
}

export interface TopPerformingArea {
  area: string;
  growth: string;
}

export interface InvestmentTrend {
  type: string;
  percentage: string;
}

export interface MarketData {
  metrics: MarketMetrics;
  topPerformingAreas: TopPerformingArea[];
  investmentTrends: InvestmentTrend[];
  reportLink: string;
}

// Market Filters Interfaces
export interface MarketFilters {
  timeHorizon: {
    options: string[];
  };
  regions: string[];
  propertyTypes: string[];
  roiRange: {
    min: number;
    max: number;
    selectedMin: number;
    selectedMax: number;
  };
  rentalYieldRange: {
    min: number;
    max: number;
    selectedMin: number;
    selectedMax: number;
  };
  priceGrowthRange: {
    min: number;
    max: number;
    selectedMin: number;
    selectedMax: number;
  };
}

// Market Trends Interfaces
export interface RoiTrendOption {
  location: string;
  roi: string[];
}

export interface RoiTrendsByArea {
  options: RoiTrendOption[];
  months: string[];
}

export interface RentalYieldByArea {
  location: string;
  rentalYield: string;
  properties: number;
}

export interface TransactionVolumes {
  options: string[];
  Month: {
    [key: string]: {
      [key: string]: number;
    };
  };
}

export interface MarketTrends {
  roiTrendsByArea: RoiTrendsByArea;
  rentalYieldByArea: RentalYieldByArea[];
  transactionVolumes: TransactionVolumes;
}

// Filter Payload Interface
export interface MarketTrendsFilterPayload {
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

// State Interface
interface MarketState {
  marketData: MarketData | null;
  marketFilters: MarketFilters | null;
  marketTrends: MarketTrends | null;
  loading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  marketData: null,
  marketFilters: null,
  marketTrends: null,
  loading: false,
  error: null,
};

// Async Thunks
export const getMarketData = createAsyncThunk(
  'market/getMarketData',
  async () => {
    const response = await api.get('/market');
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    return response.data;
  }
);

export const getMarketFilters = createAsyncThunk(
  'market/getMarketFilters',
  async () => {
    const response = await api.get('/market/filters');
    if (response.data && response.data.success && response.data.filters) {
      return response.data.filters;
    }
    return response.data;
  }
);

export const getMarketTrends = createAsyncThunk(
  'market/getMarketTrends',
  async (filterPayload: MarketTrendsFilterPayload) => {
    const response = await api.post('/market/trends', filterPayload);
    if (response.data && response.data.success && response.data.trends) {
      return response.data.trends;
    }
    return response.data;
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    clearMarketData: (state) => {
      state.marketData = null;
      state.marketFilters = null;
      state.marketTrends = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // getMarketData
    builder
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
      });

    // getMarketFilters
    builder
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

    // getMarketTrends
    builder
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
      });
  },
});

export const { clearMarketData } = marketSlice.actions;
export default marketSlice.reducer;

