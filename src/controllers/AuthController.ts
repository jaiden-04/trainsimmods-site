import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export class AuthController {
  async showRegister(request: Request, response: Response) {
    response.render('auth/register', { error: null });
  }

  async showLogin(request: Request, response: Response) {
    response.render('auth/login', { error: null });
  }

  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const { username, email, password } = request.body;
      await authService.registerWithPassword(username, email, password);
      response.redirect('/login');
    } catch (error) {
      response.render('auth/register', { error: (error as Error).message });
    }
  }

  async logout(request: Request, response: Response) {
    request.logout((error) => {
      if (error) {
        return response.redirect('/');
      }
      response.redirect('/');
    });
  }
}