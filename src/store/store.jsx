import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './slices/gamesSlice';
import libraryReducer from './slices/librarySlice';
import filtersReducer from './slices/filtersSlice';
import favoritesReducer from './slices/FavoritesSlice';

const store = configureStore({
  reducer: {
    games: gamesReducer,
    library: libraryReducer,
    filters: filtersReducer,
    favorites: favoritesReducer
  }
});

export default store;