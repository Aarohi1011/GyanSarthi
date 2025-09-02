import express from "express";
import Note from "../models/Note.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all notes for a user
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new note
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const newNote = new Note({
      title,
      content,
      user: req.user.id
    });

    const savedNote = await newNote.save();
    res.json(savedNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a note
router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a note
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;