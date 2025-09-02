import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingNote) {
        await axios.put(`http://localhost:5000/api/notes/${editingNote._id}`, {
          title,
          content
        });
        setEditingNote(null);
      } else {
        await axios.post("http://localhost:5000/api/notes", {
          title,
          content
        });
      }
      
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          {editingNote ? "Edit Note" : "Add New Note"}
        </h2>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field w-full"
            required
          />
        </div>
        
        <div className="mb-4">
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-field w-full h-32"
            required
          />
        </div>
        
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            {editingNote ? "Update Note" : "Add Note"}
          </button>
          
          {editingNote && (
            <button type="button" onClick={cancelEdit} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
        
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet. Create your first note above!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div key={note._id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                <p className="text-gray-700 mb-4">{note.content}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;