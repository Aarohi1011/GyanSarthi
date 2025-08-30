// App.jsx
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State for the list of students
  const [students, setStudents] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  // State for new student form
  const [newStudent, setNewStudent] = useState({ name: '', age: '' });
  // State for showing add form
  const [showAddForm, setShowAddForm] = useState(false);
  // State for server status
  const [serverOnline, setServerOnline] = useState(false);

  // API base URL
  const API_BASE = 'http://localhost:3000';

  // Check if server is online
  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/students`);
      setServerOnline(response.ok);
    } catch (err) {
      setServerOnline(false);
    }
  };

  // Fetch students from backend API
  useEffect(() => {
    checkServerStatus();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/students`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      
      const data = await response.json();
      setStudents(data);
      setLoading(false);
      setServerOnline(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setServerOnline(false);
    }
  };

  // Add a new student
  const addStudent = async (e) => {
    e.preventDefault();
    
    try {
      // Generate a unique ID (in a real app, this would be done by the backend)
      const studentToAdd = {
        ...newStudent,
        id: Math.max(...students.map(s => s.id), 0) + 1,
        age: parseInt(newStudent.age)
      };
      
      const response = await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentToAdd),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add student');
      }
      
      const result = await response.json();
      setStudents(result.students);
      setNewStudent({ name: '', age: '' });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle input changes for new student form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header>
        <h1>Student Directory</h1>
        <p className="subtitle">Connected to Express Backend</p>
        <div className="server-status">
          <span className={`status-indicator ${serverOnline ? 'status-online' : 'status-offline'}`}></span>
          <span>Server: {serverOnline ? 'Online' : 'Offline'}</span>
        </div>
      </header>
      
      <div className="directory-container">
        {/* Controls section */}
        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search students by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          
          <button 
            className="add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={!serverOnline}
          >
            <i className="fas fa-plus"></i>
            Add New Student
          </button>
        </div>

        {/* Add student form */}
        {showAddForm && (
          <form onSubmit={addStudent} className="add-form">
            <h3>Add New Student</h3>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={newStudent.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={newStudent.age}
                onChange={handleInputChange}
                min="1"
                required
              />
              <button type="submit" className="submit-btn">
                Add Student
              </button>
            </div>
          </form>
        )}

        {/* Error message */}
        {error && (
          <div className="error-container">
            <i className="fas fa-exclamation-circle error-icon"></i>
            <p>Error: {error}</p>
            <button 
              className="retry-btn"
              onClick={fetchStudents}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading students...</p>
          </div>
        )}

        {/* Students list */}
        {!loading && !error && (
          <>
            <div className="students-stats">
              <p>Showing {filteredStudents.length} of {students.length} students</p>
            </div>
            
            <div className="students-list">
              {filteredStudents.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-user-graduate empty-icon"></i>
                  <p>No students found matching your search.</p>
                </div>
              ) : (
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.age}</td>
                        <td>
                          <span className="status-badge">
                            {student.age >= 18 ? 'Adult' : 'Minor'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

      <footer>
        <p>This demonstrates React's <span className="highlight">useEffect</span> and integration with a <span className="highlight">Node.js/Express backend</span></p>
      </footer>
    </div>
  );
}

export default App;