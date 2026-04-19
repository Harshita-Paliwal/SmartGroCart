const router = require('express').Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const cartController = require('../controllers/cartController');

router.get('/', auth, asyncHandler(cartController.getCart));
router.post('/add', auth, asyncHandler(cartController.addCartItem));
router.put('/item/:itemId', auth, asyncHandler(cartController.updateCartItemQuantity));
router.delete('/item/:itemId', auth, asyncHandler(cartController.removeCartItem));
router.delete('/clear', auth, asyncHandler(cartController.clearCart));

module.exports = router;
