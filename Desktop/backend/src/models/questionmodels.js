import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String },
  description: { type: String },
  examples: [{ input: String, output: String }],
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
