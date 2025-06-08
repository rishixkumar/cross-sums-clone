/**
 * @fileoverview Login component for the Cross Sums application. Handles user authentication,
 * account creation, and password reset functionality. Includes form validation and error handling.
 * 
 * @requires React
 * @requires react-router-dom
 * @requires useState
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import './Login.css';

/**
 * Login component that handles user authentication and account creation
 * 
 * @component
 * @returns {JSX.Element} Rendered login page with authentication forms
 * 
 * @example
 * <Login />
 */
export default function Login() {
  /** @type {[boolean, function]} State to toggle between login and signup */
  const [isSignup, setIsSignup] = useState(false);
  
  /** @type {[boolean, function]} State to control forgot password modal */
  const [showForgot, setShowForgot] = useState(false);
  
  /** @type {[boolean, function]} State to toggle password visibility */
  const [showPassword, setShowPassword] = useState(false);
  
  /** @type {[Object, function]} State for form input values */
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  /** @type {[Object, function]} State for form validation errors */
  const [errors, setErrors] = useState({});
  
  /** @type {[boolean, function]} State for loading status */
  const [loading, setLoading] = useState(false);
  
  /** @type {function} Navigation function from react-router */
  const navigate = useNavigate();

  /**
   * Handles input field changes and clears associated errors
   * @function
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validates form inputs and sets error messages
   * @function
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (isSignup && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission for both login and signup
   * @function
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const endpoint = isSignup ? '/signup' : '/login';
      const url = `http://127.0.0.1:8000${endpoint}`;
      
      let response;
      
      if (isSignup) {
        // Signup with JSON
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });
      } else {
        // Login with form data (OAuth2)
        const loginData = new FormData();
        loginData.append('grant_type', 'password');
        loginData.append('username', formData.email);
        loginData.append('password', formData.password);
        
        response = await fetch(url, {
          method: 'POST',
          body: loginData,
        });
      }
      
      const data = await response.json();
      
      if (response.ok) {
        if (isSignup) {
          // After successful signup, switch to login
          setIsSignup(false);
          setFormData({ email: formData.email, password: '', confirmPassword: '' });
          alert('Account created successfully! Please log in.');
        } else {
          // After successful login, store token and redirect
          localStorage.setItem('access_token', data.access_token);
          navigate('/profile');
        }
      } else {
        setErrors({ general: data.detail || 'An error occurred' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
          <p>{isSignup ? 'Sign up to start playing Cross Sums' : 'Sign in to continue your game'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && <div className="error-message" role="alert">{errors.general}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              disabled={loading}
              aria-label="Email address"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <span id="email-error" className="field-error" role="alert">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              disabled={loading}
              aria-label="Password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && <span id="password-error" className="field-error" role="alert">{errors.password}</span>}
            {isSignup && (
              <div className="password-hint">
                Password must be at least 6 characters.
              </div>
            )}
            <div className="see-password-row">
              <input
                type="checkbox"
                id="seePassword"
                checked={showPassword}
                onChange={() => setShowPassword(v => !v)}
                className="see-password-checkbox"
                aria-label="Show password"
              />
              <label htmlFor="seePassword" className="see-password-label">
                Show password
              </label>
            </div>
          </div>
          
          {isSignup && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
                disabled={loading}
                aria-label="Confirm password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              {errors.confirmPassword && (
                <span id="confirm-password-error" className="field-error" role="alert">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
            aria-label={loading ? 'Please wait...' : (isSignup ? 'Create account' : 'Sign in')}
          >
            {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        
        <ForgotPasswordModal show={showForgot} onClose={() => setShowForgot(false)} />

        {!isSignup && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="link-button"
              style={{ fontSize: '1rem', color: '#4e9af1', margin: 0, padding: 0 }}
              onClick={() => setShowForgot(true)}
              disabled={loading}
              aria-label="Forgot password?"
            >
              Forgot password?
            </button>
          </div>
        )}
        
        <div className="login-footer">
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setIsSignup(!isSignup);
                setFormData({ email: '', password: '', confirmPassword: '' });
                setErrors({});
              }}
              disabled={loading}
              aria-label={isSignup ? 'Switch to sign in' : 'Switch to sign up'}
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
