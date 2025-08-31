import React, { useState } from 'react';
import { IoCheckmark, IoTrash, IoTime } from "react-icons/io5";

const TodoItem = ({ todo, deleteTodo, toggleTodo }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => deleteTodo(todo.id), 300);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isDeleting ? 'deleting' : ''}`}>
      <div className="todo-content">
        <button 
          className={`checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => toggleTodo(todo.id)}
        >
          {todo.completed && <IoCheckmark size={16} />}
        </button>
        
        <div className="todo-text">
          <span className="text">{todo.text}</span>
          <div className="todo-meta">
            <IoTime size={12} />
            <span className="date">{formatDate(todo.createdAt)}</span>
          </div>
        </div>
      </div>
      
      <button 
        className="delete-btn"
        onClick={handleDelete}
        aria-label="Delete todo"
      >
        <IoTrash size={16} />
      </button>
    </div>
  );
};

export default TodoItem;