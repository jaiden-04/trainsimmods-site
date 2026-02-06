import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const environment = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL!,
  redisUrl: process.env.REDIS_URL!,
  sessionSecret: process.env.SESSION_SECRET!,
  steamApiKey: process.env.STEAM_API_KEY || '',
  steamReturnUrl: process.env.STEAM_RETURN_URL || '',
};

if (!environment.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

if (!environment.sessionSecret) {
  throw new Error('SESSION_SECRET is required');
}