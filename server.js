const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${config.port} is already in use`);
  } else {
    console.error(`Server error: ${err}`);
  }
});
