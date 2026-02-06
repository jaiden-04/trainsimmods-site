import { Request, Response, NextFunction } from 'express';

export function setLocals(request: Request, response: Response, next: NextFunction) {
  response.locals.user = request.user || null;
  next();
}