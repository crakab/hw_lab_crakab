import {
  gameReducer,
  initialGameState,
  ROUND_DURATION,
  GameState,
} from '../viewModels/gameReducer';
import { EmojiSearchStatus, emojiObjects } from '../models/Emoji';

describe('gameReducer', () => {
  test('initial state is Searching at level 0 with full time', () => {
    expect(initialGameState.emojiStatus).toBe(EmojiSearchStatus.Searching);
    expect(initialGameState.currentLevel).toBe(0);
    expect(initialGameState.timeRemaining).toBe(ROUND_DURATION);
    expect(initialGameState.showNext).toBe(false);
  });

  test('tick decrements time while Searching', () => {
    const next = gameReducer(initialGameState, { type: 'tick' });
    expect(next.timeRemaining).toBe(ROUND_DURATION - 1);
    expect(next.emojiStatus).toBe(EmojiSearchStatus.Searching);
  });

  test('tick at 1 second marks NotFound and shows the Next button', () => {
    const state: GameState = { ...initialGameState, timeRemaining: 1 };
    const next = gameReducer(state, { type: 'tick' });
    expect(next.timeRemaining).toBe(0);
    expect(next.emojiStatus).toBe(EmojiSearchStatus.NotFound);
    expect(next.showNext).toBe(true);
  });

  test('tick is a no-op when not Searching', () => {
    const state: GameState = { ...initialGameState, emojiStatus: EmojiSearchStatus.Found };
    const next = gameReducer(state, { type: 'tick' });
    expect(next).toEqual(state);
  });

  test('foundEmoji flips to Found and shows the Next button', () => {
    const next = gameReducer(initialGameState, { type: 'foundEmoji' });
    expect(next.emojiStatus).toBe(EmojiSearchStatus.Found);
    expect(next.showNext).toBe(true);
  });

  test('foundEmoji is ignored if not Searching', () => {
    // Late classification callbacks shouldn't retrigger the Found state.
    const state: GameState = { ...initialGameState, emojiStatus: EmojiSearchStatus.NotFound };
    const next = gameReducer(state, { type: 'foundEmoji' });
    expect(next).toEqual(state);
  });

  test('nextEmoji advances the level and resets the round', () => {
    const state: GameState = {
      ...initialGameState,
      emojiStatus: EmojiSearchStatus.Found,
      showNext: true,
      timeRemaining: 3,
    };
    const next = gameReducer(state, { type: 'nextEmoji' });
    expect(next.currentLevel).toBe(1);
    expect(next.timeRemaining).toBe(ROUND_DURATION);
    expect(next.emojiStatus).toBe(EmojiSearchStatus.Searching);
    expect(next.showNext).toBe(false);
  });

  test('nextEmoji at the last level transitions to GameOver', () => {
    const state: GameState = {
      ...initialGameState,
      currentLevel: emojiObjects.length - 1,
      emojiStatus: EmojiSearchStatus.Found,
    };
    const next = gameReducer(state, { type: 'nextEmoji' });
    expect(next.emojiStatus).toBe(EmojiSearchStatus.GameOver);
  });

  test('restart returns to the initial state', () => {
    const state: GameState = {
      currentLevel: 3,
      timeRemaining: 5,
      emojiStatus: EmojiSearchStatus.GameOver,
      showNext: false,
    };
    expect(gameReducer(state, { type: 'restart' })).toEqual(initialGameState);
  });
});
