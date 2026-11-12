// @vitest-environment jsdom
import { Timestamp } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toaster } from '../src/components/ui/toaster';
import {
  firebaseCreateGame,
  firebaseGetGame,
  firebaseSubmitGuess,
  type GameDTO,
} from '../src/firebase/games';
import { useAppStore } from '../src/store/store';
import type { Guess, GuessSubmit } from '../src/types';

vi.mock('../src/firebase/games', () => ({
  HARDCODED_CORRECT_WORD: 'LALKA',
  firebaseCreateGame: vi.fn(),
  firebaseGetGame: vi.fn(),
  firebaseSubmitGuess: vi.fn(),
}));

vi.mock('../src/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
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

const makeSoloGame = (overrides: Partial<GameDTO> = {}): GameDTO => ({
  id: 'game-123',
  playerIds: ['test-user'],
  gameMode: 'solo',
  gameResult: null,
  status: 'in_progress',
  correctWord: 'LALKA',
  guesses: [],
  createdAt: Timestamp.now(),
  ...overrides,
});

function resetStore() {
  useAppStore.setState({
    gameId: '',
    correctWord: '',
    guesses: [],
    gameResult: null,
    currentGuess: '',
    isSubmittingGuess: false,
  });
  localStorage.clear(); // after setState, because persist writes on every change
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(firebaseSubmitGuess).mockResolvedValue({
    guess: makeGuess('ABCDE'),
    gameResult: { mode: 'solo', outcome: 'lost' },
  });
  resetStore();
});

// todo: Add tests depending on the game mode
describe('createGame', () => {
  it('stores the id returned by firebase and the correct word', async () => {
    vi.mocked(firebaseCreateGame).mockResolvedValue('game-123');

    await useAppStore.getState().createGame('solo');

    const { gameId, correctWord, guesses } = useAppStore.getState();
    expect(gameId).toBe('game-123');
    expect(correctWord).toBe('LALKA');
    expect(guesses).toEqual([]);
  });

  it('clears guesses left over from a previous game', async () => {
    useAppStore.setState({ guesses: [makeGuess('BRTGW')] });
    vi.mocked(firebaseCreateGame).mockResolvedValue('game-123');

    await useAppStore.getState().createGame('solo');

    expect(useAppStore.getState().guesses).toEqual([]);
  });

  it('rejects and leaves the state untouched when firebase fails', async () => {
    vi.mocked(firebaseCreateGame).mockRejectedValue(new Error('network down'));

    await expect(useAppStore.getState().createGame('solo')).rejects.toThrow('network down');

    const { gameId, correctWord, guesses } = useAppStore.getState();
    expect(gameId).toBe('');
    expect(correctWord).toBe('');
    expect(guesses).toEqual([]);
  });
});

describe('submitGuess', () => {
  describe('without an active game', () => {
    it('throws when there is no gameId', async () => {
      useAppStore.setState({ gameId: '', correctWord: 'LALKA' });

      await expect(useAppStore.getState().submitGuess(makeSubmit('BRTGW'))).rejects.toThrow(
        'Store: gameId does not exist!',
      );

      expect(useAppStore.getState().guesses).toEqual([]);
      expect(firebaseSubmitGuess).not.toHaveBeenCalled();
    });

    it('throws when the game is already finished', async () => {
      useAppStore.setState({
        gameId: 'game-123',
        correctWord: 'LALKA',
        gameResult: { mode: 'solo', outcome: 'lost' },
      });

      await expect(useAppStore.getState().submitGuess(makeSubmit('BRTGW'))).rejects.toThrow(
        'Store: game is finished!',
      );

      expect(useAppStore.getState().guesses).toEqual([]);
      expect(firebaseSubmitGuess).not.toHaveBeenCalled();
    });

    it('reports a finished game before a missing gameId', async () => {
      useAppStore.setState({ gameId: '', gameResult: { mode: 'solo', outcome: 'lost' } });

      await expect(useAppStore.getState().submitGuess(makeSubmit('BRTGW'))).rejects.toThrow(
        'Store: game is finished!',
      );
    });

    it('does not touch isSubmittingGuess when validation fails', async () => {
      useAppStore.setState({ gameId: '' });

      await expect(useAppStore.getState().submitGuess(makeSubmit('BRTGW'))).rejects.toThrow();

      expect(useAppStore.getState().isSubmittingGuess).toBe(false);
    });
  });

  describe('with an active game', () => {
    beforeEach(() => {
      useAppStore.setState({ gameId: 'game-123', correctWord: 'LALKA', guesses: [] });
    });

    it('stores a versus result with the winner id', async () => {
      vi.mocked(firebaseSubmitGuess).mockResolvedValue({
        guess: makeGuess('LALKA'),
        gameResult: { mode: 'versus', winnerId: 'test-user' },
      });

      await useAppStore.getState().submitGuess(makeSubmit('LALKA'));

      expect(useAppStore.getState().gameResult).toEqual({ mode: 'versus', winnerId: 'test-user' });
    });

    it('treats a versus draw (winnerId null) as a finished game', async () => {
      vi.mocked(firebaseSubmitGuess).mockResolvedValue({
        guess: makeGuess('BRTGW'),
        gameResult: { mode: 'versus', winnerId: null },
      });

      await useAppStore.getState().submitGuess(makeSubmit('BRTGW'));

      // the result object is truthy even without a winner, so the guard still blocks guesses
      await expect(useAppStore.getState().submitGuess(makeSubmit('LALKA'))).rejects.toThrow(
        'Store: game is finished!',
      );
      expect(firebaseSubmitGuess).toHaveBeenCalledTimes(1);
    });

    it('stores the game result returned by firebase', async () => {
      vi.mocked(firebaseSubmitGuess).mockResolvedValue({
        guess: makeGuess('LALKA'),
        gameResult: { mode: 'solo', outcome: 'won' },
      });

      await useAppStore.getState().submitGuess(makeSubmit('LALKA'));

      expect(useAppStore.getState().gameResult).toEqual({ mode: 'solo', outcome: 'won' });
    });

    it('keeps gameResult empty while the game is still going', async () => {
      vi.mocked(firebaseSubmitGuess).mockResolvedValue({
        guess: makeGuess('BRTGW'),
        gameResult: null,
      });

      await useAppStore.getState().submitGuess(makeSubmit('BRTGW'));

      expect(useAppStore.getState().gameResult).toBeNull();
    });

    it('rejects further guesses once the game has been won', async () => {
      vi.mocked(firebaseSubmitGuess).mockResolvedValue({
        guess: makeGuess('LALKA'),
        gameResult: { mode: 'solo', outcome: 'lost' },
      });

      await useAppStore.getState().submitGuess(makeSubmit('LALKA'));

      await expect(useAppStore.getState().submitGuess(makeSubmit('BRTGW'))).rejects.toThrow(
        'Store: game is finished!',
      );

      expect(firebaseSubmitGuess).toHaveBeenCalledTimes(1);
      expect(useAppStore.getState().guesses.map((g) => g.value)).toEqual(['LALKA']);
    });

    it('sends the submitted guess to firebase with the current gameId', async () => {
      const submit = makeSubmit('KALLA', 'guess-1');

      await useAppStore.getState().submitGuess(submit);

      expect(firebaseSubmitGuess).toHaveBeenCalledTimes(1);
      expect(firebaseSubmitGuess).toHaveBeenCalledWith('game-123', submit);
    });

    it('appends guesses in submission order', async () => {
      vi.mocked(firebaseSubmitGuess)
        .mockResolvedValueOnce({ guess: makeGuess('BRTGW'), gameResult: null })
        .mockResolvedValueOnce({
          guess: makeGuess('LALKA'),
          gameResult: { mode: 'solo', outcome: 'won' },
        });

      await useAppStore.getState().submitGuess(makeSubmit('BRTGW'));
      await useAppStore.getState().submitGuess(makeSubmit('LALKA'));

      expect(useAppStore.getState().guesses.map((g) => g.value)).toEqual(['BRTGW', 'LALKA']);
    });

    it('clears the typed word after a successful submit', async () => {
      useAppStore.setState({ currentGuess: 'BRTGW' });
      vi.mocked(firebaseSubmitGuess).mockResolvedValue({
        guess: makeGuess('BRTGW'),
        gameResult: null,
      });

      await useAppStore.getState().submitGuess(makeSubmit('BRTGW'));

      expect(useAppStore.getState().currentGuess).toBe('');
    });

    it('sets isSubmittingGuess while the request is pending and resets it afterwards', async () => {
      let resolveSubmit!: (value: Awaited<ReturnType<typeof firebaseSubmitGuess>>) => void;
      vi.mocked(firebaseSubmitGuess).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveSubmit = resolve;
        }),
      );

      const pending = useAppStore.getState().submitGuess(makeSubmit('BRTGW'));

      expect(useAppStore.getState().isSubmittingGuess).toBe(true);

      resolveSubmit({ guess: makeGuess('BRTGW'), gameResult: null });
      await pending;

      expect(useAppStore.getState().isSubmittingGuess).toBe(false);
    });

    it('keeps guesses, typed word and gameResult, and resets isSubmittingGuess, when firebase fails', async () => {
      useAppStore.setState({ currentGuess: 'BRTGW' });
      vi.mocked(firebaseSubmitGuess).mockRejectedValue(new Error('network down'));

      await expect(useAppStore.getState().submitGuess(makeSubmit('BRTGW'))).rejects.toThrow(
        'network down',
      );

      const state = useAppStore.getState();
      expect(state.guesses).toEqual([]);
      expect(state.currentGuess).toBe('BRTGW');
      expect(state.gameResult).toBeNull();
      expect(state.isSubmittingGuess).toBe(false);
    });

    it('allows submitting again after a failed submit', async () => {
      vi.mocked(firebaseSubmitGuess)
        .mockRejectedValueOnce(new Error('network down'))
        .mockResolvedValueOnce({ guess: makeGuess('BRTGW'), gameResult: null });

      await expect(useAppStore.getState().submitGuess(makeSubmit('BRTGW'))).rejects.toThrow();
      await useAppStore.getState().submitGuess(makeSubmit('BRTGW'));

      expect(useAppStore.getState().guesses.map((g) => g.value)).toEqual(['BRTGW']);
    });

    it('ignores a submit while another one is in flight', async () => {
      let resolveFirst!: (value: Awaited<ReturnType<typeof firebaseSubmitGuess>>) => void;
      vi.mocked(firebaseSubmitGuess).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFirst = resolve;
        }),
      );

      const first = useAppStore.getState().submitGuess(makeSubmit('BRTGW'));
      // the store sets the flag itself, so the second call hits the guard
      await expect(
        useAppStore.getState().submitGuess(makeSubmit('LALKA')),
      ).resolves.toBeUndefined();

      expect(firebaseSubmitGuess).toHaveBeenCalledTimes(1);
      // the ignored call must not reset the flag of the request that is still running
      expect(useAppStore.getState().isSubmittingGuess).toBe(true);

      resolveFirst({ guess: makeGuess('BRTGW'), gameResult: null });
      await first;

      expect(useAppStore.getState().guesses.map((g) => g.value)).toEqual(['BRTGW']);
      expect(useAppStore.getState().isSubmittingGuess).toBe(false);
    });

    it('ignores a submit while in flight even when the game is finished or the gameId is missing', async () => {
      // the in-flight guard runs first, so it never reaches the validation errors
      useAppStore.setState({
        isSubmittingGuess: true,
        gameId: '',
        gameResult: { mode: 'solo', outcome: 'lost' },
      });

      await expect(
        useAppStore.getState().submitGuess(makeSubmit('BRTGW')),
      ).resolves.toBeUndefined();

      expect(firebaseSubmitGuess).not.toHaveBeenCalled();
    });
  });
});

describe('loadGame', () => {
  it('loads gameId, correctWord and guesses from firebase', async () => {
    const guesses = [makeGuess('BRTGW'), makeGuess('LALKA')];
    vi.mocked(firebaseGetGame).mockResolvedValue(makeSoloGame({ guesses }));
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
    useAppStore.setState({ gameId: 'game-123', correctWord: 'LALKA', gameMode: 'solo' });

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').state).toEqual({
      gameId: 'game-123',
      gameMode: 'solo',
    });

    await useAppStore.getState().finishGame();

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').state).toEqual({
      gameId: '',
      gameMode: 'solo',
    });
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
  it('persists gameId and mode', () => {
    useAppStore.setState({
      gameId: 'game-123',
      correctWord: 'LALKA',
      guesses: [makeGuess('BRTGW')],
      gameMode: 'solo',
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');

    expect(stored.state).toEqual({ gameId: 'game-123', gameMode: 'solo' });
  });

  it('reloads the game from firebase when a gameId is found in storage', async () => {
    vi.mocked(firebaseGetGame).mockResolvedValue({
      id: 'game-123',
      userId: 'test-user',
      correctWord: 'LALKA',
      guesses: [makeGuess('BRTGW')],
      gameMode: 'versus',
    } as unknown as LoadedGame);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { gameId: 'game-123', gameMode: 'versus' }, version: 0 }),
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

  it('shows an error toast when the stored game cannot be restored', async () => {
    vi.mocked(firebaseGetGame).mockRejectedValue(new Error('boom'));
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { gameId: 'stale-game' }, version: 0 }),
    );

    await useAppStore.persist.rehydrate();

    // loadGame is fired from the rehydrate callback without being awaited
    await vi.waitFor(() =>
      expect(toaster.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error', closable: true }),
      ),
    );

    // nothing was loaded
    expect(useAppStore.getState().correctWord).toBe('');
    expect(useAppStore.getState().guesses).toEqual([]);
  });
});
