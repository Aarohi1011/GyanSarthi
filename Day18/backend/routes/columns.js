import express from 'express';
import Column from '../models/Column.js';
import Task from '../models/Task.js';

const router = express.Router();

// Get all columns for a board
router.get('/board/:boardId', async (req, res) => {
  try {
    const columns = await Column.find({ board: req.params.boardId })
      .sort('order')
      .populate({
        path: 'tasks',
        populate: [
          { path: 'assignees', select: 'username email avatar' },
          { path: 'createdBy', select: 'username email avatar' }
        ]
      });

    res.json(columns);
  } catch (error) {
    console.error('Get columns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new column
router.post('/', async (req, res) => {
  try {
    const { title, boardId, order } = req.body;

    const column = await Column.create({
      title,
      board: boardId,
      order: order || 0
    });

    const populatedColumn = await Column.findById(column._id)
      .populate({
        path: 'tasks',
        populate: [
          { path: 'assignees', select: 'username email avatar' },
          { path: 'createdBy', select: 'username email avatar' }
        ]
      });

    // Emit socket event
    req.io.to(boardId).emit('column-created', populatedColumn);

    res.status(201).json(populatedColumn);
  } catch (error) {
    console.error('Create column error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update column
router.put('/:id', async (req, res) => {
  try {
    const { title, order } = req.body;

    const column = await Column.findById(req.params.id);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    const updatedColumn = await Column.findByIdAndUpdate(
      req.params.id,
      { title, order },
      { new: true, runValidators: true }
    ).populate({
      path: 'tasks',
      populate: [
        { path: 'assignees', select: 'username email avatar' },
        { path: 'createdBy', select: 'username email avatar' }
      ]
    });

    // Emit socket event
    req.io.to(column.board.toString()).emit('column-updated', updatedColumn);

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

    // Delete all tasks in this column
    await Task.deleteMany({ column: req.params.id });
    await Column.findByIdAndDelete(req.params.id);

    // Emit socket event
    req.io.to(column.board.toString()).emit('column-deleted', { id: req.params.id });

    res.json({ message: 'Column deleted successfully' });
  } catch (error) {
    console.error('Delete column error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;