// client/src/pages/PlayPage.jsx - Play Page with Item Box, Lifelines & AI Opponent integration
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRandomWord, addMissedWord } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import RevealCard from '../components/RevealCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ItemBox from '../components/ItemBox';
import LifelinePanel from '../components/LifelinePanel';
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

  // Passive Lifelines state
  const [hiddenChoiceIndexes, setHiddenChoiceIndexes] = useState([]);
  const [hintText, setHintText] = useState(null);
  const [expertWeights, setExpertWeights] = useState(null);
  const [usedLifelines, setUsedLifelines] = useState({ Fifty_Fifty: false, Hint_Provider: false, Expert_Advice: false });
  const [singlePlayerLifelines, setSinglePlayerLifelines] = useState({ Fifty_Fifty: true, Hint_Provider: true, Expert_Advice: true });

  // AI opponent hook
  const currentQuestionIndex = roundWords.length;
  const { aiScore, aiStatus } = useAI(roomId, currentQuestionIndex);

  // Keep ref of latest state to avoid stale closure issues in timeout
  const stateRef = useRef({ wordData, roundWords, score, selectedOption, showRevealModal });
  useEffect(() => {
    stateRef.current = { wordData, roundWords, score, selectedOption, showRevealModal };
  });

  const recordMissedWordIfWrong = useCallback(async (word) => {
    if (user && word && word.id) {
      try {
        await addMissedWord(word.id);
      } catch (err) {
        console.error('Failed to post missed word:', err);
      }
    }
  }, [user]);

  const handleTimeout = useCallback(() => {
    const { wordData: currentWord, roundWords: currentRound, showRevealModal: isModalOpen } = stateRef.current;
    if (isModalOpen || !currentWord) return;

    // Treat as wrong answer
    setSelectedOption(null);
    setRoundWords(prev => [...prev, currentWord]);
    setShowRevealModal(true);
    recordMissedWordIfWrong(currentWord);
  }, [recordMissedWordIfWrong]);

  const { timeLeft, setTimeLeft, startTimer, stopTimer } = useTimer(10, handleTimeout);

  const loadRandomWord = async () => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    setShowRevealModal(false);

    // Reset lifeline visual states on each question
    setHiddenChoiceIndexes([]);
    setHintText(null);
    setExpertWeights(null);
    setUsedLifelines({ Fifty_Fifty: false, Hint_Provider: false, Expert_Advice: false });

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
    } else {
      recordMissedWordIfWrong(wordData);
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

  // Lifeline handlers
  const handleFiftyFifty = (hiddenIndexes) => {
    setHiddenChoiceIndexes(hiddenIndexes);
    setUsedLifelines(prev => ({ ...prev, Fifty_Fifty: true }));
    if (!roomId) {
      setSinglePlayerLifelines(prev => ({ ...prev, Fifty_Fifty: false }));
    }
  };

  const handleHint = (hint) => {
    setHintText(hint);
    setUsedLifelines(prev => ({ ...prev, Hint_Provider: true }));
    if (!roomId) {
      setSinglePlayerLifelines(prev => ({ ...prev, Hint_Provider: false }));
    }
  };

  const handleExpert = (weights) => {
    setExpertWeights(weights);
    setUsedLifelines(prev => ({ ...prev, Expert_Advice: true }));
    if (!roomId) {
      setSinglePlayerLifelines(prev => ({ ...prev, Expert_Advice: false }));
    }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '900px', margin: '0 auto 1rem auto' }}>
        <h2 style={{ margin: 0 }}>Tandem Play Page</h2>
        <div className="question-progress" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#555' }}>
          Question {Math.min(roundWords.length + (showRevealModal ? 0 : 1), TOTAL_QUESTIONS)} / {TOTAL_QUESTIONS}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '1.5rem', maxWidth: '900px', margin: '0 auto', flexWrap: 'wrap' }}>
        {/* Main Quiz Area */}
        <div style={{ flex: '1 1 400px' }}>
          {loading && <LoadingSpinner />}

          {error && (
            <div style={{ color: '#dc3545', margin: '1rem 0' }}>
              <p>Error: {error}</p>
              <button
                type="button"
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
                direction={direction}
                onOptionSelect={handleOptionSelect}
                selectedOption={selectedOption}
                timeLeft={timeLeft}
                shuffleOrders={activeEffects.includes('Button_Shuffle') ? shuffleOrders : null}
                hiddenChoiceIndexes={hiddenChoiceIndexes}
                hintText={hintText}
                expertWeights={expertWeights}
              />

              <RevealCard
                wordData={wordData}
                isOpen={showRevealModal}
                onNext={handleNextQuestion}
                isWrong={isWrong}
              />
            </>
          )}
        </div>

        {/* Sidebar with ItemBox, LifelinePanel & Optional AI Card */}
        <div style={{ flex: '0 0 240px', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <LifelinePanel
            roomId={roomId}
            user={user}
            wordData={wordData}
            direction={direction}
            onFiftyFifty={handleFiftyFifty}
            onHint={handleHint}
            onExpert={handleExpert}
            usedLifelines={usedLifelines}
            singlePlayerLifelines={singlePlayerLifelines}
          />

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
