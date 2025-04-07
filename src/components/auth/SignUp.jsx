import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';

const SignUp = () => {
  const { signUp, isLoaded, setActive } = useSignUp();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  if (!isLoaded) {
    return <div className="text-center py-5">Loading authentication...</div>;
  }

  const validateForm = () => {
    const errors = {};
    
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!acceptTerms) errors.acceptTerms = 'You must accept the terms and conditions';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setGeneralError('');

    try {
      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/');
      } else {
        navigate('/email-verification');
      }
    } catch (err) {
      console.error('Error during sign up:', err);
      setGeneralError(err.errors?.[0]?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4 p-md-5">
              <h1 className="card-title text-center mb-4">Create Account</h1>
              
              {generalError && (
                <div className="alert alert-danger" role="alert">
                  {generalError}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                    />
                    {formErrors.firstName && (
                      <div className="invalid-feedback">{formErrors.firstName}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                    />
                    {formErrors.lastName && (
                      <div className="invalid-feedback">{formErrors.lastName}</div>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                  {formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  {formErrors.password && (
                    <div className="invalid-feedback">{formErrors.password}</div>
                  )}
                  <div className="form-text">
                    Password must be at least 8 characters long.
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  {formErrors.confirmPassword && (
                    <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                  )}
                </div>
                
                <div className="mb-4 form-check">
                  <input
                    type="checkbox"
                    className={`form-check-input ${formErrors.acceptTerms ? 'is-invalid' : ''}`}
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="acceptTerms">
                    I agree to the <Link to="/terms" target="_blank">Terms of Service</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link>
                  </label>
                  {formErrors.acceptTerms && (
                    <div className="invalid-feedback">{formErrors.acceptTerms}</div>
                  )}
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
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>
              
              <hr className="my-4" />
              
              <div className="text-center">
                <p>Already have an account?</p>
                <Link to="/signin" className="btn btn-outline-primary">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;