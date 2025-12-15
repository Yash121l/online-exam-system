import { config } from './config';

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const sendLog = async (level: LogLevel, message: string, context?: Record<string, unknown>) => {
  try {
    console[level === 'fatal' ? 'error' : level](`[${level.toUpperCase()}] ${message}`);
    await fetch(`${config.apiBaseUrl}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'frontend',
        level,
        message,
        context
      })
    });
  } catch (error) {
    console.error('Failed to send client log', error);
  }
};

export const clientLogger = {
  trace: (message: string, context?: Record<string, unknown>) =>
    sendLog('trace', message, context),
  debug: (message: string, context?: Record<string, unknown>) =>
    sendLog('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) =>
    sendLog('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) =>
    sendLog('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) =>
    sendLog('error', message, context),
  fatal: (message: string, context?: Record<string, unknown>) =>
    sendLog('fatal', message, context)
};
