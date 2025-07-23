const { validationResult } = require('express-validator');
const MessageService = require('../services/messageService');
const { v4: uuidv4 } = require('uuid'); // For generating session IDs

exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { text, sessionId } = req.body;
  const userId = req.user.id;

  try {
    // Generate a new sessionId if none was provided
    const finalSessionId = sessionId || uuidv4();
    
    const result = await MessageService.createConversationTurn({
      userId,
      text,
      sessionId: finalSessionId
    });
    
    res.status(201).json({
      ...result,
      // Include the sessionId in response so client knows what to use for subsequent messages
      sessionId: finalSessionId
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ msg: error.message });
    }
    console.error('Error in sendMessage controller:', error);
    res.status(500).json({ msg: 'Server error while processing your message.' });
  }
};