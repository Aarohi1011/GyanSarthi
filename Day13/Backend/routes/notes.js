import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

// GET all notes (with optional search query)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let notes;
    
    if (search) {
      // Use MongoDB text search if search query is provided
      notes = await Note.find(
        { $text: { $search: search } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
    } else {
      // Get all notes sorted by creation date (newest first)
      notes = await Note.find().sort({ createdAt: -1 });
    }
    
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note ID' });
    }
    
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// POST create new note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const note = new Note({
      title: title.trim(),
      content: content.trim()
    });
    
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT update note
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        content: content.trim()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note ID' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    
    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid note ID' });
    }
    
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// GET search notes (alternative endpoint)
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const notes = await Note.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
    
    res.json(notes);
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

export default router;