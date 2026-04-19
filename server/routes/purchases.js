const router = require('express').Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const purchaseController = require('../controllers/purchaseController');

router.post('/checkout', auth, asyncHandler(purchaseController.checkout));
router.get('/', auth, asyncHandler(purchaseController.listPurchases));
router.get('/stats', auth, asyncHandler(purchaseController.getPurchaseStats));

module.exports = router;
