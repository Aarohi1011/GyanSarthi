import React, { useState } from 'react';

const NoteItem = ({ note, onDelete, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(note._id), 300);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`note-item ${isDeleting ? 'deleting' : ''}`}>
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <span className="note-date">{formatDate(note.createdAt)}</span>
      </div>
      <div className="note-content">
        {note.content}
      </div>
      <div className="note-actions">
        <button 
          className="note-btn note-btn-edit"
          onClick={() => onEdit(note)}
        >
          Edit
        </button>
        <button 
          className="note-btn note-btn-delete"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteItem;