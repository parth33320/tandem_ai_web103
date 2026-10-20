import React from 'react';

const RelationshipBadge = ({ tag }) => {
  let label = '';
  let bgColor = '#6c757d';
  let textColor = '#fff';

  if (tag === 'true_friend') {
    label = '✓ True Friend';
    bgColor = '#28a745';
  } else if (tag === 'false_friend') {
    label = '✗ False Friend';
    bgColor = '#dc3545';
  } else if (tag === 'half_friend') {
    label = '~ Half Friend';
    bgColor = '#ffc107';
    textColor = '#212529';
  }

  return (
    <div
      className={`relationship-tag ${tag}`}
      style={{
        display: 'inline-block',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        backgroundColor: bgColor,
        color: textColor,
        fontWeight: 'bold',
        fontSize: '0.95rem',
        margin: '1rem 0'
      }}
    >
      {label}
    </div>
  );
};

const RevealCard = ({ wordData, isOpen, onNext }) => {
  if (!isOpen || !wordData) return null;

  const { characters, chinese_reading, japanese_reading, chinese_meaning, japanese_meaning, relationship_tag } = wordData;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        pointerEvents: 'auto'
      }}
    >
      <div
        className="reveal-card-modal"
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '600px',
          width: '90%',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}
      >
        <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Word Details: {characters}</h2>

        <RelationshipBadge tag={relationship_tag} />

        <table
          className="reveal-table"
          style={{
            width: '100%',
            marginTop: '1rem',
            borderCollapse: 'collapse',
            textAlign: 'left'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f1f3f5', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '0.75rem', width: '50%' }}>Chinese</th>
              <th style={{ padding: '0.75rem', width: '50%' }}>Japanese</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6', verticalAlign: 'top' }}>
                <p style={{ margin: '0.25rem 0' }}><strong>Characters:</strong> {characters}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Reading:</strong> {chinese_reading}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Meaning:</strong> {chinese_meaning}</p>
              </td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6', verticalAlign: 'top' }}>
                <p style={{ margin: '0.25rem 0' }}><strong>Characters:</strong> {characters}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Reading:</strong> {japanese_reading}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Meaning:</strong> {japanese_meaning}</p>
              </td>
            </tr>
          </tbody>
        </table>

        <button
          className="next-button"
          onClick={onNext}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: '#0d6efd',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RevealCard;
