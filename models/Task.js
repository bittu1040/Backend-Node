import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    required: false, // Optional field
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;
