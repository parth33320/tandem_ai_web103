import React from 'react';

const QuestionCard = ({ wordData, onOptionSelect, selectedOption }) => {
  if (!wordData) return null;

  const { characters, options, correct_answer, chinese_reading, japanese_reading } = wordData;

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
      <h1 className="word-characters" style={{ fontSize: '3rem', margin: '0.5rem 0' }}>
        {characters}
      </h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Readings: CN ({chinese_reading}) | JP ({japanese_reading})
      </p>
      <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
        Choose the correct meaning:
      </p>

      <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {options.map((option, idx) => {
          const isCorrectOption = option === correct_answer;
          let btnClass = 'option-button';
          let style = {
            padding: '1rem',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '2px solid #3498db',
            cursor: 'pointer',
            backgroundColor: '#f8f9fa',
            transition: 'all 0.2s'
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
              className={btnClass}
              data-correct={isCorrectOption ? "true" : "false"}
              style={style}
              onClick={() => !selectedOption && onOptionSelect(option)}
              disabled={!!selectedOption}
            >
              {option}
            </button>
          );
        })}
      </div>

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
