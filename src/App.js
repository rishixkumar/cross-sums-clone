import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Board from './Board';
import Header from './components/Header';
import Profile from './pages/Profile';
import Scores from './pages/Scores';
import Login from './pages/Login';
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
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
