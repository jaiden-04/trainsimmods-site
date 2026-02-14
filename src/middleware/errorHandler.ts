import { Request, Response, NextFunction } from 'express';

export function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  console.error('Error:', error);

  const message = error?.message || '';

  if (message === 'Invalid credentials' || message.includes('already exists')) {
    return response.status(400).json({ error: message });
  }

  if (message.includes('not found')) {
    return response.status(404).json({ error: message });
  }

  response.status(500).json({ error: 'Internal server error' });
}