import React from 'react';
import NoteItem from './NoteItem';

const NoteList = ({ notes, onDelete, onEdit }) => {
  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No notes found</h3>
        <p>Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map(note => (
        <NoteItem 
          key={note._id} 
          note={note} 
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default NoteList;