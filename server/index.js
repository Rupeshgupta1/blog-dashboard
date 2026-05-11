const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const analyticsRoutes = require('./routes/analytics');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.get('/', (req, res) => {
  res.send('✅ Blog Dashboard API is running — see /api/ for endpoints');
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://blog-dashboard-wheat.vercel.app'
  ],
  credentials: true
})); app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI).then(() => {
    console.log('âœ… MongoDB connected');
    app.listen(PORT, () => console.log(`ðŸš€ Server running on port ${PORT}`));
  })
  .catch((err) => console.error('âŒ DB connection failed:', err));
