/**
 * @fileoverview Main application component for Cross Sums. Handles routing, theme management,
 * and renders the game interface. Includes both the main App component and the Game component.
 * 
 * @requires React
 * @requires react-router-dom
 * @requires useEffect
 */

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Profile from './pages/Profile';
import Scores from './pages/Scores';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Settings from './pages/Settings';
import DifficultyModal from './components/DifficultyModal';
import './App.css';

/**
 * Game component that renders the main game interface
 * 
 * @component
 * @returns {JSX.Element} Rendered game interface with controls
 * 
 * @example
 * <Game />
 */
function Game() {
  /** @type {[boolean, function]} State to control eraser mode */
  const [isEraserMode, setIsEraserMode] = useState(false);
  /** @type {[boolean, function]} State to control difficulty modal visibility */
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  /** @type {[string|null, function]} State to control success message */
  const [successMsg, setSuccessMsg] = useState(null);
  /** @type {[string, function]} State to control success message color */
  const [successColor, setSuccessColor] = useState("#2ecc40");

  // Show a temporary message
  const handleStartGame = (key, label, color) => {
    setShowDifficultyModal(false);
    setSuccessMsg(`New ${label} Game Started!`);
    setSuccessColor(color);
    setTimeout(() => setSuccessMsg(null), 2500);
    // Here you would also trigger game generation logic
  };

  return (
    <div className="App">
      <div className="game-container">
        {/* Board section with side panel and board */}
        <div className="board-section">
          <div className="side-panel">
            <div className="hearts-container" role="status" aria-label="Remaining lives">
              <div className="heart"></div>
              <div className="heart"></div>
              <div className="heart"></div>
            </div>
            <button
              className="new-game-btn"
              onClick={() => setShowDifficultyModal(true)}
            >
              New Game
            </button>
            <div className="toggle-container" role="toolbar" aria-label="Game tools">
              <div className="toggle-slider">
                <div
                  className={`toggle-highlight ${isEraserMode ? 'left' : 'right'}`}
                  aria-hidden="true"
                ></div>
                <div
                  className={`toggle-option eraser${isEraserMode ? ' active' : ''}`}
                  onClick={() => setIsEraserMode(true)}
                  role="button"
                  aria-pressed={isEraserMode}
                  aria-label="Eraser tool"
                >
                  <div className="trash-icon"></div>
                </div>
                <div
                  className={`toggle-option pen${!isEraserMode ? ' active' : ''}`}
                  onClick={() => setIsEraserMode(false)}
                  role="button"
                  aria-pressed={!isEraserMode}
                  aria-label="Pen tool"
                >
                  <div className="pencil-icon"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="game-board-placeholder">
            <div className="board-placeholder-content">
              Game Board Coming Soon
            </div>
          </div>
        </div>
      </div>
      {showDifficultyModal && (
        <DifficultyModal
          onClose={() => setShowDifficultyModal(false)}
          onSelect={handleStartGame}
        />
      )}
      {successMsg && (
        <div
          style={{
            position: "fixed",
            top: "90px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            color: successColor,
            fontFamily: "'Bebas Neue', Arial, sans-serif",
            fontSize: "1.4rem",
            padding: "1rem 2.5rem",
            borderRadius: "14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            letterSpacing: "1.5px",
            zIndex: 3000,
            border: `2.5px solid ${successColor}`,
            animation: "fadeIn 0.2s, fadeOut 0.4s 2.1s"
          }}
        >
          {successMsg}
        </div>
      )}
    </div>
  );
}

/**
 * Main application component that handles routing and theme management
 * 
 * @component
 * @returns {JSX.Element} Rendered application with routing and theme support
 * 
 * @example
 * <App />
 */
function App() {
  /**
   * Effect to apply user's saved theme on application load
   * @function
   */
  useEffect(() => {
    const applyUserTheme = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await fetch('http://127.0.0.1:8000/settings', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.color_scheme) {
              const root = document.documentElement;
              root.style.setProperty('--bg', data.color_scheme.background);
              root.style.setProperty('--box', data.color_scheme.box);
              root.style.setProperty('--text', data.color_scheme.text);
              document.body.style.background = data.color_scheme.background;
            }
          }
        } catch (err) {
          console.log('Could not load theme');
        }
      }
    };
    applyUserTheme();
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/scores" element={<Scores />} />
        <Route
          path="/game"
          element={
            <PrivateRoute>
              <Game />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
