import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { searchGames, clearSearchResults } from '../store/slices/gamesSlice';
import { setSearchQuery } from '../store/slices/filtersSlice';
import { Navbar, Nav, Container, Form, Button, NavDropdown, Badge, InputGroup, Dropdown } from 'react-bootstrap';

const GamesNavbar = ({ onSearch }) => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const favorites = useSelector(state => state.favorites.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    dispatch(setSearchQuery(query));
    dispatch(searchGames(query));
    onSearch(query);
    navigate('/search');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div>
      <div className="bg-dark text-white py-1">
        <Container className="d-flex justify-content-end align-items-center">
          {isSignedIn ? (
            <>
              <Link to="/library" className="text-white text-decoration-none me-3">
                <i className="bi bi-bookmark me-1"></i>
                <Badge bg="primary" pill>{favorites?.length || 0}</Badge>
              </Link>
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" className="text-white text-decoration-none p-0">
                  <i class="bi bi-person-circle"></i>
                  <small>{user.firstName || 'User'}</small>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/library">My Library</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <>
              <small className="me-3">
                <Link to="/signin" className="text-white text-decoration-none">Login</Link>
              </small>
              <small>
                <Link to="/signup" className="text-white text-decoration-none">Sign Up</Link>
              </small>
            </>
          )}
        </Container>
      </div>

      <Navbar 
        bg="primary" 
        variant="dark" 
        expand="lg" 
        expanded={expanded} 
        className="py-2"
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <span className="fw-bold fs-4"><i class="bi bi-controller"></i>  GamesHub</span>
          </Navbar.Brand>
          
          <Navbar.Toggle 
            aria-controls="navbar-nav" 
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          
          <Navbar.Collapse id="navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/" className="px-3 fw-bold">HOME</Nav.Link>
              <NavDropdown title="PLATFORMS" id="platforms-dropdown" className="px-2">
                <NavDropdown.Item as={Link} to="/?platform=pc">PC</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/?platform=playstation">PlayStation</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/?platform=xbox">Xbox</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/?platform=nintendo">Nintendo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/?platform=mobile">Mobile</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="GAMES" id="games-dropdown" className="px-2">
                <NavDropdown.Item as={Link} to="/?sort=released">New Releases</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/?upcoming=true">Upcoming</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/?sort=rating">Top Rated</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/?sort=popularity">Most Popular</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/games">Games Database</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/reviews" className="px-3 fw-bold">REVIEWS</Nav.Link>
              <Nav.Link as={Link} to="/news" className="px-3 fw-bold">NEWS</Nav.Link>
              <NavDropdown title="COMMUNITY" id="community-dropdown" className="px-2">
                <NavDropdown.Item as={Link} to="/forums">Forums</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/discord">Discord</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/streaming">Streaming</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/events">Events</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            
            <Form className="d-flex" onSubmit={handleSearchSubmit}>
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Search games..."
                  aria-label="Search"
                  size="sm"
                  className="rounded-start"
                  value={query}
                  onChange={handleSearchChange}
                />
                <Button variant="light" size="sm" type="submit">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <div className="bg-light py-2 border-bottom">
        <Container>
          <ul className="list-unstyled d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mb-0">
            <li><Link to="/?category=action" className="text-decoration-none text-secondary">Action</Link></li>
            <li><Link to="/?category=adventure" className="text-decoration-none text-secondary">Adventure</Link></li>
            <li><Link to="/?category=rpg" className="text-decoration-none text-secondary">RPG</Link></li>
            <li><Link to="/?category=strategy" className="text-decoration-none text-secondary">Strategy</Link></li>
            <li><Link to="/?category=sports" className="text-decoration-none text-secondary">Sports</Link></li>
            <li><Link to="/?category=simulation" className="text-decoration-none text-secondary">Simulation</Link></li>
            <li><Link to="/?category=indie" className="text-decoration-none text-secondary">Indie</Link></li>
            <li><Link to="/?category=horror" className="text-decoration-none text-secondary">Horror</Link></li>
            <li><Link to="/?category=mmo" className="text-decoration-none text-secondary">MMO</Link></li>
          </ul>
        </Container>
      </div>
    </div>
  );
};

export default GamesNavbar;
