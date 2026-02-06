import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserData } from '../models/User';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async registerWithPassword(username: string, email: string, password: string) {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userData: CreateUserData = {
      username,
      email,
      passwordHash,
      displayName: username,
    };

    return await this.userRepository.create(userData);
  }

  async loginWithPassword(username: string, password: string) {
    const user = await this.userRepository.findByUsername(username);
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async findOrCreateSteamUser(steamId: string, displayName: string) {
    let user = await this.userRepository.findBySteamId(steamId);
    
    if (!user) {
      const userData: CreateUserData = {
        username: `steam_${steamId}`,
        email: `${steamId}@steam.local`,
        steamId,
        displayName,
      };
      user = await this.userRepository.create(userData);
    }

    return user;
  }
}