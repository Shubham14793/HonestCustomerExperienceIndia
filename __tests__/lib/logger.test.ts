import { logger } from '../../lib/logger';

const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

describe('logger', () => {
  beforeEach(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

  it('logs info level with console.log and structured payload', () => {
    logger.info('hello world', { requestId: 'abc123' });

    expect(console.log).toHaveBeenCalledTimes(1);
    const arg = (console.log as jest.Mock).mock.calls[0][0];
    expect(arg).toContain('[INFO]');
    expect(arg).toContain('hello world');
    expect(arg).toContain('abc123');
  });

  it('logs warn level with console.warn and structured payload', () => {
    logger.warn('caution', { path: '/api/test' });

    expect(console.warn).toHaveBeenCalledTimes(1);
    const arg = (console.warn as jest.Mock).mock.calls[0][0];
    expect(arg).toContain('[WARN]');
    expect(arg).toContain('caution');
    expect(arg).toContain('/api/test');
  });

  it('logs error level with console.error and includes meta', () => {
    logger.error('boom', { error: 'failure', code: 500 });

    expect(console.error).toHaveBeenCalledTimes(1);
    const arg = (console.error as jest.Mock).mock.calls[0][0];
    expect(arg).toContain('[ERROR]');
    expect(arg).toContain('boom');
    expect(arg).toContain('failure');
    expect(arg).toContain('500');
  });
});
