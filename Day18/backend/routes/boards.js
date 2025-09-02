import express from 'express';
import { body, validationResult } from 'express-validator';
import Board from '../models/Board.js';
import Column from '../models/Column.js';
import Task from '../models/Task.js';

const router = express.Router();

// Get all boards for user
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    }).populate('owner', 'username email')
      .populate('members.user', 'username email');

    res.json(boards);
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single board
router.get('/:id', async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id },
        { isPublic: true }
      ]
    }).populate('owner', 'username email')
      .populate('members.user', 'username email');

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create board
router.post('/', [
  body('title')
    .notEmpty()
    .withMessage('Board title is required')
    .isLength({ max: 100 })
    .withMessage('Board title cannot exceed 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const board = await Board.create({
      ...req.body,
      owner: req.user.id
    });

    // Create default columns
    const defaultColumns = [
      { title: 'To Do', position: 0, boardId: board._id },
      { title: 'In Progress', position: 1, boardId: board._id },
      { title: 'Done', position: 2, boardId: board._id }
    ];

    await Column.insertMany(defaultColumns);

    const populatedBoard = await Board.findById(board._id)
      .populate('owner', 'username email')
      .populate('members.user', 'username email');

    res.status(201).json(populatedBoard);
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update board
router.put('/:id', async (req, res) => {
  try {
    const board = await Board.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { owner: req.user.id },
          { 'members.user': req.user.id, 'members.role': 'admin' }
        ]
      },
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'username email')
     .populate('members.user', 'username email');

    if (!board) {
      return res.status(404).json({ message: 'Board not found or access denied' });
    }

    res.json(board);
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete board
router.delete('/:id', async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found or access denied' });
    }

    // Delete all columns and tasks associated with the board
    await Column.deleteMany({ boardId: board._id });
    await Task.deleteMany({ boardId: board._id });

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add member to board
router.post('/:id/members', async (req, res) => {
  try {
    const { userId, role = 'member' } = req.body;

    const board = await Board.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id
      },
      {
        $addToSet: {
          members: { user: userId, role }
        }
      },
      { new: true, runValidators: true }
    ).populate('owner', 'username email')
     .populate('members.user', 'username email');

    if (!board) {
      return res.status(404).json({ message: 'Board not found or access denied' });
    }

    res.json(board);
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove member from board
router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const board = await Board.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id
      },
      {
        $pull: {
          members: { user: req.params.userId }
        }
      },
      { new: true }
    ).populate('owner', 'username email')
     .populate('members.user', 'username email');

    if (!board) {
      return res.status(404).json({ message: 'Board not found or access denied' });
    }

    res.json(board);
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;