const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Import routers
const authRouter = require('./Routes/AuthRouter');
const habitRouter = require('./Routes/habitRouter');
const aiRouter = require('./Routes/aiRouter');

// Import DB
const db = require('./Models/Database');

// ----- MIDDLEWARE -----
app.use(cors({ origin: 'http://localhost:5173' })); // allow React frontend
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