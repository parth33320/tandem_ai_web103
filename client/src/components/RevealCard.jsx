// Presenter Component - RevealCard with 3D Card Flip
import React, { useState, useEffect } from 'react';
import { play as playSound } from '../utils/sounds';
import { speak } from '../utils/voiceHost';

const RelationshipBadge = ({ tag }) => {
  let label = '';
  let bgColor = '#6c757d';
  let textColor = '#fff';

  if (tag === 'true_friend') {
    label = '🟢 True Friend';
    bgColor = '#28a745';
  } else if (tag === 'false_friend') {
    label = '🔴 False Friend';
    bgColor = '#dc3545';
  } else if (tag === 'half_friend') {
    label = '🟡 Half Friend';
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
  const [clicked, setClicked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setClicked(false);
      const timer = setTimeout(() => {
        setIsFlipped(true);
        playSound('flip');
        if (wordData && wordData.relationship_tag) {
          const tag = wordData.relationship_tag;
          const speakText =
            tag === 'true_friend'
              ? 'True Friend'
              : tag === 'false_friend'
              ? 'False Friend'
              : 'Half Friend';
          speak(speakText, 'en-US');
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsFlipped(false);
    }
  }, [isOpen, wordData]);

  if (!isOpen || !wordData) return null;

  const { characters, chinese_reading, japanese_reading, chinese_meaning, japanese_meaning, relationship_tag } = wordData;

  const handleNextClick = () => {
    setClicked(true);
    onNext();
  };

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
        className="card-scene"
        style={{
          perspective: '600px',
          maxWidth: '600px',
          width: '90%',
          minHeight: '380px'
        }}
      >
        <div
          className={`card-inner reveal-card-modal ${isFlipped ? 'is-flipped' : ''}`}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Question Side (Front) */}
          <div
            className="card-front"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              backgroundColor: '#2c3e50',
              color: '#fff',
              borderRadius: '12px',
              padding: '2rem',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
            }}
          >
            <h2 style={{ margin: 0, fontSize: '2rem' }}>Revealing Word Details...</h2>
            <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#ecf0f1' }}>{characters}</p>
          </div>

          {/* Reveal Side (Back) */}
          <div
            className="card-back"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              backgroundColor: '#fff',
              color: '#2c3e50',
              borderRadius: '12px',
              padding: '2rem',
              boxSizing: 'border-box',
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
              type="button"
              className="next-button"
              onClick={handleNextClick}
              disabled={clicked}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: clicked ? '#6c757d' : '#0d6efd',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: clicked ? 'not-allowed' : 'pointer'
              }}
            >
              {clicked ? 'Loading...' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevealCard;
