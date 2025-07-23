const ChatSession = require('../models/Sessions');
const Message = require('../models/Message');

/**
 * Finds an existing session for a user OR creates a new one if no ID is provided.
 */
const findOrCreateSession = async ({ sessionId, userId, title }) => {
  // Path 1: A session ID was provided. Find the existing session.
  if (sessionId) {
    const session = await ChatSession.findOne({ _id: sessionId, user: userId });
    if (!session) {
      throw new Error('Session not found or permission denied.');
    }
    return session;
  } 
  
  
  else {
    const newSession = new ChatSession({
      user: userId,
      title: title.substring(0, 40) + '...', 
    
    });
    await newSession.save();
    return newSession;
  }
};

const getUserSessions = async (userId) => {
  return ChatSession.find({ user: userId }).sort({ updatedAt: -1 });
};

const getSessionWithMessages = async (sessionId, userId) => {
  const session = await ChatSession.findOne({ _id: sessionId, user: userId });
  if (!session) throw new Error('Session not found or permission denied.');
  const messages = await Message.find({ session: sessionId }).sort({ createdAt: 'asc' });
  return { session, messages };
};

const deleteSession = async (sessionId, userId) => {
  const session = await ChatSession.findOne({ _id: sessionId, user: userId });
  if (!session) throw new Error('Session not found or permission denied.');
  await Promise.all([
    ChatSession.findByIdAndDelete(sessionId),
    Message.deleteMany({ session: sessionId }),
  ]);
};

module.exports = {
  findOrCreateSession,
  getUserSessions,
  getSessionWithMessages,
  deleteSession,
};