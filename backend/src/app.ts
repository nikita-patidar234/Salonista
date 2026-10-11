import cors from 'cors';
import express from 'express';

import {database} from './database.js';
import {apiRouter} from './routes.js';

export const app = express();
app.use(cors());
app.use(express.json());
app.use((request, response, next) => {
  const startedAt = Date.now();
  response.on('finish', () => {
    console.info(
      `[api] ${request.method} ${request.path} ${response.statusCode} ${Date.now() - startedAt}ms`,
    );
  });
  next();
});
app.use('/api', apiRouter);
app.get('/api/health', async (_request, response) => {
  try {
    await database.query('SELECT 1');
    response.json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    console.warn(
      `[api] health check failed: ${error instanceof Error ? error.message : 'database unavailable'}`,
    );
    response.status(503).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});
app.use((error: unknown, request: express.Request, response: express.Response, next: express.NextFunction) => {
  if (response.headersSent) {
    next(error);
    return;
  }
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(`[api] ${request.method} ${request.path} failed: ${message}`);
  response.status(500).json({error: 'The request could not be completed.'});
});
