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
import Board from './Board';
import Header from './components/Header';
import Profile from './pages/Profile';
import Scores from './pages/Scores';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Settings from './pages/Settings';
import './App.css';

/**
 * Game component that renders the main game interface
 * 
 * @component
 * @returns {JSX.Element} Rendered game interface with board and controls
 * 
 * @example
 * <Game />
 */
function Game() {
  /** @type {[boolean, function]} State to control eraser mode */
  const [isEraserMode, setIsEraserMode] = useState(false);

  /**
   * Sample game grid data
   * @type {Array<Array<number>>}
   */
  const grid = [
    [5, 1, 6, 2],
    [8, 2, 4, 2],
    [2, 2, 2, 6],
    [1, 9, 9, 2],
  ];

  /** @type {Array<number>} Target sums for each row */
  const rowLabels = [1, 2, 4, 3];
  
  /** @type {Array<number>} Target sums for each column */
  const colLabels = [3, 3, 2, 2];

  return (
    <div className="App">
      <div className="game-container">
        {/* Lives display */}
        <div className="hearts-container" role="status" aria-label="Remaining lives">
          <div className="heart"></div>
          <div className="heart"></div>
          <div className="heart"></div>
        </div>
        
        {/* Game board */}
        <Board size={4} rowLabels={rowLabels} colLabels={colLabels} grid={grid} />
        
        {/* Tool toggle */}
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
