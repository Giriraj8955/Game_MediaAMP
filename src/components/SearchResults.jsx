import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { searchGames } from '../store/slices/gamesSlice';
import GameCard from './GameCard';
import LoadingSpinner from './common/LoadingSpinner';

const SearchResults = ({ query }) => {
  const dispatch = useDispatch();
  const { searchResults, loading, error } = useSelector((state) => state.games);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    genre: '',
    platform: '',
    price: '',
    sort: 'relevance'
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const searchQuery = searchParams.get('q') || query || '';

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearch) {
      dispatch(searchGames({ 
        query: debouncedSearch, 
        ...filters 
      }));
    }
  }, [dispatch, debouncedSearch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    <div className="search-results">
      <h2>Search Results for "{searchQuery}"</h2>
      
      <div className="filter-controls bg-light p-3 rounded mb-4">
        <div className="row">
          <div className="col-md-3 mb-2">
            <label className="form-label">Genre</label>
            <select 
              className="form-select" 
              name="genre" 
              value={filters.genre} 
              onChange={handleFilterChange}
            >
              <option value="">All Genres</option>
              <option value="action">Action</option>
              <option value="adventure">Adventure</option>
              <option value="rpg">RPG</option>
              <option value="strategy">Strategy</option>
              <option value="sports">Sports</option>
              <option value="simulation">Simulation</option>
            </select>
          </div>
          <div className="col-md-3 mb-2">
            <label className="form-label">Platform</label>
            <select 
              className="form-select" 
              name="platform" 
              value={filters.platform} 
              onChange={handleFilterChange}
            >
              <option value="">All Platforms</option>
              <option value="pc">PC</option>
              <option value="playstation">PlayStation</option>
              <option value="xbox">Xbox</option>
              <option value="nintendo">Nintendo</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
          <div className="col-md-3 mb-2">
            <label className="form-label">Price</label>
            <select 
              className="form-select" 
              name="price" 
              value={filters.price} 
              onChange={handleFilterChange}
            >
              <option value="">Any Price</option>
              <option value="free">Free</option>
              <option value="under10">Under $10</option>
              <option value="under20">Under $20</option>
              <option value="under30">Under $30</option>
              <option value="under60">Under $60</option>
            </select>
          </div>
          <div className="col-md-3 mb-2">
            <label className="form-label">Sort By</label>
            <select 
              className="form-select" 
              name="sort" 
              value={filters.sort} 
              onChange={handleFilterChange}
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">User Rating</option>
              <option value="release_date">Release Date</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}

      {!loading && searchResults && searchResults.length === 0 ? (
        <div className="alert alert-info">
          No games found matching "{searchQuery}". Try adjusting your search terms or filters.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {searchResults && searchResults.map(game => (
            <div className="col" key={game.id}>
              <GameCard game={game} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;