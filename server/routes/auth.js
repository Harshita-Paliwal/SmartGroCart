const router = require('express').Router();
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post(
  '/register',
  [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('username').isLength({ min: 3 }).trim().withMessage('Username min 3 chars'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  asyncHandler(authController.register),
);

router.post(
  '/login',
  [body('username').notEmpty().trim(), body('password').notEmpty()],
  asyncHandler(authController.login),
);

router.get('/me', auth, asyncHandler(authController.getCurrentUser));
router.put('/profile', auth, asyncHandler(authController.updateProfile));

module.exports = router;
