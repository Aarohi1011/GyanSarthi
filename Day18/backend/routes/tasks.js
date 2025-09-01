import express from 'express';
import Task from '../models/Task.js';
import Column from '../models/Column.js';
import Board from '../models/Board.js';

const router = express.Router();

// Get all tasks for a column
router.get('/column/:columnId', async (req, res) => {
  try {
    const tasks = await Task.find({ column: req.params.columnId })
      .populate('assignees', 'username email avatar')
      .populate('createdBy', 'username email avatar')
      .populate('comments.user', 'username email avatar');

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignees', 'username email avatar')
      .populate('createdBy', 'username email avatar')
      .populate('comments.user', 'username email avatar');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, columnId, assignees, dueDate, priority, labels } = req.body;

    const task = await Task.create({
      title,
      description,
      column: columnId,
      assignees: assignees || [],
      dueDate,
      priority: priority || 'medium',
      labels: labels || [],
      createdBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'username email avatar')
      .populate('createdBy', 'username email avatar');

    // Get board ID for socket emission
    const column = await Column.findById(columnId);
    
    // Emit socket event
    req.io.to(column.board.toString()).emit('task-created', populatedTask);

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, columnId, assignees, dueDate, priority, labels } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, column: columnId, assignees, dueDate, priority, labels },
      { new: true, runValidators: true }
    ).populate('assignees', 'username email avatar')
     .populate('createdBy', 'username email avatar')
     .populate('comments.user', 'username email avatar');

    // Get board ID for socket emission
    const column = await Column.findById(columnId || task.column);
    
    // Emit socket event
    req.io.to(column.board.toString()).emit('task-updated', updatedTask);

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

    await Task.findByIdAndDelete(req.params.id);

    // Get board ID for socket emission
    const column = await Column.findById(task.column);
    
    // Emit socket event
    req.io.to(column.board.toString()).emit('task-deleted', { id: req.params.id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to task
router.post('/:id/comments', async (req, res) => {
  try {
    const { text } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      user: req.user._id,
      text
    });

    await task.save();

    const populatedTask = await Task.findById(req.params.id)
      .populate('assignees', 'username email avatar')
      .populate('createdBy', 'username email avatar')
      .populate('comments.user', 'username email avatar');

    // Get board ID for socket emission
    const column = await Column.findById(task.column);
    
    // Emit socket event
    req.io.to(column.board.toString()).emit('task-updated', populatedTask);

    res.json(populatedTask);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment from task
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = task.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author or task creator
    if (comment.user.toString() !== req.user._id.toString() && 
        task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    comment.deleteOne();
    await task.save();

    const populatedTask = await Task.findById(req.params.id)
      .populate('assignees', 'username email avatar')
      .populate('createdBy', 'username email avatar')
      .populate('comments.user', 'username email avatar');

    // Get board ID for socket emission
    const column = await Column.findById(task.column);
    
    // Emit socket event
    req.io.to(column.board.toString()).emit('task-updated', populatedTask);

    res.json(populatedTask);
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;