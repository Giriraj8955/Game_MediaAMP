import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-4 bg-dark text-white">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h5 className="text-uppercase mb-3">GameHub</h5>
            <p className="mb-3">Your ultimate destination for gaming. Discover, buy, and play the best games across all platforms.</p>
            <div className="d-flex gap-2">
              <a href="https://facebook.com" className="text-white" aria-label="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://twitter.com" className="text-white" aria-label="Twitter">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="https://instagram.com" className="text-white" aria-label="Instagram">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="https://discord.com" className="text-white" aria-label="Discord">
                <i className="bi bi-discord fs-5"></i>
              </a>
            </div>
          </div>
          
          <div className="col-sm-6 col-lg-2 mb-4 mb-lg-0">
            <h6 className="text-uppercase mb-3">Shop</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/search?platform=pc" className="text-white-50 text-decoration-none">PC Games</Link></li>
              <li className="mb-2"><Link to="/search?platform=playstation" className="text-white-50 text-decoration-none">PlayStation</Link></li>
              <li className="mb-2"><Link to="/search?platform=xbox" className="text-white-50 text-decoration-none">Xbox</Link></li>
              <li className="mb-2"><Link to="/search?platform=nintendo" className="text-white-50 text-decoration-none">Nintendo</Link></li>
              <li className="mb-2"><Link to="/search?type=dlc" className="text-white-50 text-decoration-none">DLC & Add-ons</Link></li>
            </ul>
          </div>
          
          <div className="col-sm-6 col-lg-2 mb-4 mb-lg-0">
            <h6 className="text-uppercase mb-3">Account</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/signin" className="text-white-50 text-decoration-none">Sign In</Link></li>
              <li className="mb-2"><Link to="/signup" className="text-white-50 text-decoration-none">Create Account</Link></li>
              <li className="mb-2"><Link to="/library" className="text-white-50 text-decoration-none">My Library</Link></li>
              <li className="mb-2"><Link to="/wishlist" className="text-white-50 text-decoration-none">Wishlist</Link></li>
              <li className="mb-2"><Link to="/orders" className="text-white-50 text-decoration-none">Order History</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-4">
            <h6 className="text-uppercase mb-3">Stay Updated</h6>
            <p className="mb-3">Subscribe to our newsletter for the latest game releases, exclusive deals, and gaming news.</p>
            <div className="input-group mb-3">
              <input type="email" className="form-control" placeholder="Your email address" aria-label="Email address" />
              <button className="btn btn-primary" type="button">Subscribe</button>
            </div>
          </div>
        </div>
        
        <hr className="my-4 bg-secondary" />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="small text-white-50 mb-0">&copy; 2025 GameHub. All rights reserved.</p>
          </div>
          <div className="col-md-6">
            <ul className="list-inline text-center text-md-end mb-0">
              <li className="list-inline-item"><Link to="/about" className="text-white-50 text-decoration-none small">About Us</Link></li>
              <li className="list-inline-item ms-3"><Link to="/terms" className="text-white-50 text-decoration-none small">Terms of Service</Link></li>
              <li className="list-inline-item ms-3"><Link to="/privacy" className="text-white-50 text-decoration-none small">Privacy Policy</Link></li>
              <li className="list-inline-item ms-3"><Link to="/contact" className="text-white-50 text-decoration-none small">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;