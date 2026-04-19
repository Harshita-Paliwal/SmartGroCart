const defaultClientUrls = ['http://localhost:3000', 'https://smartgrocart.vercel.app'];

/**
 * Parses a comma-separated frontend allowlist so production and local
 * environments can share the same backend safely.
 */
const parseClientUrls = (value) => {
  if (!value) {
    return defaultClientUrls;
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

/**
 * Centralised runtime configuration so the rest of the backend does not
 * scatter environment lookups across route handlers and services.
 */
module.exports = {
  clientUrl: process.env.CLIENT_URL || defaultClientUrls[0],
  clientUrls: parseClientUrls(process.env.CLIENT_URL),
  jwtSecret: process.env.JWT_SECRET || 'secret',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/smartgrocart',
  port: Number(process.env.PORT) || 5000,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
};
