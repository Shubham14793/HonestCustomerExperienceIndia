/**
 * Minimal structured logger for server/serverless output.
 * Uses console methods so logs surface in hosting platforms (e.g., Vercel).
 */
export type LogLevel = 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const payload = meta ? { message, ...meta } : { message };
  const line = `[${level.toUpperCase()}] ${JSON.stringify(payload)}`;
  // eslint-disable-next-line no-console
  console[level === 'info' ? 'log' : level](line);
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
};
