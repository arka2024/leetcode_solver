import express from 'express';
import dotenv from 'dotenv';
import questionRoutes from './routes/questionroutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/questions', questionRoutes);

export default app;
