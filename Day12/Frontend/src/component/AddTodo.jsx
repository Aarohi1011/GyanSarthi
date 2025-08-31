import React, { useState } from 'react';
import { IoAdd } from "react-icons/io5";

const AddTodo = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  return (
    <form 
      className={`add-todo-form ${isFocused ? 'focused' : ''}`} 
      onSubmit={handleSubmit}
    >
      <div className="input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button 
          type="submit" 
          className="add-button"
          disabled={!text.trim()}
        >
          <IoAdd size={24} />
        </button>
      </div>
    </form>
  );
};

export default AddTodo;