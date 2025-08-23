import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
export interface WishlistItem {
  _id: string;
  investor: string;
  targetId: string;
  targetModel: 'Project' | 'Developer';
  createdAt: string;
  updatedAt: string;
  // Populated fields when fetching wishlist
  target?: any; // Project or Developer object
}

export interface CreateWishlistData {
  investor: string;
  targetId: string;
  targetModel: 'Project' | 'Developer';
}

interface WishlistState {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: [],
  loading: false,
  error: null,
};

// Async thunks
export const getWishlistByUserId = createAsyncThunk(
  'wishlist/getWishlistByUserId',
  async (userId: string) => {
    const response = await api.get(`/wishlist/${userId}`);
    return response.data;
  }
);

export const createWishlistItem = createAsyncThunk(
  'wishlist/createWishlistItem',
  async (wishlistData: CreateWishlistData) => {
    const response = await api.post('/wishlist', wishlistData);
    return response.data;
  }
);

export const deleteWishlistItem = createAsyncThunk(
  'wishlist/deleteWishlistItem',
  async (wishlistId: string) => {
    await api.delete(`/wishlist/${wishlistId}`);
    return wishlistId;
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.wishlist = [];
    },
    addToWishlist: (state, action) => {
      state.wishlist.push(action.payload);
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(item => item._id !== action.payload);
    },
    filterWishlistByType: (state, action) => {
      const targetModel = action.payload;
      if (targetModel) {
        state.wishlist = state.wishlist.filter(item => item.targetModel === targetModel);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Wishlist by User ID
      .addCase(getWishlistByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlistByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(getWishlistByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      })
      // Create Wishlist Item
      .addCase(createWishlistItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWishlistItem.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist.push(action.payload);
      })
      .addCase(createWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to wishlist';
      })
      // Delete Wishlist Item
      .addCase(deleteWishlistItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWishlistItem.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = state.wishlist.filter(item => item._id !== action.payload);
      })
      .addCase(deleteWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove from wishlist';
      });
  },
});

export const {
  clearError,
  clearWishlist,
  addToWishlist,
  removeFromWishlist,
  filterWishlistByType,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

