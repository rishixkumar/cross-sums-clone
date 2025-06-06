import React, { useState } from 'react';
import './Board.css';

const Board = ({ size = 5, rowLabels = [], colLabels = [], grid = [] }) => {
  const initialGrid = grid.length > 0
    ? grid.map(row => row.map(cell => cell.toString()))
    : Array.from({ length: size }, () => Array(size).fill(''));

  const [cells, setCells] = useState(initialGrid);

  const displayRowLabels = rowLabels.length > 0 ? rowLabels : Array(size).fill('');
  const displayColLabels = colLabels.length > 0 ? colLabels : Array(size).fill('');

  const handleChange = (rowIdx, colIdx, value) => {
    if (/^[1-9]?$/.test(value)) {
      const updated = cells.map(r => [...r]);
      updated[rowIdx][colIdx] = value;
      setCells(updated);
    }
  };

  // Compute row sums
  const rowSums = cells.map(row =>
    row.reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0)
  );

  // Compute column sums
  const colSums = Array(size).fill(0).map((_, colIdx) =>
    cells.reduce((sum, row) => sum + (parseInt(row[colIdx], 10) || 0), 0)
  );

  return (
    <div className="board-container">
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
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
