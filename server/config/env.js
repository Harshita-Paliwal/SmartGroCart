/**
 * Centralised runtime configuration so the rest of the backend does not
 * scatter environment lookups across route handlers and services.
 */
module.exports = {
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/smartgrocart',
  port: Number(process.env.PORT) || 5000,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
};
