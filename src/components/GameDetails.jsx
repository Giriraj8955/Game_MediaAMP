import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGameDetails } from '../store/slices/gamesSlice';
import { addFavorite, removeFavorite } from '../store/slices/FavoritesSlice';

const GameDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentGame, loading, error } = useSelector((state) => state.games);
  const { items: favorites } = useSelector((state) => state.favorites);
  const [activeTab, setActiveTab] = useState('overview');
  const [isInFavorites, setIsInFavorites] = useState(false);
  
  useEffect(() => {

    const gameId = parseInt(id, 10) || id;

    dispatch(fetchGameDetails(gameId));

    window.scrollTo(0, 0);
  }, [dispatch, id]);

  useEffect(() => {
    if (currentGame && favorites) {
      setIsInFavorites(favorites.some(item => item.id === currentGame.id));
    }
  }, [currentGame, favorites]);

  const handleWishlistToggle = () => {
    if (isInFavorites) {
      dispatch(removeFavorite(currentGame.id));
    } else {
      dispatch(addFavorite({
        id: currentGame.id,
        name: currentGame.name,
        background_image: currentGame.background_image,
        metacritic: currentGame.metacritic
      }));
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          Error loading game details: {error}
        </div>
      </div>
    );
  }
  
  if (!currentGame) {
    return (
      <div className="container py-5">
        <div className="alert alert-info" role="alert">
          Game not found. Please check the game ID.
        </div>
      </div>
    );
  }

  const { 
    name: title = 'Unknown Title', 
    description_raw: description = 'No description available', 
    metacritic: rating = 0,
    released: releaseDate = 'Unknown Release Date',
    developers = [],
    publishers = [],
    genres = [],
    platforms = [],
    tags = [],
    background_image: mainImage,
    screenshots = [],
    price = 59.99 
  } = currentGame;

  const developer = developers && developers.length > 0 ? developers[0].name : 'Unknown Developer';
  const publisher = publishers && publishers.length > 0 ? publishers[0].name : 'Unknown Publisher';
  
  const genreDisplay = genres && genres.length > 0 ? genres[0].name : 'Unknown Genre';

  const images = [mainImage, ...screenshots.map(screenshot => screenshot.image)].filter(Boolean);

  const systemRequirements = {
    minimum: {
      os: 'Windows 10 64-bit',
      processor: 'Intel Core i5-2500K / AMD FX-6300',
      memory: '8 GB RAM',
      graphics: 'Nvidia GTX 770 2GB / AMD Radeon R9 280 3GB',
      storage: '70 GB available space'
    },
    recommended: {
      os: 'Windows 10 64-bit',
      processor: 'Intel Core i7-4770K / AMD Ryzen 5 1500X',
      memory: '12 GB RAM',
      graphics: 'Nvidia GTX 1060 6GB / AMD Radeon RX 480 8GB',
      storage: '70 GB available space'
    }
  };

  return (
    <div className="game-details container py-5">
      <div className="row">
        <div className="col-lg-8">
          {/* Game hero */}
          <div className="position-relative mb-4">
            <img src={images[0] || 'default-game-image.jpg'} className="img-fluid rounded" alt={title} />
            <div className="position-absolute top-0 end-0 m-3">
              <span className="badge bg-dark p-2">{genreDisplay}</span>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h1 className="display-5 fw-bold">{title}</h1>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`bi ${i < Math.floor(rating/20) ? 'bi-star-fill' : 'bi-star'} text-warning`}></i>
                  ))}
                </div>
                <span className="text-muted">({rating} Metacritic)</span>
              </div>
            </div>
            <div className="text-end">
              <h3 className="mb-2">${price}</h3>
              <button className="btn btn-primary btn-lg">Add to Cart</button>
            </div>
          </div>
          
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} 
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'requirements' ? 'active' : ''}`} 
                onClick={() => setActiveTab('requirements')}
              >
                System Requirements
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`} 
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </li>
          </ul>
          
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div>
                <h3>About the Game</h3>
                <p className="lead" dangerouslySetInnerHTML={{ __html: currentGame.description || description }}></p>
                
                <div className="row mt-4">
                  <div className="col-md-6">
                    <h4>Game Details</h4>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Developer:</span>
                        <span className="fw-bold">{developer}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Publisher:</span>
                        <span className="fw-bold">{publisher}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Release Date:</span>
                        <span className="fw-bold">{releaseDate}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Genre:</span>
                        <span className="fw-bold">{genres.map(g => g.name).join(', ')}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Platforms:</span>
                        <span className="fw-bold">
                          {platforms.map(p => p.platform?.name).join(', ')}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="col-md-6">
                    <h4>Game Tags</h4>
                    <div className="d-flex flex-wrap gap-2">
                      {tags.slice(0, 10).map((tag) => (
                        <span key={tag.id} className="badge bg-secondary">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <h4 className="mt-4">Screenshots</h4>
                <div className="row g-3 mt-2">
                  {screenshots.slice(0, 6).map((screenshot, index) => (
                    <div key={index} className="col-6 col-md-4">
                      <img src={screenshot.image} className="img-fluid rounded" alt={`${title} screenshot ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'requirements' && (
              <div>
                <h3>System Requirements</h3>
                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Minimum Requirements</h5>
                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between">
                            <span>OS:</span>
                            <span>{systemRequirements?.minimum?.os || 'N/A'}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Processor:</span>
                            <span>{systemRequirements?.minimum?.processor || 'N/A'}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Memory:</span>
                            <span>{systemRequirements?.minimum?.memory || 'N/A'}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Graphics:</span>
                            <span>{systemRequirements?.minimum?.graphics || 'N/A'}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Storage:</span>
                            <span>{systemRequirements?.minimum?.storage || 'N/A'}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Recommended Requirements</h5>
                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between">
                            <span>OS:</span>
                            <span>{systemRequirements?.recommended?.os || 'N/A'}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Processor:</span>
                            <span>{systemRequirements?.recommended?.processor || 'N/A'}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Memory:</span>
                            <span>{systemRequirements?.recommended?.memory || 'N/A'}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Graphics:</span>
                            <span>{systemRequirements?.recommended?.graphics || 'N/A'}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Storage:</span>
                            <span>{systemRequirements?.recommended?.storage || 'N/A'}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3>User Reviews</h3>
                  <button className="btn btn-outline-primary">Write a Review</button>
                </div>
                
                <div className="alert alert-info">
                  No reviews yet. Be the first to review this game!
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Game Actions</h5>
              <div className="d-grid gap-2">
                <button className="btn btn-primary">
                  <i className="bi bi-cart-plus me-2"></i> Add to Cart
                </button>
                <button 
                  className={`btn ${isInFavorites ? 'btn-danger' : 'btn-outline-primary'}`}
                  onClick={handleWishlistToggle}
                >
                  <i className={`bi ${isInFavorites ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i> 
                  {isInFavorites ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
                <button className="btn btn-outline-primary">
                  <i className="bi bi-share me-2"></i> Share
                </button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Similar Games</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="text-center py-3">
                  <p className="text-muted">Similar games will be shown here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;