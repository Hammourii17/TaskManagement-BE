module.exports = {
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/taskmanagement',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  port: process.env.PORT || 5001
};
