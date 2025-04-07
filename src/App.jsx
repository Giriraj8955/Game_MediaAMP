import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import store from './store/store';

import GamesNavbar from './components/GamesNavbar';
import HeroSection from './components/HeroSection';
import GamesSidebar from './components/GamesSidebar';
import GamesList from './components/GamesList';
import Pagination from './components/Pagination';
import GameDetails from './components/GameDetails';
import Footer from './components/Footer';
import UserLibrary from './components/UserLibrary';
import SearchResults from './components/SearchResults';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/App.css';

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const clerkPubKey = 'pk_test_Ym9zcy12dWx0dXJlLTIyLmNsZXJrLmFjY291bnRzLmRldiQ';

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Provider store={store}>
        <Router>
          <div className="app-container d-flex flex-column min-vh-100">
            <GamesNavbar onSearch={handleSearch} />
            
            <Routes>
              <Route path="/" element={
                <>
                  <HeroSection />
                  <div className="container-fluid py-4">
                    <div className="row">
                      <div className="col-lg-3 col-md-4 mb-4 mb-md-0">
                        <GamesSidebar />
                      </div>
                      <div className="col-lg-9 col-md-8">
                        <GamesList />
                      </div>
                    </div>
                  </div>
                </>
              } />
              
              <Route path="/game/:id" element={<GameDetails />} />
              
              <Route path="/search" element={
                <div className="container-fluid py-4">
                  <div className="row">
                    <div className="col-lg-3 col-md-4 mb-4 mb-md-0">
                      <GamesSidebar />
                    </div>
                    <div className="col-lg-9 col-md-8">
                      <SearchResults query={searchQuery} />
                    </div>
                  </div>
                </div>
              } />
              
              <Route path="/library" element={
                <ProtectedRoute>
                  <div className="container-fluid py-4">
                    <div className="row">
                      <div className="col-lg-3 col-md-4 mb-4 mb-md-0">
                        <GamesSidebar />
                      </div>
                      <div className="col-lg-9 col-md-8">
                        <UserLibrary />
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
            
            <Footer />
          </div>
        </Router>
      </Provider>
    </ClerkProvider>
  );
}

export default App;