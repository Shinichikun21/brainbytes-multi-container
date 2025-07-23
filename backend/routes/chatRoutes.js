const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.post(
  '/send',
  [
    auth,
    check('text', 'Message text cannot be empty')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('sessionId', 'Invalid session ID format')
      .optional()
      .isString()
      .trim()
  ],
  chatController.sendMessage
);

module.exports = router;