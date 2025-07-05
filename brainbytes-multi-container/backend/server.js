const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const aiService = require('./aiService');
const chatRoutes = require('./routes/chatRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI model
aiService.initializeAI();

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the BrainBytes API' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Chat routes
app.use('/api/chat', chatRoutes);

// Legacy endpoint for backward compatibility
app.post('/api/messages', async (req, res) => {
  try {
    // Save user message
    const userMessage = new Message({
      text: req.body.text,
      sender: 'user',
      sessionId: 'legacy',
      timestamp: new Date()
    });
    await userMessage.save();

    // Generate AI response
    const aiResult = await aiService.generateResponse(req.body.text);

    // Save AI response
    const aiMessage = new Message({
      text: aiResult.response,
      sender: 'ai',
      sessionId: 'legacy',
      timestamp: new Date()
    });
    await aiMessage.save();

    // Return both messages
    res.status(201).json({
      userMessage,
      aiMessage,
      category: aiResult.category
    });
  } catch (err) {
    console.error('Error in /api/messages route:', err);
    res.status(400).json({ error: err.message });
  }
});

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/brainbytes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});