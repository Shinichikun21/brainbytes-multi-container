const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const aiService = require('./services/aiService');

const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes');
const sessionRouter = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;


// --- Middleware ---

app.use(cors({
  origin: 'http://localhost:8080', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token'] 
}));
app.use(express.json());

// Initialize Services
if (aiService && aiService.initializeAI) {
    aiService.initializeAI();
}


app.use('/api/users', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/sessions', sessionRouter); 



if (!dbURI) {
  console.error('FATAL ERROR: MONGO_URI is not defined. Shutting down.');
  process.exit(1);
}

mongoose.connect(dbURI, {
  retryWrites: true 
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});