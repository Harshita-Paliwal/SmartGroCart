/**
 * Keeps the stored family size in sync with the embedded family member list.
 */
const syncFamilySize = async (user) => {
  user.familySize = Math.max(1, (user.familyMembers?.length || 0) + 1);
  await user.save();
  return user;
};

module.exports = { syncFamilySize };
