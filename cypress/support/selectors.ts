export const sel = {
  createGameBtn: '[data-testid="create-game-dialog-btn"]',
  createGameDialog: '[data-testid="create-game-dialog"]',
  keyboard: '[data-testid="keyboard"]',
  playerBoard: '[data-testid="player-board"]',
  opponentBoard: '[data-testid="opponent-board"]',
  key: (value: string) => `[data-testid="key-${value}"]`,
  surrenderBtn: '[data-testid="surrender-button"]',
  toaster: '[data-testid="toaster"]',
  grid: '[role="grid"]',
  gridCell: '[role="gridcell"]',
  row: '[role="row"]',
  errorAlert: '[data-testid="error-alert"]',
} as const;
