import dotenv from 'dotenv';
dotenv.config(); // ✅ Load .env first

import express from 'express';
import connectDB from './db/index.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
