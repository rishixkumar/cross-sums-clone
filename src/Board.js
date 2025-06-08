/**
 * @fileoverview Board component for the Cross Sums game. Renders the game grid with input cells,
 * row/column labels, and an info widget. Handles user input and calculates sums for validation.
 * 
 * @requires React
 * @requires useState
 */

import React, { useState } from 'react';
import './Board.css';

/**
 * @typedef {Object} BoardProps
 * @property {number} [size=5] - The size of the game grid (e.g., 5 for a 5x5 grid)
 * @property {Array<number>} [rowLabels=[]] - Array of target sums for each row
 * @property {Array<number>} [colLabels=[]] - Array of target sums for each column
 * @property {Array<Array<number>>} [grid=[]] - Initial grid values (2D array)
 */

/**
 * Board component that renders the game grid and handles user interactions
 * 
 * @component
 * @param {BoardProps} props - Component props
 * @returns {JSX.Element} Rendered game board with grid, labels, and info widget
 * 
 * @example
 * <Board 
 *   size={4}
 *   rowLabels={[10, 15, 12, 8]}
 *   colLabels={[9, 14, 11, 11]}
 *   grid={[[1,2,3,4], [5,6,7,8], [9,1,2,3], [4,5,6,7]]}
 * />
 */
const Board = ({ size = 5, rowLabels = [], colLabels = [], grid = [] }) => {
  /** @type {[boolean, function]} State to control info widget expansion */
  const [infoExpanded, setInfoExpanded] = useState(false);

  /**
   * Initialize grid state from props or create empty grid
   * @type {Array<Array<string>>}
   */
  const initialGrid = grid.length > 0
    ? grid.map(row => row.map(cell => cell.toString()))
    : Array.from({ length: size }, () => Array(size).fill(''));

  /** @type {[Array<Array<string>>, function]} State for grid cell values */
  const [cells, setCells] = useState(initialGrid);

  /**
   * Toggles the visibility of the info widget
   * @function
   */
  const toggleInfo = () => {
    setInfoExpanded(prev => !prev);
  };

  /**
   * Use provided labels or create empty arrays of specified size
   * @type {Array<string>}
   */
  const displayRowLabels = rowLabels.length > 0 ? rowLabels : Array(size).fill('');
  const displayColLabels = colLabels.length > 0 ? colLabels : Array(size).fill('');

  /**
   * Handles cell value changes with validation
   * @function
   * @param {number} rowIdx - Row index of the cell
   * @param {number} colIdx - Column index of the cell
   * @param {string} value - New value to set
   */
  const handleChange = (rowIdx, colIdx, value) => {
    if (/^[1-9]?$/.test(value)) {
      const updated = cells.map(r => [...r]);
      updated[rowIdx][colIdx] = value;
      setCells(updated);
    }
  };

  /**
   * Calculate sum for each row
   * @type {Array<number>}
   */
  const rowSums = cells.map(row =>
    row.reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0)
  );

  /**
   * Calculate sum for each column
   * @type {Array<number>}
   */
  const colSums = Array(size).fill(0).map((_, colIdx) =>
    cells.reduce((sum, row) => sum + (parseInt(row[colIdx], 10) || 0), 0)
  );

  return (
    <div className="board-container">
      {/* Info Widget */}
      <div className="info-widget">
        <div
          className={`exclamation-mark ${infoExpanded ? 'rotated' : ''}`}
          onClick={toggleInfo}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleInfo(); }}
          aria-label="Toggle game information"
        >
          !
        </div>
        <div 
          className={`info-message ${infoExpanded ? 'show' : 'hide'}`}
          role="tooltip"
          aria-hidden={!infoExpanded}
        >
          Go to the profile page to see your stats and how to play
        </div>
      </div>

      {/* Column Labels */}
      <div className="board-labels board-labels-top">
        <div className="board-label-empty"></div>
        {displayColLabels.map((label, idx) => (
          <div
            className="board-label"
            key={`col-${idx}`}
            style={{
              color:
                label !== '' && colSums[idx] === Number(label)
                  ? '#2ecc40' // green if correct
                  : label !== ''
                  ? '#ff4136' // red if incorrect
                  : '#3f3d56', // default
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Game Grid */}
      {cells.map((row, rowIdx) => (
        <div className="board-row" key={`row-${rowIdx}`}>
          <div
            className="board-label board-label-side"
            style={{
              color:
                displayRowLabels[rowIdx] !== '' && rowSums[rowIdx] === Number(displayRowLabels[rowIdx])
                  ? '#2ecc40'
                  : displayRowLabels[rowIdx] !== ''
                  ? '#ff4136'
                  : '#3f3d56',
            }}
          >
            {displayRowLabels[rowIdx]}
          </div>
          {row.map((cell, colIdx) => (
            <input
              className="board-cell"
              key={`cell-${rowIdx}-${colIdx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={cell}
              onChange={e => handleChange(rowIdx, colIdx, e.target.value)}
              autoComplete="off"
              aria-label={`Cell at row ${rowIdx + 1}, column ${colIdx + 1}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
