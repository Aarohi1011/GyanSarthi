import { useState } from 'react';
import './App.css';

function App() {
  // State for the list of todos
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);
  
  // State for the new todo input
  const [newTodo, setNewTodo] = useState('');
  
  // State for filter
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Add a new todo
  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodoItem = {
        id: Date.now(),
        text: newTodo,
        completed: false
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
    }
  };

  // Toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Handle input change
  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo();
  };

  // Handle key press in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Filter todos based on selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Count active todos
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="app-container">
      <header>
        <h1>React To-Do List</h1>
        <p className="subtitle">Manage your tasks with ease</p>
      </header>
      
      <div className="todo-container">
        {/* Add todo form */}
        <form onSubmit={handleSubmit} className="add-todo-form">
          <div className="input-container">
            <input
              type="text"
              value={newTodo}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              className="todo-input"
            />
            <button type="submit" className="add-button">
              <i className="fas fa-plus"></i> Add
            </button>
          </div>
        </form>

        {/* Filter buttons */}
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'active' ? 'filter-btn active' : 'filter-btn'} 
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {/* Todo list */}
        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <p className="empty-state">No tasks found. Add a new task or change the filter.</p>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div 
                  className="todo-checkbox"
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.completed && <i className="fas fa-check"></i>}
                </div>
                <span 
                  className="todo-text"
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.text}
                </span>
                <button 
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Todo stats and clear button */}
        <div className="todo-footer">
          <p>{activeTodosCount} item{activeTodosCount !== 1 ? 's' : ''} left</p>
          <button 
            className="clear-completed-btn"
            onClick={clearCompleted}
          >
            Clear Completed
          </button>
        </div>
      </div>

      <footer>
        <p>This demonstrates React's <span className="highlight">event handling</span> and <span className="highlight">list rendering</span> with .map()</p>
      </footer>
    </div>
  );
}

export default App;