const { validationResult } = require('express-validator');
const SessionService = require('../services/SessionService');

exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await SessionService.getUserSessions(req.user.id);
    res.json(sessions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.getSessionById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { session, messages } = await SessionService.getSessionWithMessages(req.params.id, req.user.id);
    res.json({ session, messages });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ msg: error.message });
    }
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await SessionService.deleteSession(req.params.id, req.user.id);
    res.json({ msg: 'Chat session deleted successfully.' });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ msg: error.message });
    }
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};