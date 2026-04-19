const User = require('../models/User');
const { syncFamilySize } = require('../services/familyService');

/**
 * Returns the saved family members and self-heals an outdated family size.
 */
const listFamilyMembers = async (request, response) => {
  const user = await User.findById(request.userId);

  if (!user) {
    return response.status(404).json({ message: 'User not found' });
  }

  const expectedFamilySize = Math.max(1, (user.familyMembers?.length || 0) + 1);

  if (user.familySize !== expectedFamilySize) {
    user.familySize = expectedFamilySize;
    await user.save();
  }

  return response.json({ familyMembers: user.familyMembers });
};

/**
 * Adds a new embedded family member record to the authenticated user.
 */
const createFamilyMember = async (request, response) => {
  const user = await User.findById(request.userId);
  user.familyMembers.push(request.body);
  await syncFamilySize(user);

  return response.status(201).json({ familyMembers: user.familyMembers });
};

/**
 * Updates an existing family member in the embedded document array.
 */
const updateFamilyMember = async (request, response) => {
  const user = await User.findById(request.userId);
  const familyMember = user.familyMembers.id(request.params.memberId);

  if (!familyMember) {
    return response.status(404).json({ message: 'Member not found' });
  }

  Object.assign(familyMember, request.body);
  await syncFamilySize(user);

  return response.json({ familyMembers: user.familyMembers });
};

/**
 * Removes a family member from the authenticated user's profile.
 */
const deleteFamilyMember = async (request, response) => {
  const user = await User.findById(request.userId);
  user.familyMembers.pull(request.params.memberId);
  await syncFamilySize(user);

  return response.json({ familyMembers: user.familyMembers });
};

module.exports = {
  createFamilyMember,
  deleteFamilyMember,
  listFamilyMembers,
  updateFamilyMember,
};
