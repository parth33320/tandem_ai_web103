// Container Component
import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';
import ScoreTable from '../components/ScoreTable';

const LeaderboardPage = () => {
  const [activeDirection, setActiveDirection] = useState('cn_to_jp');
  const [cnToJpScores, setCnToJpScores] = useState([]);
  const [jpToCnScores, setJpToCnScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAllLeaderboards = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cnJpData, jpCnData] = await Promise.all([
          getLeaderboard('cn_to_jp', 10),
          getLeaderboard('jp_to_cn', 10),
        ]);

        if (isMounted) {
          setCnToJpScores(Array.isArray(cnJpData) ? cnJpData : []);
          setJpToCnScores(Array.isArray(jpCnData) ? jpCnData : []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading leaderboards:', err);
          setError(err.message || 'Failed to load leaderboards');
          setLoading(false);
        }
      }
    };

    fetchAllLeaderboards();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggle = () => {
    setActiveDirection(prev => (prev === 'cn_to_jp' ? 'jp_to_cn' : 'cn_to_jp'));
  };

  const currentScores = activeDirection === 'cn_to_jp' ? cnToJpScores : jpToCnScores;
  const directionLabelText = activeDirection === 'cn_to_jp' ? 'Chinese to Japanese' : 'Japanese to Chinese';

  return (
    <div className="leaderboard-page" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <style>{`
        .toggle-switch-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 32px;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #3498db;
          transition: .4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 24px;
          width: 24px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #e67e22;
        }
        input:checked + .slider:before {
          transform: translateX(28px);
        }
        .direction-label {
          font-size: 1.25rem;
          font-weight: bold;
          color: #2c3e50;
        }
      `}</style>

      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '0.5rem' }}>Leaderboard</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
        Top performers ranked by direction track
      </p>

      {/* Pure CSS Toggle Switch & Active Direction Label */}
      <div className="toggle-switch-container">
        <span style={{ fontSize: '0.95rem', color: activeDirection === 'cn_to_jp' ? '#3498db' : '#888', fontWeight: activeDirection === 'cn_to_jp' ? 'bold' : 'normal' }}>
          CN → JP
        </span>

        <label className="toggle-switch" aria-label="Toggle game direction leaderboard">
          <input
            type="checkbox"
            className="leaderboard-toggle-input"
            checked={activeDirection === 'jp_to_cn'}
            onChange={handleToggle}
          />
          <span className="slider"></span>
        </label>

        <span style={{ fontSize: '0.95rem', color: activeDirection === 'jp_to_cn' ? '#e67e22' : '#888', fontWeight: activeDirection === 'jp_to_cn' ? 'bold' : 'normal' }}>
          JP → CN
        </span>
      </div>

      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <h2 className="active-direction-label direction-label">{directionLabelText}</h2>
      </div>

      {error && (
        <div className="leaderboard-error" style={{ color: '#e74c3c', textAlign: 'center', margin: '1rem 0' }}>
          {error}
        </div>
      )}

      <ScoreTable scores={currentScores} loading={loading} />
    </div>
  );
};

export default LeaderboardPage;
