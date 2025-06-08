/**
 * @fileoverview ForgotPasswordModal component for the Cross Sums application. Handles the
 * password reset flow through a multi-step modal interface. Includes email verification,
 * reset code input, and new password setup.
 * 
 * @requires React
 * @requires useState
 */

import React, { useState } from 'react';
import './ForgotPasswordModal.css';

/**
 * @typedef {Object} ForgotPasswordModalProps
 * @property {boolean} show - Whether the modal should be displayed
 * @property {function} onClose - Callback function to close the modal
 */

/**
 * Modal component for handling password reset functionality
 * 
 * @component
 * @param {ForgotPasswordModalProps} props - Component props
 * @returns {JSX.Element|null} Rendered modal with password reset form or null if hidden
 * 
 * @example
 * <ForgotPasswordModal show={true} onClose={() => setShowModal(false)} />
 */
export default function ForgotPasswordModal({ show, onClose }) {
  /** @type {[number, function]} State for current step in reset process */
  const [step, setStep] = useState(1);
  
  /** @type {[string, function]} State for user's email */
  const [email, setEmail] = useState('');
  
  /** @type {[string, function]} State for reset code from email */
  const [resetCode, setResetCode] = useState('');
  
  /** @type {[string, function]} State for new password */
  const [newPassword, setNewPassword] = useState('');
  
  /** @type {[boolean, function]} State for loading status */
  const [loading, setLoading] = useState(false);
  
  /** @type {[string, function]} State for success message */
  const [msg, setMsg] = useState('');
  
  /** @type {[string, function]} State for error message */
  const [error, setError] = useState('');

  if (!show) return null;

  /**
   * Handles the initial password reset request
   * @function
   * @param {Event} e - Form submit event
   */
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');
    try {
      const res = await fetch(`http://127.0.0.1:8000/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Reset code sent! Check your email.');
        setStep(2);
      } else {
        setError(data.detail || 'Failed to send reset code.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the password reset with code verification
   * @function
   * @param {Event} e - Form submit event
   */
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');
    try {
      const res = await fetch('http://127.0.0.1:8000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          reset_code: resetCode,
          new_password: newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Password reset! You may now log in.');
        setStep(3);
      } else {
        setError(data.detail || 'Failed to reset password.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Password reset">
      <div className="modal-glass" onClick={e => e.stopPropagation()}>
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close password reset modal"
        >
          &times;
        </button>
        <div className="modal-content">
          {step === 1 && (
            <form onSubmit={handleForgot} className="modal-form">
              <h2>Forgot Password</h2>
              <p>Enter your email to receive a reset code.</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                disabled={loading}
                aria-label="Enter your email address"
              />
              <button 
                type="submit" 
                disabled={loading}
                aria-label={loading ? "Sending reset code..." : "Send reset code"}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
              {error && <div className="modal-error" role="alert">{error}</div>}
              {msg && <div className="modal-msg" role="status">{msg}</div>}
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleReset} className="modal-form">
              <h2>Reset Password</h2>
              <input
                type="text"
                placeholder="Reset Code"
                value={resetCode}
                onChange={e => setResetCode(e.target.value)}
                required
                disabled={loading}
                aria-label="Enter reset code from email"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                disabled={loading}
                aria-label="Enter new password"
              />
              <button 
                type="submit" 
                disabled={loading}
                aria-label={loading ? "Resetting password..." : "Reset password"}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              {error && <div className="modal-error" role="alert">{error}</div>}
              {msg && <div className="modal-msg" role="status">{msg}</div>}
            </form>
          )}
          {step === 3 && (
            <div className="modal-form">
              <h2>Password Reset!</h2>
              <p>You may now log in with your new password.</p>
              <button 
                onClick={onClose}
                aria-label="Close modal and return to login"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
