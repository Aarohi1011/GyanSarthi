const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'todos.json');

// Enhanced CORS configuration
app.use(cors({
  origin: "http://localhost:5173", // Explicitly allow Vite frontend
  credentials: true
}));

app.use(express.json());

// Helper function to read todos
const readTodos = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write todos
const writeTodos = (todos) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};

// Initialize todos.json with empty array if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  writeTodos([]);
}

// Routes
// Get all todos
app.get('/api/todos', (req, res) => {
  console.log('GET /api/todos requested');
  const todos = readTodos();
  console.log('Sending todos:', todos);
  res.json(todos);
});

// Add a new todo
app.post('/api/todos', (req, res) => {
  console.log('POST /api/todos called with:', req.body);
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const todos = readTodos();
  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  writeTodos(todos);
  console.log('New todo added:', newTodo);
  res.status(201).json(newTodo);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  console.log('DELETE /api/todos/', req.params.id);
  const { id } = req.params;
  let todos = readTodos();
  const initialLength = todos.length;
  
  todos = todos.filter(todo => todo.id !== id);
  
  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  writeTodos(todos);
  console.log('Todo deleted, remaining:', todos.length);
  res.status(204).send();
});

// Toggle todo completion
app.patch('/api/todos/:id/toggle', (req, res) => {
  console.log('PATCH /api/todos/', req.params.id, 'toggle');
  const { id } = req.params;
  const todos = readTodos();
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos[todoIndex].completed = !todos[todoIndex].completed;
  writeTodos(todos);
  console.log('Todo toggled:', todos[todoIndex]);
  res.json(todos[todoIndex]);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 API endpoints: http://localhost:${PORT}/api/todos`);
});