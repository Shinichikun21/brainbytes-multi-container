const Message = require('../models/Message');
const { v4: uuidv4 } = require('uuid');
const aiService = require('./aiService');

const createConversationTurn = async ({ userId, text, sessionId }) => {
  // Generate new sessionId if none provided
  const finalSessionId = sessionId || uuidv4();
  const isNewSession = !sessionId;

  try {
    // Create user message
    const userMessage = await Message.create({
      user: userId,
      sessionId: finalSessionId,
      text,
      sender: 'user',
      isNewSession
    });

    // Get AI response
    const aiResult = await aiService.generateResponse(text);
    
    // Create AI message
    const aiMessage = await Message.create({
      user: userId,
      sessionId: finalSessionId,
      text: aiResult.response,
      sender: 'ai',
      category: aiResult.category
    });

    return {
      userMessage: userMessage.toObject(),
      aiMessage: aiMessage.toObject(),
      sessionId: finalSessionId,
      isNewSession
    };
  } catch (error) {
    console.error('Error in createConversationTurn:', error);
    throw new Error('Failed to create conversation turn');
  }
};

// Additional useful methods
const getConversationHistory = async (userId, sessionId) => {
  return Message.find({ user: userId, sessionId })
    .sort({ createdAt: 1 })
    .lean();
};

module.exports = {
  createConversationTurn,
  getConversationHistory
};