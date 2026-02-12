import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (
  process.env.DB_HOST === undefined ||
  process.env.DB_USER === undefined ||
  process.env.DB_PASSWORD === undefined ||
  process.env.DB_DATABASE === undefined
) {
  throw new Error('Missing required environment variables for database connection.');
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database.');
    connection.release();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default pool;
