import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomWord } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import RevealCard from '../components/RevealCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTimer } from '../hooks/useTimer';

const TOTAL_QUESTIONS = 10;

const PlayPage = () => {
  const navigate = useNavigate();
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [roundWords, setRoundWords] = useState([]);
  const [score, setScore] = useState(0);
  const [showRevealModal, setShowRevealModal] = useState(false);

  // Keep ref of latest state to avoid stale closure issues in timeout
  const stateRef = useRef({ wordData, roundWords, score, selectedOption, showRevealModal });
  useEffect(() => {
    stateRef.current = { wordData, roundWords, score, selectedOption, showRevealModal };
  });

  const handleTimeout = useCallback(() => {
    const { wordData: currentWord, roundWords: currentRound, showRevealModal: isModalOpen } = stateRef.current;
    if (isModalOpen || !currentWord) return;

    // Treat as wrong answer
    setSelectedOption(null);
    setRoundWords(prev => [...prev, currentWord]);
    setShowRevealModal(true);
  }, []);

  const { timeLeft, startTimer, stopTimer } = useTimer(10, handleTimeout);

  const loadRandomWord = async () => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    setShowRevealModal(false);
    try {
      const data = await getRandomWord('cn_to_jp');
      setWordData(data);
      startTimer(10);
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
    if (selectedOption || showRevealModal) return;

    stopTimer();
    setSelectedOption(option);

    const isCorrect = option === wordData.correct_answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setRoundWords(prev => [...prev, wordData]);
    setShowRevealModal(true);
  };

  const handleNextQuestion = () => {
    setShowRevealModal(false);
    if (roundWords.length >= TOTAL_QUESTIONS) {
      navigate('/results', { state: { roundWords, score } });
    } else {
      loadRandomWord();
    }
  };

  return (
    <div className="play-page" style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ margin: 0 }}>Tandem Play Page</h2>
        <div className="question-progress" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#555' }}>
          Question {Math.min(roundWords.length + (showRevealModal ? 0 : 1), TOTAL_QUESTIONS)} / {TOTAL_QUESTIONS}
        </div>
      </div>

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
            timeLeft={timeLeft}
          />

          <RevealCard
            wordData={wordData}
            isOpen={showRevealModal}
            onNext={handleNextQuestion}
          />
        </>
      )}
    </div>
  );
};

export default PlayPage;
