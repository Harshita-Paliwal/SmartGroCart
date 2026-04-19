const router = require('express').Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const productController = require('../controllers/productController');

router.get('/', auth, asyncHandler(productController.listProducts));
router.post('/seed', auth, asyncHandler(productController.seedInitialProducts));
router.post('/seed/force', auth, asyncHandler(productController.forceSeedProducts));
router.post('/', auth, asyncHandler(productController.createProduct));
router.put('/:id', auth, asyncHandler(productController.updateProduct));

module.exports = router;
