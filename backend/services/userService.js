const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');


const registerUser = async (name, email, password) => {
  let user = await User.findOne({ email });
  if (user) {
    throw new Error('User with this email already exists');
  }
  user = new User({ name, email, password });
  await user.save(); // The model's pre-save hook handles hashing
  const payload = { user: { id: user.id } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid Credentials');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid Credentials');
  }
  const payload = { user: { id: user.id } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
  user.password = undefined; 
  return { token, user };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  return resetToken;
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error('Token is invalid or has expired.');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); 

  
  const payload = { user: { id: user.id } };
  const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
  user.password = undefined;
  return { token: newToken, user };
};


module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};