const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');

const authRoutes = require('./Routes/auth');
const taskRoutes = require('./Routes/tasks');

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

mongoose.connect(config.dbUri).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

module.exports = app;
