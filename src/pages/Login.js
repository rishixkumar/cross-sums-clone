import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import './Login.css';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          {errors.general && <div className="error-message">{errors.general}</div>}
          
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
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
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
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
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
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          )}
          
          <button type="submit" className="submit-button" disabled={loading}>
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
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
