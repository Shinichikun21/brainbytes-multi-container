const { validationResult } = require('express-validator');
const UserService = require('../services/userService');
const User = require('../models/User'); // Still needed for getMe and updateUserProfile

// --- Core Auth ---
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, email, password } = req.body;
    const token = await UserService.registerUser(name, email, password);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { email, password } = req.body;
    const { token, user } = await UserService.loginUser(email, password);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// --- Profile Management ---
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.updateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, preferredSubjects } = req.body;
    const userFields = {};
    if (name) userFields.name = name;
    if (preferredSubjects !== undefined) userFields.preferredSubjects = preferredSubjects;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// --- Password Reset Flow ---
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const resetToken = await UserService.forgotPassword(req.body.email);
    // For security, always send a success message, even if the email wasn't found.
    console.log('--- PASSWORD RESET TOKEN (for testing):', resetToken, '---');
    res.json({ msg: 'If a user with that email exists, a reset token has been generated.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { token, user } = await UserService.resetPassword(req.params.token, req.body.password);
    // On success, automatically log the user in.
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};