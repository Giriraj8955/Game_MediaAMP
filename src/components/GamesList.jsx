import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchGames, setCurrentPage } from '../store/slices/gamesSlice';
import Pagination from './Pagination';

const GamesList = () => {
  const dispatch = useDispatch();
  const { list: games, loading, error, pagination } = useSelector((state) => state.games);
  const { currentPage, count } = pagination;
  
  const pageSize = 12;
  const totalPages = Math.ceil(count / pageSize);

  useEffect(() => {
    dispatch(fetchGames({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    window.scrollTo(0, 0);
    dispatch(setCurrentPage(newPage));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading games: {error}
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No games found. Please check your API connection.
      </div>
    );
  }

  return (
    <div className="games-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">Featured Games</h2>
        <div className="dropdown">
          <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            Sort By
          </button>
          <ul className="dropdown-menu" aria-labelledby="sortDropdown">
            <li><button className="dropdown-item">Newest First</button></li>
            <li><button className="dropdown-item">Popular</button></li>
            <li><button className="dropdown-item">Price: Low to High</button></li>
            <li><button className="dropdown-item">Price: High to Low</button></li>
          </ul>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {games.map((game) => (
          <div key={game.id} className="col">
            <div className="card game-card h-100">
              <img
                src={game.thumbnail || game.background_image || 'default-thumbnail.jpg'}
                className="card-img-top"
                alt={game.title || game.name || 'Game Thumbnail'}
              />
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title">{game.title || game.name || 'Untitled Game'}</h5>
                  <span className="badge bg-primary">${game.price || '0.00'}</span>
                </div>
                <p className="card-text text-muted small">{game.genre || game.genres?.[0]?.name || 'Unknown Genre'}</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bi ${i < Math.floor(game.rating || 0) ? 'bi-star-fill' : 'bi-star'} text-warning`}></i>
                    ))}
                  </div>
                  <Link to={`/game/${game.id}`} className="btn btn-sm btn-outline-primary">View Details</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      
      <div className="text-center text-muted mt-3">
        <small>Showing page {currentPage} of {totalPages} ({count} games total)</small>
      </div>
    </div>
  );
};

export default GamesList;