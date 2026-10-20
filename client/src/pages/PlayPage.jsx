import React, { useState, useEffect } from 'react';
import { getRandomWord } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import LoadingSpinner from '../components/LoadingSpinner';

const PlayPage = () => {
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const loadRandomWord = async () => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    try {
      const data = await getRandomWord('cn_to_jp');
      setWordData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomWord();
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="play-page" style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1rem' }}>Tandem Play Page</h2>

      {loading && <LoadingSpinner />}

      {error && (
        <div style={{ color: '#dc3545', margin: '1rem 0' }}>
          <p>Error: {error}</p>
          <button
            onClick={loadRandomWord}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && wordData && (
        <>
          <QuestionCard
            wordData={wordData}
            onOptionSelect={handleOptionSelect}
            selectedOption={selectedOption}
          />

          {selectedOption && (
            <button
              onClick={loadRandomWord}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Next Question
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PlayPage;
