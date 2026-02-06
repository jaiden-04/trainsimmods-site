import { createClient } from 'redis';
import { environment } from '../config/environment';

export const redisClient = createClient({
  url: environment.redisUrl,
});

redisClient.on('error', (error) => {
  console.error('Redis error:', error);
});

export async function connectRedis() {
  await redisClient.connect();
  console.log('Redis connected');
}