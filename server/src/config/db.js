import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

let pool = null;
let usePostgres = false;

export const inMemoryStore = {
  destinations: [],
  trips: [],
  itinerary_items: [],
  expenses: [],
  imported_datasets: [],
  autoIds: {
    destinations: 1,
    trips: 1,
    itinerary_items: 1,
    expenses: 1,
    imported_datasets: 1,
  },
};

const connectionConfig = process.env.DATABASE_URL
  ? {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 3000,
  }
  : {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'tripcraft',
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 3000,
  };

export async function initDatabase() {
  try {
    pool = new Pool(connectionConfig);
    const client = await pool.connect();
    usePostgres = true;
    console.log('✅ [Database] Successfully connected to PostgreSQL database.');

    const schemaPath = path.join(__dirname, '../db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('✅ [Database] PostgreSQL schema verified / created.');
    }
    client.release();
    return true;
  } catch (err) {
    usePostgres = false;
    console.warn('⚠️ [Database] PostgreSQL connection failed or server not running:', err.message);
    console.warn('💡 [Database] Running in Fallback In-Memory Mode. Set DATABASE_URL in server/.env to activate live PostgreSQL.');
    return false;
  }
}

export function isPostgresActive() {
  return usePostgres;
}

export async function query(text, params = []) {
  if (usePostgres && pool) {
    return pool.query(text, params);
  }
  return executeInMemoryQuery(text, params);
}

function executeInMemoryQuery(sql, params) {
  const normalized = sql.trim().toUpperCase();

  if (normalized.startsWith('SELECT')) {
    if (normalized.includes('FROM DESTINATIONS')) {
      return { rows: [...inMemoryStore.destinations] };
    }
    if (normalized.includes('FROM TRIPS')) {
      return { rows: [...inMemoryStore.trips] };
    }
    if (normalized.includes('FROM ITINERARY_ITEMS')) {
      return { rows: [...inMemoryStore.itinerary_items] };
    }
    if (normalized.includes('FROM EXPENSES')) {
      return { rows: [...inMemoryStore.expenses] };
    }
    if (normalized.includes('FROM IMPORTED_DATASETS')) {
      return { rows: [...inMemoryStore.imported_datasets] };
    }
  }

  return { rows: [] };
}

export { pool };

