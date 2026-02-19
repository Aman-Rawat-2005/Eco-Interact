import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    enum: ['Energy Flow', 'Food Chain', 'Succession', 'Biodiversity', 'Climate Change']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  question: {
    type: String,
    required: true
  },
  options: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true }
  },
  correctAnswer: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

questionSchema.index({ topic: 1, difficulty: 1 });

const Question = mongoose.model('Question', questionSchema);
export default Question;