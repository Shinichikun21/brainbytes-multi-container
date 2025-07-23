const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth'); 

// --- 1. Import all necessary controller functions from the correct controller ---
const { 
  registerUser, 
  loginUser, 
  getMe,
  forgotPassword,
  resetPassword,
  updateUserProfile
} = require('../controllers/userController');


router.post(
  '/register',
  [
    // Validation middleware runs before the controller
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  registerUser
);

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