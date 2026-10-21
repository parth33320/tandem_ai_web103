// Presenter Component
import React from 'react';

const ScoreTable = ({ scores = [], loading = false }) => {
  if (loading) {
    return <div className="loading-scores" style={{ padding: '2rem', color: '#666' }}>Loading leaderboard...</div>;
  }

  if (!scores || scores.length === 0) {
    return (
      <div className="empty-leaderboard" style={{ padding: '2rem', color: '#666', fontStyle: 'italic' }}>
        No scores recorded yet for this direction.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        className="score-table"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1rem',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '12px 16px' }}>Rank</th>
            <th style={{ padding: '12px 16px' }}>Avatar</th>
            <th style={{ padding: '12px 16px' }}>Username</th>
            <th style={{ padding: '12px 16px' }}>Score</th>
            <th style={{ padding: '12px 16px' }}>Similarity%</th>
            <th style={{ padding: '12px 16px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, index) => (
            <tr
              key={entry.id || index}
              style={{
                borderBottom: '1px solid #eee',
                backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff'
              }}
            >
              <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>#{index + 1}</td>
              <td style={{ padding: '12px 16px' }}>
                <img
                  src={entry.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}
                  alt={entry.username || 'User avatar'}
                  className="user-avatar"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                />
              </td>
              <td style={{ padding: '12px 16px', fontWeight: '600' }}>{entry.username || 'Anonymous'}</td>
              <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#28a745' }}>{entry.score}</td>
              <td style={{ padding: '12px 16px', color: '#3498db' }}>{entry.similarity_pct}%</td>
              <td style={{ padding: '12px 16px', color: '#777', fontSize: '0.9rem' }}>
                {entry.played_at ? new Date(entry.played_at).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
