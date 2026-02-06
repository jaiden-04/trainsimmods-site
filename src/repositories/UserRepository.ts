import { pool } from '../database/pool';
import { User, CreateUserData } from '../models/User';

export class UserRepository {
  async findById(id: number): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, username, email, password_hash as "passwordHash", steam_id as "steamId", display_name as "displayName", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, username, email, password_hash as "passwordHash", steam_id as "steamId", display_name as "displayName", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, username, email, password_hash as "passwordHash", steam_id as "steamId", display_name as "displayName", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async findBySteamId(steamId: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, username, email, password_hash as "passwordHash", steam_id as "steamId", display_name as "displayName", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE steam_id = $1',
      [steamId]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateUserData): Promise<User> {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, steam_id, display_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, password_hash as "passwordHash", steam_id as "steamId", display_name as "displayName", created_at as "createdAt", updated_at as "updatedAt"',
      [data.username, data.email, data.passwordHash || null, data.steamId || null, data.displayName || null]
    );
    return result.rows[0];
  }
}