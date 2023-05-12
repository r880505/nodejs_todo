const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '!qAzXsW2',
  database: 'nodejs_todo'
});

// Get all activity-groups
app.get('/activity-groups', (req, res) => {
  pool.query('SELECT * FROM activity_groups', (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// Get a single activity-group by ID
app.get('/activity-groups/:id', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT * FROM activity_groups WHERE activity_group_id = ?', id, (error, results) => {
    if (error) throw error;
    res.send(results[0]);
  });
});

// Create a new activity-group
app.post('/activity-groups', (req, res) => {
  const { title, email } = req.body;
  pool.query('INSERT INTO activity_groups (title, email) VALUES (?, ?)', [title, email], (error, results) => {
    if (error) throw error;
    res.send({ message: 'Activity group created successfully', activity_group_id: results.insertId });
  });
});

// Delete an activity-group by ID
app.delete('/activity-groups/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM activity_groups WHERE activity_group_id = ?', id, (error, results) => {
    if (error) throw error;
    res.send({ message: `Activity group with ID ${id} deleted successfully` });
  });
});

// Get all todo-items
app.get('/todo-items', (req, res) => {
  pool.query('SELECT * FROM todo_items', (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// Get a single todo-item by ID
app.get('/todo-items/:id', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT * FROM todo_items WHERE todo_id = ?', id, (error, results) => {
    if (error) throw error;
    res.send(results[0]);
  });
});

// Create a new todo-item
app.post('/todo-items', (req, res) => {
  const { activity_group_id, title, priority } = req.body;
  const is_active = req.body.is_active || true;
  pool.query('INSERT INTO todo_items (activity_group_id, title, priority, is_active) VALUES (?, ?, ?, ?)', [activity_group_id, title, priority, is_active], (error, results) => {
    if (error) throw error;
    res.send({ message: 'Todo item created successfully', todo_id: results.insertId });
  });
});

// Delete a todo-item by ID
app.delete('/todo-items/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM todo_items WHERE todo_id = ?', id, (error, results) => {
    if (error) throw error;
    res.send({ message: `Todo item with ID ${id} deleted successfully` });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
