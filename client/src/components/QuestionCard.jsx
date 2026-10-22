// Presenter Component - QuestionCard
import React, { useEffect, useRef } from 'react';
import { play as playSound } from '../utils/sounds';
import { speak } from '../utils/voiceHost';

const QuestionCard = ({
  wordData,
  direction = 'cn_to_jp',
  onOptionSelect,
  selectedOption,
  timeLeft,
  shuffleOrders,
  hiddenChoiceIndexes = [],
  hintText = null,
  expertWeights = null
}) => {
  const spokenWordRef = useRef(null);
  const prevTimeLeftRef = useRef(timeLeft);

  useEffect(() => {
    if (wordData && wordData.characters && spokenWordRef.current !== wordData.characters) {
      spokenWordRef.current = wordData.characters;
      const voiceLang = direction === 'cn_jp' || direction === 'cn_to_jp' ? 'zh-CN' : 'ja-JP';
      speak(wordData.characters, voiceLang);
    }
  }, [wordData, direction]);

  useEffect(() => {
    if (timeLeft === 3 && prevTimeLeftRef.current !== 3) {
      playSound('timer');
    }
    prevTimeLeftRef.current = timeLeft;
  }, [timeLeft]);

  if (!wordData) return null;

  const { characters, options, correct_answer, chinese_reading, japanese_reading } = wordData;

  const handleOptionClick = (option) => {
    if (selectedOption) return;
    const isCorrect = option === correct_answer;
    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
    onOptionSelect(option);
  };

  return (
    <div className="question-card" style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      textAlign: 'center',
      backgroundColor: '#fff'
    }}>
      {timeLeft !== undefined && (
        <div
          className="timer timer-bar"
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: timeLeft <= 3 ? '#e74c3c' : '#2c3e50',
            marginBottom: '1rem'
          }}
        >
          Time Left: {timeLeft}s
        </div>
      )}

      <h1 className="word-characters" style={{ fontSize: '3rem', margin: '0.5rem 0' }}>
        {characters}
      </h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Readings: CN ({chinese_reading}) | JP ({japanese_reading})
      </p>
      <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
        Choose the correct meaning:
      </p>

      <div className="options-grid choice-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {options.map((option, idx) => {
          const isCorrectOption = option === correct_answer;
          const isHidden = hiddenChoiceIndexes && hiddenChoiceIndexes.includes(idx);

          let btnClass = 'option-button choice-btn' + (isHidden ? ' hidden' : '');
          let style = {
            padding: '1rem',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '2px solid #3498db',
            cursor: 'pointer',
            backgroundColor: '#f8f9fa',
            transition: 'all 0.2s',
            order: shuffleOrders && shuffleOrders[idx] !== undefined ? shuffleOrders[idx] : idx,
            ...(isHidden ? { display: 'none' } : {})
          };

          if (selectedOption) {
            if (option === selectedOption) {
              if (isCorrectOption) {
                btnClass += ' correct';
                style.backgroundColor = '#d4edda';
                style.borderColor = '#28a745';
                style.color = '#155724';
              } else {
                btnClass += ' wrong';
                style.backgroundColor = '#f8d7da';
                style.borderColor = '#dc3545';
                style.color = '#721c24';
              }
            } else if (isCorrectOption) {
              btnClass += ' correct';
              style.backgroundColor = '#d4edda';
              style.borderColor = '#28a745';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              className={btnClass}
              data-correct={isCorrectOption ? "true" : "false"}
              style={style}
              onClick={() => handleOptionClick(option)}
              disabled={!!selectedOption || isHidden}
            >
              <span className="choice-text">{option}</span>
            </button>
          );
        })}
      </div>

      {hintText && (
        <div className="hint-bubble-overlay hint-bubble" style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#e8f4f8',
          border: '1px solid #3498db',
          borderRadius: '8px',
          color: '#2c3e50',
          fontSize: '0.95rem',
          lineHeight: '1.4',
          textAlign: 'center'
        }}>
          💡 <strong>Hint Note:</strong> {hintText}
        </div>
      )}

      {expertWeights && (
        <div className="expert-chart-overlay" style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f9fbf9',
          border: '1px solid #2ecc71',
          borderRadius: '8px',
          textAlign: 'left'
        }}>
          <h4 style={{ margin: '0 0 0.75rem 0', textAlign: 'center', color: '#27ae60', fontSize: '1rem' }}>
            📊 Expert Advice Predictions
          </h4>
          {expertWeights.map((exp, i) => (
            <div key={i} className="expert-row" style={{ marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 'bold' }}>
                <span>Expert {exp.label}: {exp.answer}</span>
                <span>({exp.percentage}%)</span>
              </div>
              <div className="expert-bar-bg" style={{ backgroundColor: '#e0e0e0', borderRadius: '4px', height: '10px', overflow: 'hidden', marginTop: '2px' }}>
                <div
                  className="expert-bar"
                  style={{
                    width: `${exp.percentage}%`,
                    backgroundColor: i === 0 ? '#2ecc71' : '#f39c12',
                    height: '100%',
                    transition: 'width 0.3s ease-in-out'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOption && (
        <div className="answer-feedback" style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>
          {selectedOption === correct_answer ? (
            <span style={{ color: '#28a745' }}>Correct!</span>
          ) : (
            <span style={{ color: '#dc3545' }}>Wrong! Correct answer was "{correct_answer}".</span>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
