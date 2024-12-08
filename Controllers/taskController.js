const Task = require('../models/task');

const createTask = async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  const userId = req.user ? req.user._id : null;

  try {
    const task = new Task({ userId, title, description, dueDate, priority });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTasks = async (req, res) => {
  const userId = req.user._id;
  const { dueDate, priority, completed, sortBy, sortOrder } = req.query;

  let filter = { userId };
  if (dueDate) filter.dueDate = dueDate;
  if (priority) filter.priority = priority;
  if (completed) filter.completed = completed;

  let sort = {};
  if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  try {
    const tasks = await Task.find(filter).sort(sort);
    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error getting task by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
