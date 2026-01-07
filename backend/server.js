const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database
const db = new sqlite3.Database('./database.db');

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_name TEXT NOT NULL,
    is_completed INTEGER DEFAULT 0
  )
`);

// ====================== API ROUTES ======================

// GET all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new task
app.post('/api/tasks', (req, res) => {
  const { task_name } = req.body;

  db.run(
    'INSERT INTO tasks (task_name) VALUES (?)',
    [task_name],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id: this.lastID,
        task_name,
        is_completed: 0
      });
    }
  );
});

// PATCH update task
app.patch('/api/tasks/:id', (req, res) => {
  const { is_completed } = req.body;
  const { id } = req.params;

  db.run(
    'UPDATE tasks SET is_completed = ? WHERE id = ?',
    [is_completed, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
