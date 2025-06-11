import React, { useState } from "react";
import "./DifficultyModal.css";

const DIFFICULTIES = [
  {
    key: "easy",
    label: "Easy",
    color: "#2ecc40",
    info: [
      "Board: 5x5",
      "Points: 100",
      "Time: 5:00"
    ]
  },
  {
    key: "medium",
    label: "Medium",
    color: "#f1c40f",
    info: [
      "Board: 7x7",
      "Points: 250",
      "Time: 3:30"
    ]
  },
  {
    key: "hard",
    label: "Hard",
    color: "#e67e22",
    info: [
      "Board: 9x9",
      "Points: 500",
      "Time: 2:00"
    ]
  },
  {
    key: "impossible",
    label: "Impossible",
    color: "#e74c3c",
    info: [
      "Board: 11x11",
      "Points: 1000",
      "Time: 1:00"
    ]
  }
];

export default function DifficultyModal({ onClose, onSelect }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="modal-backdrop" tabIndex={-1} aria-modal="true" role="dialog">
      <div className="difficulty-modal">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="modal-header">
          <h2>Select Difficulty</h2>
        </div>
        <div className="difficulty-columns">
          {DIFFICULTIES.map((diff) => (
            <div
              key={diff.key}
              className={`difficulty-column ${expanded === diff.key ? "expanded" : ""}`}
              style={{
                borderLeft: `8px solid ${diff.color}`,
                background: expanded === diff.key ? diff.color + "22" : "var(--box)",
                color: expanded === diff.key ? "#222" : "var(--text)"
              }}
              onClick={() => setExpanded(expanded === diff.key ? null : diff.key)}
              tabIndex={0}
              role="button"
              aria-pressed={expanded === diff.key}
            >
              <div className="difficulty-header" style={{ color: diff.color }}>
                {diff.label}
              </div>
              {expanded === diff.key && (
                <div className="difficulty-info">
                  <ul>
                    {diff.info.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <button
                    className="start-game-btn"
                    style={{ background: diff.color, color: "#fff" }}
                    onClick={e => {
                      e.stopPropagation(); // prevent collapse
                      onSelect(diff.key, diff.label, diff.color);
                    }}
                  >
                    Start New Game
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
