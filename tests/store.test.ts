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
  mode: 'solo',
  result: null,
  status: 'in_progress',
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
  vi.mocked(firebaseSubmitGuess).mockResolvedValue({
    guess: makeGuess('ABCDE'),
    gameResult: { outcome: 'lostAlone' },
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

    it('stores the guess evaluated and returned by firebase', async () => {
      const evaluated = makeGuess('LALKA');
      vi.mocked(firebaseSubmitGuess).mockResolvedValue({
        guess: evaluated,
        gameResult: { outcome: 'wonAlone' },
      });

      await useAppStore.getState().submitGuess(makeSubmit('LALKA'));

      expect(useAppStore.getState().guesses).toEqual([evaluated]);
    });

    it('stores the game result returned by firebase', async () => {
      vi.mocked(firebaseSubmitGuess).mockResolvedValue({
        guess: makeGuess('LALKA'),
        gameResult: { outcome: 'wonAlone' },
      });

      await useAppStore.getState().submitGuess(makeSubmit('LALKA'));

      expect(useAppStore.getState().gameResult).toEqual({ outcome: 'wonAlone' });
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
        .mockResolvedValueOnce({ guess: makeGuess('LALKA'), gameResult: { outcome: 'wonAlone' } });

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

    it('resets isSubmittingGuess after a successful submit', async () => {
      await useAppStore.getState().submitGuess(makeSubmit('BRTGW'));

      expect(useAppStore.getState().isSubmittingGuess).toBe(false);
    });

    it('keeps guesses and typed word, and resets isSubmittingGuess, when firebase fails', async () => {
      useAppStore.setState({ currentGuess: 'BRTGW' });
      vi.mocked(firebaseSubmitGuess).mockRejectedValue(new Error('network down'));

      await expect(useAppStore.getState().submitGuess(makeSubmit('BRTGW'))).rejects.toThrow(
        'network down',
      );

      const state = useAppStore.getState();
      expect(state.guesses).toEqual([]);
      expect(state.currentGuess).toBe('BRTGW');
      expect(state.isSubmittingGuess).toBe(false);
    });

    it('ignores a submit while another one is in flight', async () => {
      let resolveFirst!: (value: Awaited<ReturnType<typeof firebaseSubmitGuess>>) => void;
      vi.mocked(firebaseSubmitGuess).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFirst = resolve;
        }),
      );

      const first = useAppStore.getState().submitGuess(makeSubmit('BRTGW'));
      // the flag is set by the store itself while the request is pending
      useAppStore.setState({ isSubmittingGuess: true });
      await useAppStore.getState().submitGuess(makeSubmit('LALKA'));

      expect(firebaseSubmitGuess).toHaveBeenCalledTimes(1);

      resolveFirst({ guess: makeGuess('BRTGW'), gameResult: null });
      await first;

      expect(useAppStore.getState().guesses.map((g) => g.value)).toEqual(['BRTGW']);
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
    useAppStore.setState({ gameId: 'game-123', correctWord: 'LALKA', mode: 'solo' });

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').state).toEqual({
      gameId: 'game-123',
      mode: 'solo',
    });

    await useAppStore.getState().finishGame();

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').state).toEqual({
      gameId: '',
      mode: 'solo',
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
      mode: 'solo',
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');

    expect(stored.state).toEqual({ gameId: 'game-123', mode: 'solo' });
  });

  it('reloads the game from firebase when a gameId is found in storage', async () => {
    vi.mocked(firebaseGetGame).mockResolvedValue({
      id: 'game-123',
      userId: 'test-user',
      correctWord: 'LALKA',
      guesses: [makeGuess('BRTGW')],
      mode: 'versus',
    } as unknown as LoadedGame);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { gameId: 'game-123', mode: 'versus' }, version: 0 }),
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
