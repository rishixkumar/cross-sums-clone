import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rulesExpanded, setRulesExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleRules = () => {
    setRulesExpanded(prev => !prev);
  };

  const rules = [
    'Mark the numbers in the grid so that the sum of each row and each column matches the numbers shown at the ends of the rows and columns.',
    'Remove (erase) any numbers that would cause a row or column to exceed its target sum.', 
    'Use the pen tool to mark numbers you are sure about, and the eraser to remove numbers you think don\'t belong.',
    'Each puzzle has only one unique solution—think carefully and use logic to deduce which numbers to keep.',
    'Adjust the difficulty and level as you improve, and try to solve with as few mistakes as possible!'
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await fetch('http://127.0.0.1:8000/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else if (response.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        } else {
          setError('Failed to load profile data');
        }
      } catch (error) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading">Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error">{error}</div>
          <button onClick={() => navigate('/login')} className="retry-button">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Player Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-info">
              <h2>Account Information</h2>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{userData?.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Player ID:</span>
                <span className="value">#{userData?.id}</span>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Games Played</h3>
              <div className="stat-number">{userData?.games_played || 0}</div>
            </div>
            
            <div className="stat-card">
              <h3>Games Won</h3>
              <div className="stat-number">{userData?.games_won || 0}</div>
            </div>
            
            <div className="stat-card">
              <h3>Games Lost</h3>
              <div className="stat-number">{userData?.games_lost || 0}</div>
            </div>
            
            <div className="stat-card">
              <h3>Total Score</h3>
              <div className="stat-number">{userData?.games_score || 0}</div>
            </div>
          </div>

          <div className="how-to-play-container">
            <h2
              className={`how-to-play-title ${rulesExpanded ? 'expanded' : ''}`}
              onClick={toggleRules}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleRules(); }}
              role="button"
              aria-expanded={rulesExpanded}
              tabIndex={0}
            >
              H o w &nbsp; T o &nbsp; P l a y
            </h2>
            <div className={`rules-container ${rulesExpanded ? 'show' : 'hide'}`}>
              {rules.map((rule, index) => (
                <p
                  key={index}
                  className="rule-line"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {rule}
                </p>
              ))}
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={() => navigate('/game')} className="play-button">
              Play Cross Sums
            </button>
            <button onClick={() => navigate('/scores')} className="scores-button">
              View All-Time Scores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
