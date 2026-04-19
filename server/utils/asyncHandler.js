/**
 * Wraps async Express handlers so thrown errors flow into the global
 * error middleware instead of needing repeated try/catch blocks.
 */
const asyncHandler = (handler) => async (request, response, next) => {
  try {
    await handler(request, response, next);
  } catch (error) {
    next(error);
  }
};

module.exports = asyncHandler;
