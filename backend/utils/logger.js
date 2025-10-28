import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Disable pino-pretty in production and serverless environments (Vercel)
  // pino-pretty requires worker threads which are not available in serverless
  transport:
    process.env.NODE_ENV !== 'production' && !process.env.VERCEL
      ? {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'HH:MM:ss' },
        }
      : undefined,
});
