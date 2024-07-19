const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const Blacklist = require('../Models/blacklist');

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

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
      return res.status(400).json({ error: 'Invalid email or password' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }



    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};  


const logout = async (req, res) => {

  const token = req.header('Authorization').replace('Bearer ', '');

  if(!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  try {

    const blacklistedToken = new Blacklist({ token });
    await blacklistedToken.save();
  

  res.json({ message: 'Logout successful' });
  }
  catch (error) {
    res.status(400).json({ error: 'An error occured during logout' });
  }
};

module.exports = {
  signup,
  login,
  logout
};
