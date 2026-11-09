import { useEffect, useReducer, useState } from 'react';
import { EmojiSearchStatus } from '../models/Emoji';
import { gameReducer, initialGameState } from './gameReducer';

export function useGameViewModel() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [tensorLoaded, setTensorLoaded] = useState(false);

  // Countdown: only tick while we're actively searching *and* the ML model
  // has finished loading (no fair burning the clock while MobileNet is still
  // spinning up).
  useEffect(() => {
    if (!tensorLoaded) return;
    if (state.emojiStatus !== EmojiSearchStatus.Searching) return;
    const id = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(id);
  }, [tensorLoaded, state.emojiStatus]);

  return {
    ...state,
    tensorLoaded,
    setTensorLoaded,
    foundEmoji: () => dispatch({ type: 'foundEmoji' }),
    startNext: () => dispatch({ type: 'nextEmoji' }),
    restart: () => dispatch({ type: 'restart' }),
  };
}
