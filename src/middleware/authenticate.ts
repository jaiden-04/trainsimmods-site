import { Request, Response, NextFunction } from 'express';

export function authenticate(request: Request, response: Response, next: NextFunction) {
  if (!request.isAuthenticated()) {
    return response.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

export function authenticatePage(request: Request, response: Response, next: NextFunction) {
  if (!request.isAuthenticated()) {
    return response.redirect('/login');
  }
  next();
}