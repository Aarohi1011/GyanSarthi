import { useState, useEffect } from "react";
import axios from "axios";
import TodoList from "./component/TodoList";
import AddTodo from "./component/AddTodo";

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      setError('');
      console.log('Fetching todos from backend...');
      const response = await api.get('/todos');
      console.log('Todos received:', response.data);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Make sure the backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add a new todo
  const addTodo = async (text) => {
    try {
      setError('');
      console.log('Adding todo:', text);
      const response = await api.post('/todos', { text });
      console.log('Todo added successfully:', response.data);
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      setError('');
      console.log('Deleting todo:', id);
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      console.log('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo. Please try again.');
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    try {
      setError('');
      console.log('Toggling todo:', id);
      const response = await api.patch(`/todos/${id}/toggle`);
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ));
      console.log('Todo toggled successfully');
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Failed to update todo. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="todo-app">
        <header className="app-header">
          <h1>Elegant Todo</h1>
          <p>Organize your tasks with style</p>
        </header>
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
            <button onClick={fetchTodos} className="retry-btn">
              Retry
            </button>
          </div>
        )}
        
        <AddTodo addTodo={addTodo} />
        
        <div className="todos-count">
          {todos.length > 0 ? (
            <span>
              {todos.filter(t => t.completed).length} of {todos.length} tasks completed
              ({Math.round((todos.filter(t => t.completed).length / todos.length) * 100)}%)
            </span>
          ) : (
            <span>No tasks yet. Add one above!</span>
          )}
        </div>
        
        <TodoList 
          todos={todos} 
          deleteTodo={deleteTodo} 
          toggleTodo={toggleTodo}
        />
      </div>
    </div>
  );
}

export default App;