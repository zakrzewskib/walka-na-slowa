type Level = 'debug' | 'info' | 'warn' | 'error';

const ORDER: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };

// Tests: silent
// Production build: only warn and error get through
// Dev server: everything, including debug.
const minLevel: Level | 'silent' =
  import.meta.env.MODE === 'test' ? 'silent' : import.meta.env.PROD ? 'warn' : 'debug';

function log(level: Level, message: string, context?: unknown) {
  if (minLevel === 'silent' || ORDER[level] < ORDER[minLevel]) return;

  console[level](`[${level}] ${message}`, context ?? '');

  if (level === 'error') {
    // todo add sentry: Sentry.captureException(context instanceof Error ? context : new Error(message), { extra: { message } });
  }
}

export const logger = {
  debug: (msg: string, ctx?: unknown) => log('debug', msg, ctx),
  info: (msg: string, ctx?: unknown) => log('info', msg, ctx),
  warn: (msg: string, ctx?: unknown) => log('warn', msg, ctx),
  error: (msg: string, ctx?: unknown) => log('error', msg, ctx),
};
