import app from './app';
import { connectRedis } from './database/redis';
import { pool } from './database/pool';
import { environment } from './config/environment';

async function start() {
  try {
    await connectRedis();
    
    await pool.query('SELECT NOW()');
    console.log('Database connected');

    app.listen(environment.port, () => {
      console.log(`Server running on http://localhost:${environment.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

start();