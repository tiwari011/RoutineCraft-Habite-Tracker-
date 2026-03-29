const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

const authRouter = require('./Routes/AuthRouter');
const habitRouter = require('./Routes/habitRouter');
const aiRouter = require('./Routes/aiRouter');
require('./Models/Database');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://routine-craft-habite-tracker.vercel.app',
  'https://routine-craft-habite-tracker-git-main-tiwari011s-projects.vercel.app',
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/api/habits', habitRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});