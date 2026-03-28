const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8080;
const authRouter = require('./Routes/AuthRouter');
const habitRouter = require('./Routes/habitRouter');
const aiRouter = require('./Routes/aiRouter');
const db = require('./Models/Database');

// - MIDDLEWARE (add extra origins via Render env CORS_ORIGINS=comma,separated,urls)
const defaultCorsOrigins = [
  'http://localhost:5173',
  'https://routine-craft-habite-tracker-git-main-tiwari011s-projects.vercel.app',
];
const extraCors = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
  : [];
app.use(cors({ origin: [...defaultCorsOrigins, ...extraCors] })); 
app.use(express.json()); // parse JSON bodies

// ----- ROUTES -----
app.get('/auth', (req, res) => {
  res.send('Auth route is working');
});

app.use('/auth', authRouter);
app.use('/api/habits', habitRouter);
app.use('/api/ai', aiRouter);

// ----- START SERVER -----
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});