import React, { useState } from 'react';
import Board from './Board';
import './App.css';

const grid = [
  [5, 1, 6, 2],
  [8, 2, 4, 2],
  [2, 2, 2, 6],
  [1, 9, 9, 2],
];

const rowLabels = [1, 2, 4, 3];
const colLabels = [3, 3, 2, 2];

function App() {
  const [isEraserMode, setIsEraserMode] = useState(false);


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

export default App;
