export const sel = {
  createGameBtn: '[data-testid="create-game-dialog-btn"]',
  createGameDialog: '[data-testid="create-game-dialog"]',
  keyboard: '[data-testid="keyboard"]',
  playerBoard: '[data-testid="player-board"]',
  opponentBoard: '[data-testid="opponent-board"]',
  key: (value: string) => `[data-testid="key-${value}"]`,
} as const;
