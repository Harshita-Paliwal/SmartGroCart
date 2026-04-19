const router = require('express').Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const familyController = require('../controllers/familyController');

router.get('/', auth, asyncHandler(familyController.listFamilyMembers));
router.post('/', auth, asyncHandler(familyController.createFamilyMember));
router.put('/:memberId', auth, asyncHandler(familyController.updateFamilyMember));
router.delete('/:memberId', auth, asyncHandler(familyController.deleteFamilyMember));

module.exports = router;
