require('dotenv').config();
const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');

/**
 * Boots the server only after the database connection succeeds.
 */
const startServer = async () => {
  try {
    await connectDatabase();
    console.log('MongoDB connected');
    app.listen(env.port, () => console.log(`Server -> http://localhost:${env.port}`));
  } catch (error) {
    console.error('DB Error:', error.message);
    process.exit(1);
  }
};

startServer();
