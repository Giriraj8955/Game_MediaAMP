import { createSlice } from '@reduxjs/toolkit';

const loadFavoritesFromStorage = () => {
  try {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error("Error loading favorites from storage:", error);
    return [];
  }
};

const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites to storage:", error);
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: loadFavoritesFromStorage(),
    loading: false,
    error: null
  },
  reducers: {
    addFavorite: (state, action) => {
      const game = action.payload;
      if (!state.items.some(item => item.id === game.id)) {
        state.items.push(game);
        saveFavoritesToStorage(state.items);
      }
    },
    removeFavorite: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      saveFavoritesToStorage(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      saveFavoritesToStorage(state.items);
    }
  }
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;