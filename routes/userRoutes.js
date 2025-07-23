const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');

const { 
  registerUser, 
  loginUser, 
  getMe,
  forgotPassword, 
  resetPassword   
} = require('../controllers/userController');

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

// @route   POST api/users/login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

router.post(
  '/forgot-password', 
  [check('email', 'Please include a valid email').isEmail()],
  forgotPassword
);

router.post(
  '/reset-password/:token',
  [check('password', 'Password must be at least 6 characters').isLength({ min: 6 })],
  resetPassword
);

router.get('/auth', auth, getMe);

module.exports = router;