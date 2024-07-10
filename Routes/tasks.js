const express = require('express');
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../Controllers/taskController');
const authMiddleware = require('../Middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getTasks);
router.get('/:id', authMiddleware, getTaskById);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;
