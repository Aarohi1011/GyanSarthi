import { useState } from 'react';
import './App.css';

function App() {
  // Counter state
  const [count, setCount] = useState(0);
  
  // Text preview state
  const [text, setText] = useState('');
  
  // Function to increment counter
  const increment = () => {
    setCount(count + 1);
  };
  
  // Function to decrement counter
  const decrement = () => {
    setCount(count - 1);
  };
  
  // Function to reset counter
  const resetCounter = () => {
    setCount(0);
  };
  
  // Function to handle text input changes
  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  
  // Calculate character and word count
  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="app-container">
      <header>
        <h1>React State Management</h1>
        <p className="subtitle">Counter + Live Text Preview with useState</p>
      </header>
      
      <div className="content">
        <div className="counter-section">
          <h2 className="section-title">
            <i className="fas fa-plus-circle"></i>
            Counter Component
          </h2>
          <div className="counter">
            <div className={`counter-value ${count > 0 ? 'positive' : count < 0 ? 'negative' : ''}`}>
              {count}
            </div>
            <div className="counter-buttons">
              <button className="decrement" onClick={decrement}>
                <i className="fas fa-minus"></i> Decrement
              </button>
              <button className="reset" onClick={resetCounter}>
                <i className="fas fa-redo"></i> Reset
              </button>
              <button className="increment" onClick={increment}>
                <i className="fas fa-plus"></i> Increment
              </button>
            </div>
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div className="preview-section">
          <h2 className="section-title">
            <i className="fas fa-text-width"></i>
            Live Text Preview
          </h2>
          <div className="preview-box">
            <div className="input-container">
              <label htmlFor="textInput">Type something below:</label>
              <input 
                type="text" 
                id="textInput" 
                value={text}
                onChange={handleTextChange}
                placeholder="Start typing to see live preview..."
              />
            </div>
            
            <div className="preview">
              <p className="preview-text">
                {text || <span className="preview-placeholder">Your text will appear here...</span>}
              </p>
            </div>
            
            <div className="stats">
              <div className="stat-box">
                <div className="stat-value">{characterCount}</div>
                <div className="stat-label">Characters</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{wordCount}</div>
                <div className="stat-label">Words</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer>
        <p>This demonstrates React's <span className="highlight">useState</span> hook for state management</p>
      </footer>
    </div>
  );
}

export default App;