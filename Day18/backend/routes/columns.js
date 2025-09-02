import express from 'express';
import { body, validationResult } from 'express-validator';
import Column from '../models/Column.js';
import Task from '../models/Task.js';
import Board from '../models/Board.js';

const router = express.Router();

// Get all columns for a board
router.get('/board/:boardId', async (req, res) => {
  try {
    // Check if user has access to the board
    const board = await Board.findOne({
      _id: req.params.boardId,
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id },
        { isPublic: true }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found or access denied' });
    }

    const columns = await Column.find({ boardId: req.params.boardId })
      .sort('position')
      .populate({
        path: 'tasks',
        options: { sort: { position: 1 } },
        populate: [
          { path: 'assignees', select: 'username email' },
          { path: 'comments.user', select: 'username email' }
        ]
      });

    res.json(columns);
  } catch (error) {
    console.error('Get columns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create column
router.post('/', [
  body('title')
    .notEmpty()
    .withMessage('Column title is required')
    .isLength({ max: 50 })
    .withMessage('Column title cannot exceed 50 characters'),
  body('boardId')
    .notEmpty()
    .withMessage('Board ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    // Check if user has access to the board
    const board = await Board.findOne({
      _id: req.body.boardId,
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id, 'members.role': 'admin' }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found or access denied' });
    }

    // Get the highest position to place new column at the end
    const lastColumn = await Column.findOne({ boardId: req.body.boardId })
      .sort('-position')
      .select('position');

    const position = lastColumn ? lastColumn.position + 1 : 0;

    const column = await Column.create({
      ...req.body,
      position
    });

    const populatedColumn = await Column.findById(column._id)
      .populate({
        path: 'tasks',
        options: { sort: { position: 1 } },
        populate: [
          { path: 'assignees', select: 'username email' },
          { path: 'comments.user', select: 'username email' }
        ]
      });

    // Emit socket event
    if (req.io) {
      req.io.to(req.body.boardId).emit('column-created', populatedColumn);
    }

    res.status(201).json(populatedColumn);
  } catch (error) {
    console.error('Create column error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update column
router.put('/:id', async (req, res) => {
  try {
    const column = await Column.findById(req.params.id);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    // Check if user has access to the board
    const board = await Board.findOne({
      _id: column.boardId,
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id, 'members.role': 'admin' }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Access denied' });
    }

    const updatedColumn = await Column.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: 'tasks',
      options: { sort: { position: 1 } },
      populate: [
        { path: 'assignees', select: 'username email' },
        { path: 'comments.user', select: 'username email' }
      ]
    });

    // Emit socket event
    if (req.io) {
      req.io.to(column.boardId.toString()).emit('column-updated', updatedColumn);
    }

    res.json(updatedColumn);
  } catch (error) {
    console.error('Update column error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete column
router.delete('/:id', async (req, res) => {
  try {
    const column = await Column.findById(req.params.id);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    // Check if user has access to the board
    const board = await Board.findOne({
      _id: column.boardId,
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id, 'members.role': 'admin' }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Access denied' });
    }

    // Delete all tasks in this column
    await Task.deleteMany({ columnId: column._id });

    await Column.findByIdAndDelete(req.params.id);

    // Emit socket event
    if (req.io) {
      req.io.to(column.boardId.toString()).emit('column-deleted', {
        _id: column._id,
        boardId: column.boardId
      });
    }

    res.json({ message: 'Column deleted successfully' });
  } catch (error) {
    console.error('Delete column error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;