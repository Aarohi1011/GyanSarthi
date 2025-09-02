import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Column title is required'],
    trim: true,
    maxlength: [50, 'Column title cannot exceed 50 characters']
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  position: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Ensure each board has unique column positions
columnSchema.index({ boardId: 1, position: 1 }, { unique: true });

export default mongoose.model('Column', columnSchema);