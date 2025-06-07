import React from 'react';
import './Scores.css';

export default function Scores() {
  // Placeholder stats; replace with real API data in the future
  const stats = [
    { label: 'Easy Games Played', value: 12 },
    { label: 'Medium Games Played', value: 7 },
    { label: 'Hard Games Played', value: 3 },
    { label: 'Impossible Games Played', value: 0 },
  ];

  return (
    <div className="scores-page">
      <div className="scores-container">
        <h1>All-Time Scores</h1>
        <div className="scores-grid">
          {stats.map((stat, idx) => (
            <div className="score-card" key={idx}>
              <div className="score-label">{stat.label}</div>
              <div className="score-value">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
