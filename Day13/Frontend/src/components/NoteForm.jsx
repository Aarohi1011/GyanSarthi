import React, { useState, useEffect } from 'react';

const NoteForm = ({ onSubmit, editingNote, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const success = await onSubmit({ title, content });
    if (success && !editingNote) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          className="form-input form-textarea"
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        {editingNote && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {editingNote ? 'Update Note' : 'Create Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;