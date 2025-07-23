const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const auth = require('../middleware/auth');
const sessionController = require('../controllers/sessionController');

// Get all user sessions
router.get('/', auth, sessionController.getUserSessions);

// Get a single session by ID
router.get('/:id', [
  auth,
  param('id', 'Invalid session ID').isMongoId()
], sessionController.getSessionById);

// Delete a session
router.delete('/:id', [
  auth,
  param('id', 'Invalid session ID').isMongoId()
], sessionController.deleteSession);

module.exports = router;
