const router = require('express').Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const suggestionController = require('../controllers/suggestionController');

router.get('/', auth, asyncHandler(suggestionController.getSuggestions));
router.get('/expiry', auth, asyncHandler(suggestionController.getExpiryAlerts));
router.post('/ai', auth, asyncHandler(suggestionController.getAiSuggestions));

module.exports = router;
