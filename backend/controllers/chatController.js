// backend/controllers/chatController.js
const Message = require('../models/Message');
const aiService = require('../aiService');

// Send a message and get AI response
exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Generate a session ID if not provided
    const chatSessionId = sessionId || Date.now().toString();

    // Save user message to database
    const userMessage = new Message({
      text: message,
      sender: 'user',
      sessionId: chatSessionId,
      timestamp: new Date()
    });
    await userMessage.save();

    // Get AI response from our existing service
    let aiResult;
    try {
      // Create a 10-second timeout for AI response
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const aiResultPromise = aiService.generateResponse(message);
      aiResult = await Promise.race([aiResultPromise, timeoutPromise]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      aiResult = {
        category: 'error',
        response: "I'm sorry, but I couldn't process your request in time. Please try again with a simpler question."
      };
    }

    // Save AI response to database
    const aiMessage = new Message({
      text: aiResult.response,
      sender: 'ai',
      sessionId: chatSessionId,
      timestamp: new Date()
    });
    await aiMessage.save();

    // Return both messages
    res.status(200).json({
      userMessage,
      aiMessage,
      sessionId: chatSessionId,
      category: aiResult.category
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'An error occurred while processing your message' });
  }
};

// Get chat history for a session
exports.getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const messages = await Message.find({ sessionId })
      .sort({ timestamp: 1 })
      .limit(100);

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({ error: 'An error occurred while retrieving chat history' });
  }
};