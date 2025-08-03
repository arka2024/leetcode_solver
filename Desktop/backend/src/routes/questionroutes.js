import express from 'express';
import Question from '../models/questionmodels.js';

const router = express.Router();

// GET all questions
router.get('/', async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// OPTIONAL: GET by difficulty filter
router.get('/difficulty/:level', async (req, res) => {
  const level = req.params.level;
  const questions = await Question.find({ difficulty: level });
  res.json(questions);
});

export default router;
