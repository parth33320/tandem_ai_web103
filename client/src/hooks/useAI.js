// client/src/hooks/useAI.js - Hook for AI Opponent in Single-Player Multiplayer Mode
import { useState, useEffect } from 'react';

export const useAI = (roomId, currentQuestionIndex) => {
  const [aiScore, setAiScore] = useState(0);
  const [aiStatus, setAiStatus] = useState('Thinking...');
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    let timer;
    const fetchAIAction = async () => {
      try {
        setAiStatus('Thinking...');
        const res = await fetch(`/api/rooms/${roomId}/ai-action`);
        if (res.ok) {
          const action = await res.json();
          setLastAction(action);

          // Delay execution based on AI answer time
          timer = setTimeout(() => {
            if (action.correct) {
              setAiScore(prev => prev + 1);
              setAiStatus('Answered Correctly! 🎯');
            } else {
              setAiStatus('Answered Incorrectly ❌');
            }
          }, action.delay * 1000);
        }
      } catch (err) {
        console.error('AI Opponent Error:', err);
      }
    };

    fetchAIAction();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [roomId, currentQuestionIndex]);

  return { aiScore, aiStatus, lastAction };
};

export default useAI;
