import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initialSeconds = 10, onTimeout) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const startTimer = useCallback((secs = initialSeconds) => {
    stopTimer();
    setTimeLeft(secs);
    setIsRunning(true);
  }, [initialSeconds, stopTimer]);

  const resetTimer = useCallback((secs = initialSeconds) => {
    stopTimer();
    setTimeLeft(secs);
  }, [initialSeconds, stopTimer]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setIsRunning(false);
            if (onTimeoutRef.current) {
              onTimeoutRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  return {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  };
}

export default useTimer;
