const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1Lambinfor.',
  database: process.env.DB_NAME || 'todo_app',
  multipleStatements: true,
});

/**
 * Initialize database connection and create tables
 * @returns {Promise<void>}
 */
function init() {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
        return reject(err);
      }

      console.log('✅ Connected to MySQL database');

      const createTables = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tasks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status ENUM('todo', 'in-progress', 'done') DEFAULT 'todo',
          priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
          due_date DATETIME,
          user_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_status (status)
        );
      `;

      db.query(createTables, (err) => {
        if (err) {
          console.error('❌ Error creating tables:', err.message);
          return reject(err);
        }
        console.log('✅ Database tables are ready');
        resolve();
      });
    });
  });
}

module.exports = db;
module.exports.init = init;
