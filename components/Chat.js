import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;
    
    // Optimistic UI update
    const tempId = uuidv4();
    const newUserMessage = {
      _id: tempId,
      text: input,
      sender: 'user',
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const payload = { 
        text: input,
        ...(currentSessionId && { sessionId: currentSessionId })
      };

      const response = await axios.post(`${API_URL}/chat/send`, payload);
      const { userMessage, aiMessage, sessionId, isNewSession } = response.data;

      // Replace optimistic message with actual response
      setMessages(prev => [
        ...prev.filter(m => m._id !== tempId),
        userMessage,
        aiMessage
      ]);

      // Update session ID if this was a new conversation
      if (isNewSession) {
        setCurrentSessionId(sessionId);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m._id !== tempId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.length === 0 && !isLoading && (
          <div className="welcome-message">
            <h3>BrainBytes AI</h3>
            <p>Ask me anything about math, science, or history!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg._id} 
            className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">{msg.text}</div>
            <div className="message-time">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message ai-message">
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="input-area">
        <button 
          type="button" 
          onClick={handleNewChat}
          className="new-chat-button"
          disabled={isLoading}
        >
          New Chat
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
        }
        
        .message-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        
        .welcome-message {
          text-align: center;
          margin-top: 2rem;
          color: #666;
        }
        
        .message {
          max-width: 80%;
          margin-bottom: 15px;
          padding: 12px 16px;
          border-radius: 18px;
          line-height: 1.4;
        }
        
        .user-message {
          background: #4a6fa5;
          color: white;
          margin-left: auto;
        }
        
        .ai-message {
          background: #e9ecef;
          margin-right: auto;
        }
        
        .message-time {
          font-size: 0.7rem;
          margin-top: 4px;
          text-align: right;
          color: rgba(255,255,255,0.7);
        }
        
        .ai-message .message-time {
          color: #666;
        }
        
        .typing-indicator span {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #999;
          border-radius: 50%;
          margin: 0 2px;
          animation: bounce 1.5s infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .input-area {
          display: flex;
          gap: 10px;
          padding: 15px;
          background: white;
          border-top: 1px solid #ddd;
        }
        
        .input-area input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .input-area button {
          padding: 0 20px;
          background: #4a6fa5;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .input-area button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .new-chat-button {
          background: #f0f0f0;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Chat;