import express from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import Column from '../models/Column.js';
import Board from '../models/Board.js';

const router = express.Router();

// Get all tasks for a board
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

    const tasks = await Task.find({ boardId: req.params.boardId })
      .sort('position')
      .populate('assignees', 'username email')
      .populate('comments.user', 'username email');

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 })
    .withMessage('Task title cannot exceed 200 characters'),
  body('columnId')
    .notEmpty()
    .withMessage('Column ID is required'),
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
        { 'members.user': req.user.id }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found or access denied' });
    }

    // Verify column exists and belongs to the board
    const column = await Column.findOne({
      _id: req.body.columnId,
      boardId: req.body.boardId
    });

    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    // Get the highest position to place new task at the end
    const lastTask = await Task.findOne({ columnId: req.body.columnId })
      .sort('-position')
      .select('position');

    const position = lastTask ? lastTask.position + 1 : 0;

    const task = await Task.create({
      ...req.body,
      position
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'username email')
      .populate('comments.user', 'username email');

    // Emit socket event
    if (req.io) {
      req.io.to(req.body.boardId).emit('task-created', populatedTask);
    }

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the board
    const board = await Board.findOne({
      _id: task.boardId,
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Access denied' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignees', 'username email')
     .populate('comments.user', 'username email');

    // Emit socket event
    if (req.io) {
      req.io.to(task.boardId.toString()).emit('task-updated', updatedTask);
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the board
    const board = await Board.findOne({
      _id: task.boardId,
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Emit socket event
    if (req.io) {
      req.io.to(task.boardId.toString()).emit('task-deleted', task);
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Move task to different column or position
router.put('/:id/move', [
  body('columnId')
    .notEmpty()
    .withMessage('Column ID is required'),
  body('position')
    .isInt({ min: 0 })
    .withMessage('Position must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the board
    const board = await Board.findOne({
      _id: task.boardId,
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Access denied' });
    }

    // Verify new column exists and belongs to the same board
    const newColumn = await Column.findOne({
      _id: req.body.columnId,
      boardId: task.boardId
    });

    if (!newColumn) {
      return res.status(404).json({ message: 'Column not found' });
    }

    // Update task position and column
    task.columnId = req.body.columnId;
    task.position = req.body.position;
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'username email')
      .populate('comments.user', 'username email');

    // Emit socket event
    if (req.io) {
      req.io.to(task.boardId.toString()).emit('task-updated', populatedTask);
    }

    res.json(populatedTask);
  } catch (error) {
    console.error('Move task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to task
router.post('/:id/comments', [
  body('content')
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the board
    const board = await Board.findOne({
      _id: task.boardId,
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Access denied' });
    }

    task.comments.push({
      user: req.user.id,
      content: req.body.content
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'username email')
      .populate('comments.user', 'username email');

    // Emit socket event
    if (req.io) {
      req.io.to(task.boardId.toString()).emit('task-updated', populatedTask);
    }

    res.json(populatedTask);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;