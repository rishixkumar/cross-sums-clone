import React, { useState } from 'react';
import './ForgotPasswordModal.css';

export default function ForgotPasswordModal({ show, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  if (!show) return null;

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
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
              />
              <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Reset Code"}</button>
              {error && <div className="modal-error">{error}</div>}
              {msg && <div className="modal-msg">{msg}</div>}
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
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button type="submit" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
              {error && <div className="modal-error">{error}</div>}
              {msg && <div className="modal-msg">{msg}</div>}
            </form>
          )}
          {step === 3 && (
            <div className="modal-form">
              <h2>Password Reset!</h2>
              <p>You may now log in with your new password.</p>
              <button onClick={onClose}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
