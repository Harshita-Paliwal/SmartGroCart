const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const env = require('../config/env');

/**
 * Signs a short-lived session token for the authenticated user.
 */
const signToken = (userId) => jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: '7d' });

/**
 * Normalises the optional age field so profile updates stay predictable.
 */
const parseAge = (value, fallbackValue) => {
  if (value === undefined || value === '') {
    return fallbackValue;
  }

  const parsedAge = Number.parseInt(value, 10);
  return Number.isFinite(parsedAge) ? parsedAge : fallbackValue;
};

/**
 * Sends the first validation error back to the client when request fields fail.
 */
const ensureValidRequest = (request, response) => {
  const validation = validationResult(request);

  if (validation.isEmpty()) {
    return true;
  }

  response.status(400).json({ message: validation.array()[0].msg });
  return false;
};

/**
 * Creates a new account and immediately returns the logged-in user payload.
 */
const register = async (request, response) => {
  if (!ensureValidRequest(request, response)) {
    return;
  }

  const {
    age,
    avatar,
    familyMembers,
    familySize,
    monthlyBudget,
    name,
    password,
    preferences,
    username,
  } = request.body;

  const normalisedUsername = username.toLowerCase();
  const existingUser = await User.findOne({ username: normalisedUsername });

  if (existingUser) {
    return response.status(400).json({ message: 'Username already taken' });
  }

  const user = await User.create({
    age: parseAge(age, 30),
    avatar: avatar || '',
    familyMembers: familyMembers || [],
    familySize: familySize || 1,
    monthlyBudget: monthlyBudget || 5000,
    name,
    password,
    preferences: preferences || {},
    username: normalisedUsername,
  });

  return response.status(201).json({ token: signToken(user._id), user });
};

/**
 * Authenticates an existing account using username and password only.
 */
const login = async (request, response) => {
  if (!ensureValidRequest(request, response)) {
    return;
  }

  const { password, username } = request.body;
  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user || !(await user.comparePassword(password))) {
    return response.status(401).json({ message: 'Invalid username or password' });
  }

  return response.json({ token: signToken(user._id), user });
};

/**
 * Returns the authenticated user's latest profile document.
 */
const getCurrentUser = async (request, response) => {
  const user = await User.findById(request.userId);

  if (!user) {
    return response.status(404).json({ message: 'User not found' });
  }

  return response.json({ user });
};

/**
 * Applies profile edits while requiring current password for password changes.
 */
const updateProfile = async (request, response) => {
  const user = await User.findById(request.userId);

  if (!user) {
    return response.status(404).json({ message: 'User not found' });
  }

  const {
    age,
    avatar,
    currentPassword,
    familySize,
    monthlyBudget,
    name,
    password,
    preferences,
  } = request.body;

  if (password && password.length >= 6) {
    if (!currentPassword) {
      return response
        .status(400)
        .json({ message: 'Current password is required to change password' });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return response.status(401).json({ message: 'Current password is incorrect' });
    }

    if (currentPassword === password) {
      return response
        .status(400)
        .json({ message: 'New password must be different from current password' });
    }

    user.password = password;
  }

  user.name = name;
  user.avatar = avatar ?? user.avatar;
  user.familySize = familySize;
  user.monthlyBudget = monthlyBudget;
  user.preferences = preferences;

  const parsedAge = parseAge(age, user.age);

  if (typeof parsedAge === 'number' && !Number.isNaN(parsedAge)) {
    user.age = parsedAge;
  }

  await user.save();
  return response.json({ user });
};

module.exports = {
  getCurrentUser,
  login,
  register,
  updateProfile,
};
