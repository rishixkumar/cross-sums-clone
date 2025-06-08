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

// Game component (your current game)
function Game() {
  const [isEraserMode, setIsEraserMode] = useState(false);

  const grid = [
    [5, 1, 6, 2],
    [8, 2, 4, 2],
    [2, 2, 2, 6],
    [1, 9, 9, 2],
  ];

  const rowLabels = [1, 2, 4, 3];
  const colLabels = [3, 3, 2, 2];

  return (
    <div className="App">
      <div className="game-container">
        <div className="hearts-container">
          <div className="heart"></div>
          <div className="heart"></div>
          <div className="heart"></div>
        </div>
        
        <Board size={4} rowLabels={rowLabels} colLabels={colLabels} grid={grid} />
        
        <div className="toggle-container">
          <div className="toggle-slider">
            <div
              className={`toggle-highlight ${isEraserMode ? 'left' : 'right'}`}
            ></div>
            <div
              className={`toggle-option eraser${isEraserMode ? ' active' : ''}`}
              onClick={() => setIsEraserMode(true)}
            >
              <div className="trash-icon"></div>
            </div>
            <div
              className={`toggle-option pen${!isEraserMode ? ' active' : ''}`}
              onClick={() => setIsEraserMode(false)}
            >
              <div className="pencil-icon"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Apply user's saved theme on app load
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
