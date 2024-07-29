const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');
const Blacklist = require('../models/blacklist');
const argon2 = require('argon2');


const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await argon2.hash(password);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'Invalid email or password' });
    }

const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      console.log('Password does not match', password, user.password);
      return res.status(400).json({ error: 'Invalid email or password' });
    }
console.log(isMatch)
    console.log('Password matches');
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  try {
    const blacklistedToken = new Blacklist({ token });
    await blacklistedToken.save();

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(400).json({ error: 'An error occurred during logout' });
  }
};

module.exports = {
  signup,
  login,
  logout,
};
