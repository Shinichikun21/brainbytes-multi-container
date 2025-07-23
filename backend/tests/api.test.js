// backend/__tests__/api.test.js
const request = require('supertest');
const app = require('../server'); 

describe('Chat API Tests', () => {
  test('POST /api/chat sends a response', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello', sessionId: 'test-123' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /api/chat/history returns message history', async () => {
    const response = await request(app)
      .get('/api/chat/history/test-123');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('messages');
    expect(Array.isArray(response.body.messages)).toBe(true);
  });
});