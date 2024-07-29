const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user'); 
const Blacklist = require('../models/blacklist');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
console.log('token: ',token)
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }


  try {
    const blacklistedToken = await Blacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ error: 'Token has been blacklisted.' });
    }
    const decoded = jwt.verify(token, config.jwtSecret);

    console.log('decoded token: ',decoded);
const user = await User.findById(decoded.userId);

console.log('user: ',user);
    if (!user) {
      console.log('User not found for Id:', decoded.userId);
      return res.status(404).json({ error: 'User not found' });

    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
  console.log('Error authenticating user:', error);
    res.status(401).json({ error: 'Access denied. Invalid token.' });
  }
};

module.exports = authMiddleware;
