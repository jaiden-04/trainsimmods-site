import { Request, Response, NextFunction } from 'express';

export function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  console.error('Error:', error);

  if (error.message === 'Invalid credentials' || error.message.includes('already exists')) {
    return response.status(400).json({ error: error.message });
  }

  if (error.message.includes('not found')) {
    return response.status(404).json({ error: error.message });
  }

  response.status(500).json({ error: 'Internal server error' });
}