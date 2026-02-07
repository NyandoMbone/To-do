const { Pool } = require('pg');

/**
 * Database Connection Configuration
 * Supports both local docker-compose and cloud deployments (Render)
 * PostgreSQL version
 */
let pool;

// Check if using Render's PostgreSQL service (DATABASE_URL provided)
if (process.env.DATABASE_URL) {
  // Render PostgreSQL connection
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Render
  });
} else {
  // Local/Docker development configuration
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'todo_app',
    port: process.env.DB_PORT || 5432,
  });
}

/**
 * Initialize database connection and create tables
 * @returns {Promise<void>}
 */
function init() {
  return new Promise(async (resolve, reject) => {
    try {
      // Test connection
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Connected to PostgreSQL database');

      // Create ENUM types if they don't exist
      await pool.query(`
        DO $$ BEGIN
          CREATE TYPE status_type AS ENUM('todo', 'in-progress', 'done');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
      `);

      await pool.query(`
        DO $$ BEGIN
          CREATE TYPE priority_type AS ENUM('low', 'medium', 'high');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
      `);

      // Create tables
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status status_type DEFAULT 'todo',
          priority priority_type DEFAULT 'medium',
          due_date TIMESTAMP,
          user_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Create indexes
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_id ON tasks(user_id);`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_status ON tasks(status);`);

      console.log('✅ Database tables are ready');
      resolve();
    } catch (err) {
      console.error('❌ Database initialization error:', err.message);
      reject(err);
    }
  });
}

module.exports = pool;
module.exports.init = init;
