import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, updateInstallStatus, addGameToLibrary, addGameDirectly } from '../store/slices/librarySlice';

const GameCard = ({ game }) => {
  const dispatch = useDispatch();
  const { libraryGames } = useSelector(state => state.library);
 
  const isInLibrary = libraryGames.some(item => item.id === game.id);
  const libraryGame = libraryGames.find(item => item.id === game.id);
  
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isInLibrary) {
      dispatch(addGameToLibrary(game)).unwrap()
        .then(() => {
          dispatch(toggleFavorite(game.id));
        })
        .catch((error) => {
          console.error("Failed to add game to library:", error);
          
          dispatch(addGameDirectly(game));
          setTimeout(() => dispatch(toggleFavorite(game.id)), 100);
        });
    } else {
      dispatch(toggleFavorite(game.id));
    }
  };
  
  const handleInstallToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isInLibrary) {
      dispatch(addGameToLibrary(game)).unwrap()
        .then(() => {
          dispatch(updateInstallStatus({ 
            gameId: game.id, 
            installed: true 
          }));
        })
        .catch((error) => {
          console.error("Failed to add game to library:", error);
          
          dispatch(addGameDirectly(game));
          setTimeout(() => dispatch(updateInstallStatus({ 
            gameId: game.id, 
            installed: true 
          })), 100);
        });
    } else {
      dispatch(updateInstallStatus({ 
        gameId: game.id, 
        installed: !libraryGame.installed 
      }));
    }
  };
  
  return (
    <div className="card h-100 shadow-sm">
      <div className="position-relative">
        <img 
          src={game.background_image || '/placeholder-game.jpg'} 
          className="card-img-top" 
          alt={game.name} 
          style={{ height: '180px', objectFit: 'cover' }} 
        />
        <div className="position-absolute top-0 end-0 p-2">
          <button 
            className={`btn btn-sm ${libraryGame?.favorite ? 'btn-danger' : 'btn-outline-light'}`}
            onClick={handleFavoriteToggle}
            title={libraryGame?.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={`bi ${libraryGame?.favorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          </button>
        </div>
        {game.metacritic && (
          <div className="position-absolute bottom-0 start-0 p-2">
            <span className={`badge ${game.metacritic >= 75 ? 'bg-success' : game.metacritic >= 50 ? 'bg-warning' : 'bg-danger'}`}>
              {game.metacritic}
            </span>
          </div>
        )}
      </div>
      <div className="card-body">
        <h5 className="card-title">{game.name}</h5>
        <p className="card-text small text-muted">
          {game.genres && game.genres.map(genre => genre.name).join(', ')}
        </p>
      </div>
      <div className="card-footer bg-white d-flex justify-content-between">
        <button
          className={`btn btn-sm ${libraryGame?.installed ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={handleInstallToggle}
        >
          <i className={`bi ${libraryGame?.installed ? 'bi-check-circle-fill' : 'bi-download'} me-1`}></i>
          {libraryGame?.installed ? 'Installed' : 'Install'}
        </button>
        <Link to={`/games/${game.id}`} className="btn btn-sm btn-primary">
          <i className="bi bi-play-fill me-1"></i>
          Play
        </Link>
      </div>
    </div>
  );
};

export default GameCard;