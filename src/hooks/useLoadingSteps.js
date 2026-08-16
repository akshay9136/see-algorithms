import { useEffect, useRef, useState } from 'react';

const DEFAULT_MESSAGES = [
  'Reading data...',
  'Analyzing steps...',
  'Writing summary...',
];

export default function useLoadingSteps(
  messages = DEFAULT_MESSAGES,
  interval = 3000,
) {
  const [index, setIndex] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const timer = useRef(null);

  const start = () => {
    setLoading(true);
    setIndex(0);
    timer.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, interval);
  };

  const stop = () => {
    setLoading(false);
    clearInterval(timer.current);
  };

  useEffect(() => {
    return () => clearInterval(timer.current);
  }, []);

  return { message: messages[index], isLoading, start, stop };
}
