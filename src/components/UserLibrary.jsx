import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserLibrary } from '../store/slices/librarySlice';
import GameCard from './GameCard';

const UserLibrary = () => {
  const dispatch = useDispatch();
  const { libraryGames, loading, error } = useSelector((state) => state.library);
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    dispatch(fetchUserLibrary());
  }, [dispatch]);
  
  const filterGames = (games, filter) => {
    const gamesArray = Array.isArray(games) ? games : [];
    switch(filter) {
      case 'installed':
        return gamesArray.filter(game => game.installed);
      case 'favorites':
        return gamesArray.filter(game => game.favorite);
      case 'recent':
        return [...gamesArray]
          .filter(game => game.lastPlayed)
          .sort((a, b) => new Date(b.lastPlayed || 0) - new Date(a.lastPlayed || 0))
          .slice(0, 10);
      default:
        return gamesArray;
    }
  };
  
  const filteredGames = filterGames(libraryGames, activeFilter);
  const isLibraryEmpty = !Array.isArray(libraryGames) || libraryGames.length === 0;
  
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-6">My Game Library</h1>
      </div>
      
      <div className="mb-4">
        <div className="btn-group" role="group" aria-label="Library filters">
          <button 
            type="button" 
            className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveFilter('all')}
          >
            All Games
          </button>
          <button 
            type="button" 
            className={`btn ${activeFilter === 'installed' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveFilter('installed')}
          >
            Installed
          </button>
          <button 
            type="button" 
            className={`btn ${activeFilter === 'favorites' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveFilter('favorites')}
          >
            Favorites
          </button>
          <button 
            type="button" 
            className={`btn ${activeFilter === 'recent' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveFilter('recent')}
          >
            Recently Played
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          Error loading your library: {error}
        </div>
      ) : isLibraryEmpty ? (
        <div className="alert alert-info" role="alert">
          Your library is empty. Add games to your library to see them here!
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No {activeFilter === 'all' ? '' : activeFilter} games found.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {filteredGames.map(game => (
            <div key={game.id} className="col">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserLibrary;