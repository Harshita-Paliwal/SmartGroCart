const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Resolves the logged-in user id from the bearer token on protected routes.
 */
module.exports = (request, response, next) => {
  const token = request.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return response.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    request.userId = decoded.id;
    next();
  } catch {
    response.status(401).json({ message: 'Token is not valid' });
  }
};
