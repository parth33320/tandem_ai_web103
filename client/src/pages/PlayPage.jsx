// client/src/pages/PlayPage.jsx - Play Page with Item Box & AI Opponent integration
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRandomWord } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import RevealCard from '../components/RevealCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ItemBox from '../components/ItemBox';
import AIOpponentCard from '../components/AIOpponentCard';
import useAI from '../hooks/useAI';
import { useTimer } from '../hooks/useTimer';

const TOTAL_QUESTIONS = 10;

const PlayPage = ({ user, roomId: propRoomId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = propRoomId || location.state?.roomId || queryParams.get('roomId') || null;

  const [direction, setDirection] = useState('cn_to_jp');
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [roundWords, setRoundWords] = useState([]);
  const [score, setScore] = useState(0);
  const [showRevealModal, setShowRevealModal] = useState(false);

  // Active weapon effects state
  const [activeEffects, setActiveEffects] = useState([]);
  const [shuffleOrders, setShuffleOrders] = useState([0, 1, 2, 3]);

  // AI opponent hook
  const currentQuestionIndex = roundWords.length;
  const { aiScore, aiStatus } = useAI(roomId, currentQuestionIndex);

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

  const { timeLeft, setTimeLeft, startTimer, stopTimer } = useTimer(10, handleTimeout);

  const loadRandomWord = async () => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    setShowRevealModal(false);
    try {
      if (roomId) {
        // Trigger question-start for item drops
        fetch(`/api/rooms/${roomId}/question-start`).catch(() => {});
      }

      const data = await getRandomWord(direction);
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

    // If Timer_Freeze active, prevent click
    if (activeEffects.includes('Timer_Freeze')) {
      return;
    }

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
      navigate('/results', { state: { roundWords, score, direction } });
    } else {
      loadRandomWord();
    }
  };

  const handleEffectChange = (effects) => {
    setActiveEffects(effects);
    if (effects.includes('Button_Shuffle')) {
      // Randomize orders [0, 1, 2, 3]
      setShuffleOrders([0, 1, 2, 3].sort(() => Math.random() - 0.5));
    } else {
      setShuffleOrders([0, 1, 2, 3]);
    }
  };

  const handleLightningStrike = (reduction) => {
    setTimeLeft(prev => Math.max(0, prev - reduction));
  };

  const isWrong = showRevealModal && wordData && (selectedOption === null || selectedOption !== wordData.correct_answer);

  // Construct class names for effects
  const containerClasses = [
    'play-page',
    activeEffects.includes('Ink_Splat') ? 'ink-splat' : '',
    activeEffects.includes('Smoke_Screen') ? 'smoke-screen' : '',
    activeEffects.includes('Timer_Freeze') ? 'timer-freeze' : '',
    activeEffects.includes('Button_Shuffle') ? 'button-shuffle' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto 1rem auto' }}>
        <h2 style={{ margin: 0 }}>Tandem Play Page</h2>
        <div className="question-progress" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#555' }}>
          Question {Math.min(roundWords.length + (showRevealModal ? 0 : 1), TOTAL_QUESTIONS)} / {TOTAL_QUESTIONS}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', maxWidth: '800px', margin: '0 auto', flexWrap: 'wrap' }}>
        {/* Main Quiz Area */}
        <div style={{ flex: '1 1 450px' }}>
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
                shuffleOrders={activeEffects.includes('Button_Shuffle') ? shuffleOrders : null}
              />

              <RevealCard
                wordData={wordData}
                isOpen={showRevealModal}
                onNext={handleNextQuestion}
                isWrong={isWrong}
                user={user}
              />
            </>
          )}
        </div>

        {/* Sidebar with ItemBox & Optional AI Card */}
        <div style={{ flex: '0 0 220px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {roomId && (
            <ItemBox
              roomId={roomId}
              user={user}
              onEffectChange={handleEffectChange}
              onLightningStrike={handleLightningStrike}
            />
          )}

          {roomId && (
            <AIOpponentCard
              score={aiScore}
              status={aiStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayPage;
