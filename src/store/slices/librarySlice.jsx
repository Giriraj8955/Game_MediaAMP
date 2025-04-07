import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchUserLibrary = createAsyncThunk(
  'library/fetchUserLibrary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/library');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch library');
    }
  }
);

export const addGameToLibrary = createAsyncThunk(
  'library/addGameToLibrary',
  async (game, { rejectWithValue }) => {
    try {
      
      const response = await api.post('/user/library', {
        gameId: game.id,
        name: game.name,
        background_image: game.background_image,
        genres: game.genres,
        metacritic: game.metacritic,
        favorite: false,
        installed: false,
        lastPlayed: null
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add game to library');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'library/toggleFavorite',
  async (gameId, { getState, rejectWithValue }) => {
    try {
      const { library } = getState();
      const game = library.libraryGames.find(game => game.id === gameId);
      
      if (!game) {
        return rejectWithValue('Game not found in library');
      }
      
      const newStatus = !game.favorite;
      
      const response = await api.patch(`/user/library/${gameId}`, {
        favorite: newStatus
      });
      
      return { gameId, favorite: newStatus };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update favorite status');
    }
  }
);

export const updateInstallStatus = createAsyncThunk(
  'library/updateInstallStatus',
  async ({ gameId, installed }, { getState, rejectWithValue }) => {
    try {
      const { library } = getState();
      const game = library.libraryGames.find(game => game.id === gameId);
      
      if (!game) {
        return rejectWithValue('Game not found in library');
      }
      
      const response = await api.patch(`/user/library/${gameId}`, {
        installed
      });
      
      return { gameId, installed };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update installation status');
    }
  }
);

export const updateLastPlayed = createAsyncThunk(
  'library/updateLastPlayed',
  async (gameId, { rejectWithValue }) => {
    try {
      const timestamp = new Date().toISOString();
      const response = await api.patch(`/user/library/${gameId}`, {
        lastPlayed: timestamp
      });
      
      return { gameId, lastPlayed: timestamp };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update last played time');
    }
  }
);

const librarySlice = createSlice({
  name: 'library',
  initialState: {
    libraryGames: [],
    loading: false,
    error: null
  },
  reducers: {
    resetLibraryError: (state) => {
      state.error = null;
    },
    
    addGameDirectly: (state, action) => {
      const game = action.payload;
      const exists = state.libraryGames.some(item => item.id === game.id);
      if (!exists) {
        state.libraryGames.push({
          ...game,
          favorite: false,
          installed: false,
          lastPlayed: null
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLibrary.fulfilled, (state, action) => {
        state.loading = false;
        state.libraryGames = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUserLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(addGameToLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGameToLibrary.fulfilled, (state, action) => {
        state.loading = false;
        const exists = state.libraryGames.some(game => game.id === action.payload.id);
        if (!exists) {
          state.libraryGames.push(action.payload);
        }
      })
      .addCase(addGameToLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { gameId, favorite } = action.payload;
        const game = state.libraryGames.find(game => game.id === gameId);
        if (game) {
          game.favorite = favorite;
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateInstallStatus.fulfilled, (state, action) => {
        const { gameId, installed } = action.payload;
        const game = state.libraryGames.find(game => game.id === gameId);
        if (game) {
          game.installed = installed;
        }
      })
      .addCase(updateInstallStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateLastPlayed.fulfilled, (state, action) => {
        const { gameId, lastPlayed } = action.payload;
        const game = state.libraryGames.find(game => game.id === gameId);
        if (game) {
          game.lastPlayed = lastPlayed;
        }
      })
      .addCase(updateLastPlayed.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { resetLibraryError, addGameDirectly } = librarySlice.actions;
export default librarySlice.reducer;