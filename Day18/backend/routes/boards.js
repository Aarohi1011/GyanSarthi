import express from 'express';
import Board from '../models/Board.js';
import Column from '../models/Column.js';
import Task from '../models/Task.js';

const router = express.Router();

// Get all boards for user
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [
        { createdBy: req.user._id },
        { 'members.user': req.user._id }
      ]
    }).populate('createdBy', 'username email avatar')
      .populate('members.user', 'username email avatar');

    res.json(boards);
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single board
router.get('/:id', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('createdBy', 'username email avatar')
      .populate('members.user', 'username email avatar');

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user has access to board
    const hasAccess = board.createdBy._id.toString() === req.user._id.toString() || 
                      board.members.some(member => member.user._id.toString() === req.user._id.toString());
    
    if (!hasAccess && !board.isPublic) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(board);
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new board
router.post('/', async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;

    const board = await Board.create({
      title,
      description,
      isPublic: isPublic || false,
      createdBy: req.user._id,
      members: [{
        user: req.user._id,
        role: 'admin'
      }]
    });

    // Create default columns
    const defaultColumns = ['To Do', 'In Progress', 'Review', 'Done'];
    for (let i = 0; i < defaultColumns.length; i++) {
      await Column.create({
        title: defaultColumns[i],
        board: board._id,
        order: i
      });
    }

    const populatedBoard = await Board.findById(board._id)
      .populate('createdBy', 'username email avatar')
      .populate('members.user', 'username email avatar');

    res.status(201).json(populatedBoard);
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update board
router.put('/:id', async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;

    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user is admin of board
    const isAdmin = board.createdBy.toString() === req.user._id.toString() || 
                    board.members.some(member => 
                      member.user.toString() === req.user._id.toString() && 
                      member.role === 'admin'
                    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      { title, description, isPublic },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email avatar')
     .populate('members.user', 'username email avatar');

    // Emit socket event
    req.io.to(req.params.id).emit('board-updated', updatedBoard);

    res.json(updatedBoard);
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete board
router.delete('/:id', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user is creator of board
    if (board.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Only board creator can delete.' });
    }

    // Delete all columns and tasks associated with board
    const columns = await Column.find({ board: req.params.id });
    const columnIds = columns.map(column => column._id);
    
    await Task.deleteMany({ column: { $in: columnIds } });
    await Column.deleteMany({ board: req.params.id });
    await Board.findByIdAndDelete(req.params.id);

    // Emit socket event
    req.io.to(req.params.id).emit('board-deleted', { id: req.params.id });

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add member to board
router.post('/:id/members', async (req, res) => {
  try {
    const { userId, role } = req.body;

    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user is admin of board
    const isAdmin = board.createdBy.toString() === req.user._id.toString() || 
                    board.members.some(member => 
                      member.user.toString() === req.user._id.toString() && 
                      member.role === 'admin'
                    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }

    // Check if user is already a member
    const isAlreadyMember = board.members.some(member => 
      member.user.toString() === userId
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: 'User is already a member of this board' });
    }

    board.members.push({ user: userId, role: role || 'editor' });
    await board.save();

    const populatedBoard = await Board.findById(req.params.id)
      .populate('createdBy', 'username email avatar')
      .populate('members.user', 'username email avatar');

    // Emit socket event
    req.io.to(req.params.id).emit('board-updated', populatedBoard);

    res.json(populatedBoard);
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove member from board
router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user is admin of board
    const isAdmin = board.createdBy.toString() === req.user._id.toString() || 
                    board.members.some(member => 
                      member.user.toString() === req.user._id.toString() && 
                      member.role === 'admin'
                    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }

    // Cannot remove the board creator
    if (req.params.userId === board.createdBy.toString()) {
      return res.status(400).json({ message: 'Cannot remove board creator' });
    }

    board.members = board.members.filter(member => 
      member.user.toString() !== req.params.userId
    );

    await board.save();

    const populatedBoard = await Board.findById(req.params.id)
      .populate('createdBy', 'username email avatar')
      .populate('members.user', 'username email avatar');

    // Emit socket event
    req.io.to(req.params.id).emit('board-updated', populatedBoard);

    res.json(populatedBoard);
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;