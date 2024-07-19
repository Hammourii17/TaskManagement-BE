const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./Routes/auth');
const taskRoutes = require('./Routes/tasks');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

mongoose.connect(config.dbUri).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// app.listen(config.port, () => {
//   console.log(`Server running on port ${config.port}`);
// });

module.exports = app;
