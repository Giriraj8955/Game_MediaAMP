import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '9a73fdc7f02541289add6e6167937f26';
const BASE_URL = 'https://api.rawg.io/api';

export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async ({ page = 1, pageSize = 12 } = {}, { getState, rejectWithValue }) => {
    try {
      const filters = getState().filters || {};
      
      let queryParams = new URLSearchParams({
        key: API_KEY,
        page,
        page_size: pageSize
      });

      if (filters.categories?.length) {
        queryParams.append('genres', filters.categories.join(','));
      }

      if (filters.tags?.length) {
        queryParams.append('tags', filters.tags.join(','));
      }

      if (filters.year) {
        const dates = convertYearToDateRange(filters.year);
        if (dates) {
          queryParams.append('dates', dates);
        }
      }

      if (filters.minRating) {
        queryParams.append('metacritic', `${filters.minRating},100`);
      }

      console.log("Fetching games from:", `${BASE_URL}/games?${queryParams}`);
      const response = await axios.get(`${BASE_URL}/games?${queryParams}`);
      console.log("Fetched games data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching games:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch games');
    }
  }
);

export const fetchGameDetails = createAsyncThunk(
  'games/fetchGameDetails',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/games/${gameId}?key=${API_KEY}`);
      const screenshots = await axios.get(`${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}`);
      
      return {
        ...response.data,
        screenshots: screenshots.data.results || []
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch game details');
    }
  }
);

export const searchGames = createAsyncThunk(
  'games/searchGames',
  async ({ query, genre, platform, price, sort = 'relevance' }, { rejectWithValue }) => {
    try {
      let queryParams = new URLSearchParams({
        key: API_KEY,
        search: query,
        ordering: getOrderingParam(sort)
      });
      
      if (genre) {
        queryParams.append('genres', genre);
      }
      
      if (platform) {
        queryParams.append('platforms', getPlatformId(platform));
      }
      
      console.log("Searching games with params:", queryParams.toString());
      const response = await axios.get(`${BASE_URL}/games?${queryParams}`);
      
      let results = response.data.results;
      if (price) {
        results = filterByPrice(results, price);
      }
      
      return {
        ...response.data,
        results
      };
    } catch (error) {
      console.error("Error searching games:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to search games');
    }
  }
);

function getOrderingParam(sort) {
  switch (sort) {
    case 'price_asc':
      return '-added';
    case 'price_desc':
      return 'added';
    case 'rating':
      return '-rating';
    case 'release_date':
      return '-released';
    case 'relevance':
    default:
      return '-relevance';
  }
}

function getPlatformId(platform) {
  const platformMap = {
    'pc': 4,
    'playstation': [187, 18, 16, 15, 27],
    'xbox': [186, 1, 14, 80],
    'nintendo': [7, 8, 9, 13, 83],
    'mobile': [21, 3]
  };
  
  return Array.isArray(platformMap[platform]) 
    ? platformMap[platform].join(',') 
    : platformMap[platform];
}


function filterByPrice(results, priceRange) {
  switch (priceRange) {
    case 'free':
      return results.filter(game => game.price === 0);
    case 'under10':
      return results.filter(game => game.price < 10);
    case 'under20':
      return results.filter(game => game.price < 20);
    case 'under30':
      return results.filter(game => game.price < 30);
    case 'under60':
      return results.filter(game => game.price < 60);
    default:
      return results;
  }
}

function convertYearToDateRange(year) {
  if (year && year.includes('-')) {
    const [startYear, endYear] = year.split('-');
    return `${startYear}-01-01,${endYear}-12-31`;
  } else if (year) {
    return `${year}-01-01,${year}-12-31`;
  }
  return null;
}

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    list: [],
    currentGame: null,
    searchResults: [],
    loading: false,
    error: null,
    pagination: {
      count: 0,
      next: null,
      previous: null,
      currentPage: 1
    }
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
          currentPage: state.pagination.currentPage
        };
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchGameDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGame = action.payload;
      })
      .addCase(fetchGameDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(searchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.results;
      })
      .addCase(searchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentPage, clearSearchResults } = gamesSlice.actions;
export default gamesSlice.reducer;