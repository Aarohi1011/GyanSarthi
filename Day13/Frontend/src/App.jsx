import { useState, useEffect } from "react";
import axios from "axios";
import NoteList from "./components/NoteList";
import NoteForm from "./components/NoteForm";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  // Fetch notes from backend
  const fetchNotes = async () => {
    try {
      setError('');
      let url = '/api/notes';
      if (searchQuery) {
        url = `/api/notes?search=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await axios.get(url);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchQuery]);

  // Create new note
  const createNote = async (noteData) => {
    try {
      setError('');
      const response = await axios.post('/api/notes', noteData);
      setNotes([response.data, ...notes]);
      return true;
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Failed to create note. Please try again.');
      return false;
    }
  };

  // Update note
  const updateNote = async (id, noteData) => {
    try {
      setError('');
      const response = await axios.put(`/api/notes/${id}`, noteData);
      setNotes(notes.map(note => 
        note._id === id ? response.data : note
      ));
      setEditingNote(null);
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      setError('Failed to update note. Please try again.');
      return false;
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      setError('');
      await axios.delete(`/api/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note. Please try again.');
    }
  };

  // Start editing a note
  const startEditing = (note) => {
    setEditingNote(note);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingNote(null);
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your notes...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="notes-app">
        <header className="app-header">
          <h1>📝 Notes App</h1>
          <p>Your personal digital notebook</p>
        </header>
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
            <button onClick={fetchNotes} className="retry-btn">
              Retry
            </button>
          </div>
        )}
        
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <NoteForm 
          onSubmit={editingNote ? updateNote.bind(null, editingNote._id) : createNote}
          editingNote={editingNote}
          onCancel={cancelEditing}
        />
        
        <div className="notes-count">
          {notes.length > 0 ? (
            <span>
              {notes.length} note{notes.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </span>
          ) : (
            <span>
              {searchQuery ? `No notes found for "${searchQuery}"` : 'No notes yet. Create one above!'}
            </span>
          )}
        </div>
        
        <NoteList 
          notes={notes} 
          onDelete={deleteNote}
          onEdit={startEditing}
        />
      </div>
    </div>
  );
}

export default App;