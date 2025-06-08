/**
 * @fileoverview Settings component for the Cross Sums application. Handles user account settings,
 * password management, and theme customization. Includes color pickers and preset themes.
 * 
 * @requires React
 * @requires useState
 * @requires useEffect
 * @requires lucide-react
 * @requires react-colorful
 */

import React, { useState, useEffect } from 'react';
import { User, Lock, Palette } from 'lucide-react';
import { HexColorPicker } from "react-colorful";
import './Settings.css';
//--------------------------------------------------------

/**
 * Predefined color theme presets
 * @type {Array<Object>}
 * @property {string} name - Theme name
 * @property {string} background - Background color in hex
 * @property {string} box - Box/container color in hex
 * @property {string} text - Text color in hex
 */
const PRESETS = [
    {
        name: "Modern Blue",
        background: "#e9f3fa",
        box: "#ffffff",
        text: "#2c3e50"
    },
    {
        name: "Soft Dark",
        background: "#181c24",
        box: "#232b39",
        text: "#e9f3fa"
    },
    {
        name: "Pastel Green",
        background: "#e6f9f0",
        box: "#d4f3e3",
        text: "#1b4332"
    },
    {
        name: "High Contrast",
        background: "#ffffff",
        box: "#000000",
        text: "#ffcc00"
    }
];
//--------------------------------------------------------

/**
 * Determines if a color is light or dark based on its luminance
 * 
 * @function
 * @param {string} hex - Hex color code to analyze
 * @returns {boolean} True if the color is light, false if dark
 */
const isLightColor = (hex) => {
  // Add validation to prevent undefined errors
  if (!hex || typeof hex !== 'string' || hex.length < 7) {
    return false; // Default to dark if invalid
  }
  
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Calculate luminance using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if light (luminance > 0.5)
  return luminance > 0.5;
};

/**
 * Settings component for managing user preferences and account settings
 * 
 * @component
 * @returns {JSX.Element} Rendered settings page with account, password, and theme sections
 * 
 * @example
 * <Settings />
 */
export default function Settings() {
  /** @type {[string, function]} State for active tab */
  const [activeTab, setActiveTab] = useState('account');
  
  /** @type {[boolean, function]} State for loading status */
  const [loading, setLoading] = useState(true);
  
  /** @type {[Object, function]} State for user settings */
  const [settings, setSettings] = useState({ name: '', email: '', color_scheme: 'default' });
  
  /** @type {[Object, function]} State for edit form */
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  
  /** @type {[string, function]} State for edit success message */
  const [editMsg, setEditMsg] = useState('');
  
  /** @type {[string, function]} State for edit error message */
  const [editError, setEditError] = useState('');
  
  /** @type {[Object, function]} State for password form */
  const [pwForm, setPwForm] = useState({ old: '', new: '', confirm: '' });
  
  /** @type {[string, function]} State for password success message */
  const [pwMsg, setPwMsg] = useState('');
  
  /** @type {[string, function]} State for password error message */
  const [pwError, setPwError] = useState('');
  
  /** @type {[boolean, function]} State for password update loading */
  const [pwLoading, setPwLoading] = useState(false);
  
  /** @type {[boolean, function]} State for password visibility */
  const [showPw, setShowPw] = useState(false);
  const [showPwNew, setShowPwNew] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  
  /** @type {[Object, function]} State for theme colors */
  const [theme, setTheme] = useState({
    background: settings.color_scheme?.background || "#e9f3fa",
    box: settings.color_scheme?.box || "#fff",
    text: settings.color_scheme?.text || "#2c3e50"
  });
  
  /** @type {[string, function]} State for theme success message */
  const [themeMsg, setThemeMsg] = useState('');
  
  /** @type {[string, function]} State for theme error message */
  const [themeError, setThemeError] = useState('');
  
  /** @type {[boolean, function]} State for theme save loading */
  const [themeLoading, setThemeLoading] = useState(false);

  /**
   * Effect to update theme when settings change
   * @function
   */
  useEffect(() => {
    if (settings.color_scheme) {
      setTheme({
        background: settings.color_scheme.background || "#e9f3fa",
        box: settings.color_scheme.box || "#fff",
        text: settings.color_scheme.text || "#2c3e50"
      });
      // Apply theme to CSS variables
      applyTheme(settings.color_scheme);
    }
  }, [settings.color_scheme]);

  /**
   * Applies theme colors to CSS variables and calculates contrast
   * 
   * @function
   * @param {Object} scheme - Color scheme object
   */
  const applyTheme = (scheme) => {
    if (!scheme) return;
    
    // Provide default values if properties are missing
    const background = scheme.background || "#e9f3fa";
    const box = scheme.box || "#ffffff";
    const text = scheme.text || "#2c3e50";
    
    const root = document.documentElement;
    
    // Set base color variables
    root.style.setProperty('--bg', background);
    root.style.setProperty('--box', box);
    root.style.setProperty('--text', text);
    
    // Calculate contrast colors based on background lightness
    const boxIsLight = isLightColor(box);
    
    // Set contrast variables for score cards
    if (boxIsLight) {
      // Box is light, make score cards darker
      root.style.setProperty('--score-card-bg', `color-mix(in srgb, ${box} 50%, black)`);
    } else {
      // Box is dark, make score cards lighter
      root.style.setProperty('--score-card-bg', `color-mix(in srgb, ${box} 50%, white)`);
    }
    
    // Fallback for browsers without color-mix support
    if (!CSS.supports('background', 'color-mix(in srgb, #000 50%, #fff)')) {
      if (boxIsLight) {
        root.style.setProperty('--score-card-filter', 'brightness(0.5)');
      } else {
        root.style.setProperty('--score-card-filter', 'brightness(1.5)');
      }
    }
    
    // Also force apply to body (fallback)
    document.body.style.background = background;
    document.body.style.color = text;
  };

  /**
   * Effect to preview theme changes in real-time
   * @function
   */
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  /**
   * Saves theme settings to the backend
   * @function
   */
  const handleThemeSave = async () => {
    setThemeMsg('');
    setThemeError('');
    setThemeLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://127.0.0.1:8000/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ color_scheme: theme })
      });
      const data = await res.json();
      if (res.ok) {
        setThemeMsg('Theme saved!');
        setSettings(s => ({ ...s, color_scheme: theme }));
      } else {
        setThemeError(data.detail || 'Failed to save theme.');
      }
    } catch {
      setThemeError('Network error.');
    }
    setThemeLoading(false);
  };

  /**
   * Effect to fetch user settings on component mount
   * @function
   */
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setEditMsg('');
      setEditError('');
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://127.0.0.1:8000/settings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        setSettings(data);
        setEditForm({ name: data.name || '', email: data.email || '' });
      } catch (err) {
        setEditError('Could not load settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  //--------------------------------------------------------
  /**
   * Handles account information updates
   * @function
   * @param {Event} e - Form submit event
   */
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setEditMsg('');
    setEditError('');
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://127.0.0.1:8000/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
        setEditMsg('Account updated!');
      } else {
        setEditError(data.detail || 'Update failed.');
      }
    } catch {
      setEditError('Network error.');
    }
  };

  //--------------------------------------------------------
  /**
   * Handles password updates
   * @function
   * @param {Event} e - Form submit event
   */
  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwMsg('');
    setPwError('');
    setPwLoading(true);
    if (pwForm.new.length < 6) {
      setPwError('New password must be at least 6 characters.');
      setPwLoading(false);
      return;
    }
    if (pwForm.new !== pwForm.confirm) {
      setPwError('New passwords do not match.');
      setPwLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://127.0.0.1:8000/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: pwForm.old,
          new_password: pwForm.new,
          confirm_password: pwForm.confirm
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg('Password updated!');
        setPwForm({ old: '', new: '', confirm: '' });
      } else {
        setPwError(data.detail || 'Password update failed.');
      }
    } catch {
      setPwError('Network error.');
    }
    setPwLoading(false);
  };

  //--------------------------------------------------------
  /**
   * Navigation tabs configuration
   * @type {Array<Object>}
   */
  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={20} /> },
    { id: 'password', label: 'Password', icon: <Lock size={20} /> },
    { id: 'theme', label: 'Theme', icon: <Palette size={20} /> }
  ];

  //--------------------------------------------------------
  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account preferences and personalization</p>
        </div>

        {/* Navigation Tabs */}
        <div className="settings-tabs" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
            >
              <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="settings-content">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="settings-section" role="tabpanel" id="account-panel">
              <h2>Account Information</h2>
              <p className="section-description">Update your personal information</p>
              {loading ? (
                <div className="placeholder-card" role="status">Loading...</div>
              ) : (
                <form className="settings-form" onSubmit={handleAccountSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      maxLength={32}
                      placeholder="Your name"
                      aria-label="Your name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                      required
                      placeholder="your@email.com"
                      aria-label="Your email address"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="submit-button"
                    aria-label="Save account changes"
                  >
                    Save Changes
                  </button>
                  {editMsg && <div className="modal-msg" role="status" style={{marginTop: 8}}>{editMsg}</div>}
                  {editError && <div className="modal-error" role="alert" style={{marginTop: 8}}>{editError}</div>}
                </form>
              )}
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="settings-section" role="tabpanel" id="password-panel">
              <h2>Change Password</h2>
              <p className="section-description">Update your password for security</p>
              <form className="settings-form" onSubmit={handlePwSubmit}>
                <div className="form-group">
                  <label htmlFor="current-password">Current Password</label>
                  <input
                    id="current-password"
                    type={showPw ? "text" : "password"}
                    value={pwForm.old}
                    onChange={e => setPwForm(f => ({ ...f, old: e.target.value }))}
                    required
                    aria-label="Current password"
                  />
                  <div className="see-password-row">
                    <input
                      type="checkbox"
                      id="seePw"
                      checked={showPw}
                      onChange={() => setShowPw(v => !v)}
                      className="see-password-checkbox"
                      aria-label="Show current password"
                    />
                    <label htmlFor="seePw" className="see-password-label">
                      Show password
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type={showPwNew ? "text" : "password"}
                    value={pwForm.new}
                    onChange={e => setPwForm(f => ({ ...f, new: e.target.value }))}
                    required
                    aria-label="New password"
                  />
                  <div className="password-hint">
                    Password must be at least 6 characters.
                  </div>
                  <div className="see-password-row">
                    <input
                      type="checkbox"
                      id="seePwNew"
                      checked={showPwNew}
                      onChange={() => setShowPwNew(v => !v)}
                      className="see-password-checkbox"
                      aria-label="Show new password"
                    />
                    <label htmlFor="seePwNew" className="see-password-label">
                      Show password
                    </label>
                  </div>
                </div>
                <div className="form-group confirm-new-password">
                  <label htmlFor="confirm-password">Confirm New Password</label>
                  <input
                    id="confirm-password"
                    type={showPwConfirm ? "text" : "password"}
                    value={pwForm.confirm}
                    onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                    required
                    aria-label="Confirm new password"
                  />
                  <div className="see-password-row">
                    <input
                      type="checkbox"
                      id="seePwConfirm"
                      checked={showPwConfirm}
                      onChange={() => setShowPwConfirm(v => !v)}
                      className="see-password-checkbox"
                      aria-label="Show confirm password"
                    />
                    <label htmlFor="seePwConfirm" className="see-password-label">
                      Show password
                    </label>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={pwLoading}
                  aria-label={pwLoading ? "Updating password..." : "Change password"}
                >
                  {pwLoading ? "Updating..." : "Change Password"}
                </button>
                {pwMsg && <div className="modal-msg" role="status" style={{marginTop: 8}}>{pwMsg}</div>}
                {pwError && <div className="modal-error" role="alert" style={{marginTop: 8}}>{pwError}</div>}
              </form>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="settings-section" role="tabpanel" id="theme-panel">
              <h2>Color Theme</h2>
              <p className="section-description">
                Customize your experience. Choose colors or pick a preset.
              </p>
              <div className="theme-pickers-row">
                <div className="theme-picker">
                  <label htmlFor="background-picker">Background</label>
                  <HexColorPicker
                    id="background-picker"
                    color={theme.background}
                    onChange={color => setTheme(t => ({ ...t, background: color }))}
                    aria-label="Background color picker"
                  />
                  <input
                    type="text"
                    value={theme.background}
                    onChange={e => setTheme(t => ({ ...t, background: e.target.value }))}
                    className="theme-color-input"
                    aria-label="Background color hex value"
                  />
                </div>
                <div className="theme-picker">
                  <label htmlFor="box-picker">Box</label>
                  <HexColorPicker
                    id="box-picker"
                    color={theme.box}
                    onChange={color => setTheme(t => ({ ...t, box: color }))}
                    aria-label="Box color picker"
                  />
                  <input
                    type="text"
                    value={theme.box}
                    onChange={e => setTheme(t => ({ ...t, box: e.target.value }))}
                    className="theme-color-input"
                    aria-label="Box color hex value"
                  />
                </div>
                <div className="theme-picker">
                  <label htmlFor="text-picker">Text</label>
                  <HexColorPicker
                    id="text-picker"
                    color={theme.text}
                    onChange={color => setTheme(t => ({ ...t, text: color }))}
                    aria-label="Text color picker"
                  />
                  <input
                    type="text"
                    value={theme.text}
                    onChange={e => setTheme(t => ({ ...t, text: e.target.value }))}
                    className="theme-color-input"
                    aria-label="Text color hex value"
                  />
                </div>
              </div>
              <div className="theme-presets-row" role="group" aria-label="Theme presets">
                {PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    className="theme-preset-btn"
                    style={{
                      background: preset.background,
                      color: preset.text,
                      border: `2px solid ${preset.box}`,
                      marginRight: 12
                    }}
                    onClick={() => setTheme({
                      background: preset.background,
                      box: preset.box,
                      text: preset.text
                    })}
                    type="button"
                    aria-label={`Apply ${preset.name} theme`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
              <div 
                className="theme-preview-box" 
                style={{
                  background: theme.box,
                  color: theme.text,
                  border: `2px solid ${theme.background}`,
                  marginTop: 24
                }}
                role="region"
                aria-label="Theme preview"
              >
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 24 }}>Preview</div>
                <div style={{ fontFamily: 'Old Standard TT', fontSize: 16 }}>
                  This is how your theme will look!
                </div>
              </div>
              <button
                className="submit-button"
                style={{ marginTop: 24 }}
                onClick={handleThemeSave}
                disabled={themeLoading}
                aria-label={themeLoading ? "Saving theme..." : "Save theme"}
              >
                {themeLoading ? "Saving..." : "Save Theme"}
              </button>
              {themeMsg && <div className="modal-msg" role="status" style={{marginTop: 8}}>{themeMsg}</div>}
              {themeError && <div className="modal-error" role="alert" style={{marginTop: 8}}>{themeError}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
