import { Pool } from 'pg';
import { environment } from '../config/environment';

export const pool = new Pool({
  connectionString: environment.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (error) => {
  console.error('Unexpected database error:', error);
});