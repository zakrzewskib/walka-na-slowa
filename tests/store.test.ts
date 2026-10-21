// @vitest-environment jsdom
import { Timestamp } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  firebaseCreateGame,
  firebaseGetGame,
  firebaseSubmitGuess,
  type GameDTO,
} from '../src/firebase';
import { useAppStore } from '../src/store/store';
import type { Guess, GuessSubmit } from '../src/types';

// Replaces the whole module, so the real firebase.ts (and its env var checks) is never loaded.
vi.mock('../src/firebase', () => ({
  HARDCODED_CORRECT_WORD: 'LALKA',
  firebaseCreateGame: vi.fn(),
  firebaseGetGame: vi.fn(),
  firebaseSubmitGuess: vi.fn(),
}));

const STORAGE_KEY = 'walka-na-slowa-storage';

type LoadedGame = Awaited<ReturnType<typeof firebaseGetGame>>;

const makeSubmit = (value: string, id = `id-${value}`): GuessSubmit => ({
  id,
  value,
  userId: 'test-user',
});

const makeGuess = (value: string): Guess => ({
  ...makeSubmit(value),
  evaluatedGuess: {
    letters: value.split('').map((letter) => ({
      value: letter,
      exists: true,
      correctPlace: true,
    })),
  },
});

const makeGame = (overrides: Partial<GameDTO> = {}): GameDTO => ({
  id: 'game-123',
  userId: 'test-user',
  correctWord: 'LALKA',
  guesses: [],
  createdAt: Timestamp.now(),
  ...overrides,
});

function resetStore() {
  useAppStore.setState({ gameId: '', correctWord: '', guesses: [] });
  localStorage.clear(); // after setState, because persist writes on every change
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(firebaseSubmitGuess).mockResolvedValue(undefined);
  resetStore();
});

describe('createGame', () => {
  it('stores the id returned by firebase and the correct word', async () => {
    vi.mocked(firebaseCreateGame).mockResolvedValue('game-123');

    await useAppStore.getState().createGame();

    const { gameId, correctWord, guesses } = useAppStore.getState();
    expect(gameId).toBe('game-123');
    expect(correctWord).toBe('LALKA');
    expect(guesses).toEqual([]);
  });

  it('clears guesses left over from a previous game', async () => {
    useAppStore.setState({ guesses: [makeGuess('BRTGW')] });
    vi.mocked(firebaseCreateGame).mockResolvedValue('game-123');

    await useAppStore.getState().createGame();

    expect(useAppStore.getState().guesses).toEqual([]);
  });

  it('rejects and leaves the state untouched when firebase fails', async () => {
    vi.mocked(firebaseCreateGame).mockRejectedValue(new Error('network down'));

    await expect(useAppStore.getState().createGame()).rejects.toThrow('network down');

    const { gameId, correctWord, guesses } = useAppStore.getState();
    expect(gameId).toBe('');
    expect(correctWord).toBe('');
    expect(guesses).toEqual([]);
  });
});

describe('submitGuess', () => {
  describe('without a game', () => {
    it('throws an error when there is no gameId', async () => {
      useAppStore.setState({ gameId: '', correctWord: 'LALKA' });

      await expect(useAppStore.getState().submitGuess(makeSubmit('BRTGW'))).rejects.toThrow();

      expect(useAppStore.getState().guesses).toEqual([]);
      expect(firebaseSubmitGuess).not.toHaveBeenCalled();
    });

    it('throws an error when there is no correctWord', async () => {
      useAppStore.setState({ gameId: 'game-123', correctWord: '' });

      await expect(useAppStore.getState().submitGuess(makeSubmit('BRTGW'))).rejects.toThrow();

      expect(useAppStore.getState().guesses).toEqual([]);
      expect(firebaseSubmitGuess).not.toHaveBeenCalled();
    });
  });

  describe('with an active game', () => {
    beforeEach(() => {
      useAppStore.setState({ gameId: 'game-123', correctWord: 'LALKA', guesses: [] });
    });

    it('evaluates the guess against the correct word', async () => {
      await useAppStore.getState().submitGuess(makeSubmit('LALKA'));

      const [guess] = useAppStore.getState().guesses;
      expect(guess.value).toBe('LALKA');
      expect(guess.evaluatedGuess.letters).toHaveLength(5);
      expect(guess.evaluatedGuess.letters.every((l) => l.correctPlace)).toBe(true);
    });

    it('marks letters that are not in the word as absent', async () => {
      await useAppStore.getState().submitGuess(makeSubmit('BRTGW'));

      const [guess] = useAppStore.getState().guesses;
      expect(guess.evaluatedGuess.letters.every((l) => !l.exists && !l.correctPlace)).toBe(true);
    });

    it('sends the evaluated guess to firebase with the current gameId', async () => {
      await useAppStore.getState().submitGuess(makeSubmit('KALLA', 'guess-1'));

      expect(firebaseSubmitGuess).toHaveBeenCalledTimes(1);
      expect(firebaseSubmitGuess).toHaveBeenCalledWith(
        'game-123',
        expect.objectContaining({
          id: 'guess-1',
          value: 'KALLA',
          userId: 'test-user',
          evaluatedGuess: expect.objectContaining({ letters: expect.any(Array) }),
        }),
      );
    });

    it('updates local state optimistically, before firebase resolves', async () => {
      let resolveSubmit!: () => void;
      vi.mocked(firebaseSubmitGuess).mockReturnValue(
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
      );

      const pending = useAppStore.getState().submitGuess(makeSubmit('BRTGW'));

      // firebase has not answered yet, but the guess is already on the board
      expect(useAppStore.getState().guesses).toHaveLength(1);

      resolveSubmit();
      await pending;

      expect(useAppStore.getState().guesses).toHaveLength(1);
    });

    it('appends guesses in submission order', async () => {
      await useAppStore.getState().submitGuess(makeSubmit('BRTGW'));
      await useAppStore.getState().submitGuess(makeSubmit('LALKA'));

      expect(useAppStore.getState().guesses.map((g) => g.value)).toEqual(['BRTGW', 'LALKA']);
    });

    it('rejects and rolls back the optimistic guess when firebase fails', async () => {
      const existing = [makeGuess('BRTGW')];
      useAppStore.setState({ guesses: existing });
      vi.mocked(firebaseSubmitGuess).mockRejectedValue(new Error('write failed'));

      await expect(useAppStore.getState().submitGuess(makeSubmit('KALLA'))).rejects.toThrow(
        'write failed',
      );

      // the failed guess is gone, the earlier one is untouched
      expect(useAppStore.getState().guesses).toEqual(existing);
    });

    // Enable once the rollback filters by guess id instead of restoring a snapshot.
    it.todo('rolls back only the failed guess when two submits overlap');
  });
});

describe('loadGame', () => {
  it('loads gameId, correctWord and guesses from firebase', async () => {
    const guesses = [makeGuess('BRTGW'), makeGuess('LALKA')];
    vi.mocked(firebaseGetGame).mockResolvedValue(makeGame({ guesses }));
    await useAppStore.getState().loadGame('game-123');

    expect(firebaseGetGame).toHaveBeenCalledWith('game-123');
    const state = useAppStore.getState();
    expect(state.gameId).toBe('game-123');
    expect(state.correctWord).toBe('LALKA');
    expect(state.guesses).toEqual(guesses);
  });

  it('keeps the current state when the game cannot be loaded', async () => {
    const existing = [makeGuess('BRTGW')];
    useAppStore.setState({ gameId: 'old-game', correctWord: 'LALKA', guesses: existing });

    vi.mocked(firebaseGetGame).mockRejectedValue(new Error('boom'));

    await expect(useAppStore.getState().loadGame('missing-game')).rejects.toThrow('boom');

    const state = useAppStore.getState();
    expect(state.gameId).toBe('old-game');
    expect(state.correctWord).toBe('LALKA');
    expect(state.guesses).toEqual(existing);
  });

  it('does not set a gameId when there is no previous game and loading fails', async () => {
    vi.mocked(firebaseGetGame).mockRejectedValue(new Error('boom'));

    await expect(useAppStore.getState().loadGame('missing-game')).rejects.toThrow('boom');

    expect(useAppStore.getState().gameId).toBe('');
  });
});

describe('finishGame', () => {
  it('clears gameId, correctWord and guesses', async () => {
    useAppStore.setState({
      gameId: 'game-123',
      correctWord: 'LALKA',
      guesses: [makeGuess('BRTGW')],
    });

    await useAppStore.getState().finishGame();

    const { gameId, correctWord, guesses } = useAppStore.getState();
    expect(gameId).toBe('');
    expect(correctWord).toBe('');
    expect(guesses).toEqual([]);
  });

  it('clears the persisted gameId, so a reload does not restore the finished game', async () => {
    useAppStore.setState({ gameId: 'game-123', correctWord: 'LALKA' });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').state).toEqual({
      gameId: 'game-123',
    });

    await useAppStore.getState().finishGame();

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').state).toEqual({ gameId: '' });
  });

  // Locks in the current early return. When the store todo turns this into an error,
  // change the assertion to `rejects.toThrow()`.
  it('does nothing when there is no active game', async () => {
    const existing = [makeGuess('BRTGW')];
    useAppStore.setState({ gameId: '', correctWord: 'LALKA', guesses: existing });

    await expect(useAppStore.getState().finishGame()).resolves.toBeUndefined();

    const state = useAppStore.getState();
    expect(state.correctWord).toBe('LALKA');
    expect(state.guesses).toEqual(existing);
  });
});

describe('persistence', () => {
  it('persists only the gameId', () => {
    useAppStore.setState({
      gameId: 'game-123',
      correctWord: 'LALKA',
      guesses: [makeGuess('BRTGW')],
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');

    expect(stored.state).toEqual({ gameId: 'game-123' });
  });

  it('reloads the game from firebase when a gameId is found in storage', async () => {
    vi.mocked(firebaseGetGame).mockResolvedValue({
      id: 'game-123',
      userId: 'test-user',
      correctWord: 'LALKA',
      guesses: [makeGuess('BRTGW')],
    } as unknown as LoadedGame);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { gameId: 'game-123' }, version: 0 }),
    );

    await useAppStore.persist.rehydrate();

    // loadGame is fired from the rehydrate callback without being awaited
    await vi.waitFor(() => expect(useAppStore.getState().guesses).toHaveLength(1));
    expect(firebaseGetGame).toHaveBeenCalledWith('game-123');
    expect(useAppStore.getState().correctWord).toBe('LALKA');
  });

  it('does not call firebase when nothing is stored', async () => {
    await useAppStore.persist.rehydrate();

    expect(firebaseGetGame).not.toHaveBeenCalled();
  });

  // Enable once onRehydrateStorage catches loadGame errors and resets the stale gameId.
  it.todo('resets the stale gameId when the game cannot be restored from storage');
});
