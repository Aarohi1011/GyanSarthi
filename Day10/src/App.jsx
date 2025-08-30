import { useReducer, useState, useEffect } from 'react';
import './App.css';
import { studentReducer, studentActions, initialState } from './reducers/studentReducer';
import useApi from './hooks/useApi';

function App() {
  const [state, dispatch] = useReducer(studentReducer, initialState);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', age: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);

  const { loading: apiLoading, error: apiError, request } = useApi();
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
      dispatch({ type: studentActions.SET_LOADING, payload: true });
      const students = await request(`${API_BASE}/students`);
      dispatch({ type: studentActions.SET_STUDENTS, payload: students });
      setServerOnline(true);
    } catch (err) {
      dispatch({ type: studentActions.SET_ERROR, payload: err.message });
      setServerOnline(false);
    }
  };

  // Add a new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    try {
      dispatch({ type: studentActions.SET_LOADING, payload: true });
      
      const studentToAdd = {
        ...newStudent,
        id: Math.max(...state.students.map(s => s.id), 0) + 1,
        age: parseInt(newStudent.age)
      };
      
      const result = await request(`${API_BASE}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentToAdd),
      });
      
      dispatch({ type: studentActions.ADD_STUDENT, payload: studentToAdd });
      
      setNewStudent({ name: '', age: '' });
      setShowAddForm(false);
    } catch (err) {
      dispatch({ type: studentActions.SET_ERROR, payload: err.message });
    }
  };

  // Update a student
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    
    try {
      dispatch({ type: studentActions.SET_LOADING, payload: true });
      
      const studentToUpdate = {
        ...editingStudent,
        age: parseInt(editingStudent.age)
      };
      
      // In a real app, we would have a PUT endpoint
      // For now, we'll simulate by making a POST request
      await request(`${API_BASE}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentToUpdate),
      });
      
      dispatch({ type: studentActions.UPDATE_STUDENT, payload: studentToUpdate });
      
      setEditingStudent(null);
    } catch (err) {
      dispatch({ type: studentActions.SET_ERROR, payload: err.message });
    }
  };

  // Delete a student
  const handleDeleteStudent = async (id) => {
    try {
      dispatch({ type: studentActions.SET_LOADING, payload: true });
      
      // In a real app, we would have a DELETE endpoint
      // For now, we'll simulate by making a POST request
      await request(`${API_BASE}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete', id }),
      });
      
      dispatch({ type: studentActions.DELETE_STUDENT, payload: id });
    } catch (err) {
      dispatch({ type: studentActions.SET_ERROR, payload: err.message });
    }
  };

  // Handle input changes for forms
  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    
    if (isEditing) {
      setEditingStudent({
        ...editingStudent,
        [name]: value
      });
    } else {
      setNewStudent({
        ...newStudent,
        [name]: value
      });
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students based on search term
  const filteredStudents = state.students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header>
        <h1>Student Directory</h1>
        <p className="subtitle">Now with Custom Hooks & useReducer</p>
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
          <form onSubmit={handleAddStudent} className="add-form">
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
              <button type="submit" className="submit-btn" disabled={state.loading}>
                {state.loading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </form>
        )}

        {/* Edit student form */}
        {editingStudent && (
          <form onSubmit={handleUpdateStudent} className="add-form">
            <h3>Edit Student</h3>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={editingStudent.name}
                onChange={(e) => handleInputChange(e, true)}
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={editingStudent.age}
                onChange={(e) => handleInputChange(e, true)}
                min="1"
                required
              />
              <div>
                <button type="submit" className="submit-btn" disabled={state.loading}>
                  {state.loading ? 'Updating...' : 'Update Student'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setEditingStudent(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Error message */}
        {state.error && (
          <div className="error-container">
            <i className="fas fa-exclamation-circle error-icon"></i>
            <p>Error: {state.error}</p>
            <button 
              className="retry-btn"
              onClick={fetchStudents}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading state */}
        {state.loading && !state.students.length && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading students...</p>
          </div>
        )}

        {/* Students list */}
        {!state.loading && !state.error && (
          <>
            <div className="students-stats">
              <p>Showing {filteredStudents.length} of {state.students.length} students</p>
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
                      <th>Actions</th>
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
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => setEditingStudent({...student})}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
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
        <p>This demonstrates React's <span className="highlight">Custom Hooks</span> and <span className="highlight">useReducer</span> for state management</p>
      </footer>
    </div>
  );
}

export default App;