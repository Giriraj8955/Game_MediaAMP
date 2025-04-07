import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    categories: [],
    tags: [],
    year: '',
    minRating: 0,
    searchQuery: ''
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setTags: (state, action) => {
      state.tags = action.payload;
    },
    setYear: (state, action) => {
      state.year = action.payload;
    },
    setMinRating: (state, action) => {
      state.minRating = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.categories = [];
      state.tags = [];
      state.year = '';
      state.minRating = 0;
      state.searchQuery = '';
    }
  }
});

export const {
  setCategories,
  setTags,
  setYear,
  setMinRating,
  setSearchQuery,
  clearFilters
} = filtersSlice.actions;

export default filtersSlice.reducer;