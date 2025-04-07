import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';

const SignIn = () => {
  const { signIn, isLoaded, setActive } = useSignIn();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  if (!isLoaded) {
    return <div className="text-center py-5">Loading authentication...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/');
      } else {
        
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error during sign in:', err);
      setError(err.errors?.[0]?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4 p-md-5">
              <h1 className="card-title text-center mb-4">Sign In</h1>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
                
                <div className="text-center mt-3">
                  <Link to="/forgot-password" className="text-decoration-none">
                    Forgot password?
                  </Link>
                </div>
              </form>
              
              <hr className="my-4" />
              
              <div className="text-center">
                <p>Don't have an account?</p>
                <Link to="/signup" className="btn btn-outline-primary">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;