const express = require('express');
const cors = require('cors');
const env = require('./config/env');

const app = express();

/**
 * Applies cross-cutting middleware shared across every API route.
 */
app.use(
  cors({
    credentials: true,
    origin: env.clientUrl,
  }),
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

/**
 * Registers the application's route groups.
 */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/suggestions', require('./routes/suggestions'));
app.use('/api/family', require('./routes/family'));

/**
 * Exposes a basic liveness endpoint for local development checks.
 */
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', time: new Date() });
});

/**
 * Normalises thrown errors into a consistent JSON response format.
 */
app.use((error, _request, response, _next) => {
  console.error(error.stack);
  response.status(error.status || 500).json({ message: error.message || 'Server Error' });
});

module.exports = app;
