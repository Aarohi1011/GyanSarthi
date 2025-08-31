import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, deleteTodo, toggleTodo }) => {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No tasks yet</h3>
        <p>Add a task above to get started!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          deleteTodo={deleteTodo} 
          toggleTodo={toggleTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;