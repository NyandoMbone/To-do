const db = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { STATUS_CODES, TASK_STATUS, TASK_PRIORITY } = require('../config/constants');

// Helper to convert ISO string to MySQL DATETIME ('YYYY-MM-DD HH:MM:SS')
const toMySQLDatetime = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  // YYYY-MM-DD HH:MM:SS
  return d.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Get all tasks for logged-in user
 * GET /api/tasks
 */
const getTasks = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT id, title, description, status, priority, due_date AS dueDate, created_at AS createdAt
     FROM tasks
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
    (err, results) => {
      if (err) {
        return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to fetch tasks', err);
      }

      // Format the results
      const formattedTasks = results.map((task) => ({
        id: task.id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        createdAt: new Date(task.createdAt).toISOString(),
      }));

      sendSuccess(res, STATUS_CODES.OK, 'Tasks retrieved successfully', formattedTasks);
    }
  );
};

/**
 * Get single task by id
 * GET /api/tasks/:id
 */
const getTaskById = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.query(
    `SELECT id, title, description, status, priority, due_date AS dueDate, created_at AS createdAt
     FROM tasks WHERE id = ? AND user_id = ?`,
    [id, userId],
    (err, results) => {
      if (err) return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to fetch task', err);
      if (!results || results.length === 0) return sendError(res, STATUS_CODES.NOT_FOUND, 'Task not found');

      const task = results[0];
      const formatted = {
        id: task.id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        createdAt: new Date(task.createdAt).toISOString(),
      };

      sendSuccess(res, STATUS_CODES.OK, 'Task retrieved successfully', formatted);
    }
  );
};

/**
 * Create a new task
 * POST /api/tasks
 */
const createTask = (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const userId = req.user.id;

  // Validation
  if (!title) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'Title is required');
  }

  const taskStatus = status || TASK_STATUS.TODO;
  const taskPriority = priority || TASK_PRIORITY.MEDIUM;

  const mysqlDueDate = dueDate ? toMySQLDatetime(dueDate) : null;

  db.query(
    `INSERT INTO tasks (title, description, status, priority, due_date, user_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description || null, taskStatus, taskPriority, mysqlDueDate, userId],
    (err, result) => {
      if (err) {
        return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to create task', err);
      }

      sendSuccess(res, STATUS_CODES.CREATED, 'Task created successfully', {
        id: result.insertId.toString(),
        title,
        description: description || null,
        status: taskStatus,
        priority: taskPriority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        createdAt: new Date().toISOString(),
      });
    }
  );
};

/**
 * Update a task
 * PUT /api/tasks/:id
 */
const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;
  const userId = req.user.id;

  if (!id) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'Task ID is required');
  }

  // Build update query dynamically
  const updates = [];
  const values = [];

  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description);
  }
  if (status !== undefined) {
    updates.push('status = ?');
    values.push(status);
  }
  if (priority !== undefined) {
    updates.push('priority = ?');
    values.push(priority);
  }
  if (dueDate !== undefined) {
    updates.push('due_date = ?');
    values.push(dueDate ? toMySQLDatetime(dueDate) : null);
  }

  if (updates.length === 0) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'No fields to update');
  }

  values.push(id);
  values.push(userId);

  const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to update task', err);
    }

    if (result.affectedRows === 0) {
      return sendError(res, STATUS_CODES.NOT_FOUND, 'Task not found or unauthorized');
    }

    // Fetch updated task
    db.query(
      `SELECT id, title, description, status, priority, due_date AS dueDate, created_at AS createdAt
       FROM tasks WHERE id = ? AND user_id = ?`,
      [id, userId],
      (fetchErr, fetchResults) => {
        if (fetchErr || fetchResults.length === 0) {
          return sendSuccess(res, STATUS_CODES.OK, 'Task updated successfully');
        }

        const task = fetchResults[0];
        sendSuccess(res, STATUS_CODES.OK, 'Task updated successfully', {
          id: task.id.toString(),
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
          createdAt: new Date(task.createdAt).toISOString(),
        });
      }
    );
  });
};

/**
 * Delete a task
 * DELETE /api/tasks/:id
 */
const deleteTask = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'Task ID is required');
  }

  db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId], (err, result) => {
    if (err) {
      return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to delete task', err);
    }

    if (result.affectedRows === 0) {
      return sendError(res, STATUS_CODES.NOT_FOUND, 'Task not found or unauthorized');
    }

    sendSuccess(res, STATUS_CODES.OK, 'Task deleted successfully');
  });
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
