const mongoose = require('mongoose');
const env = require('./env');

/**
 * Connects the application to MongoDB using the configured connection string.
 */
const connectDatabase = async () => {
  await mongoose.connect(env.mongoUri);
};

module.exports = { connectDatabase };
