// backend/__tests__/messageService.test.js
const messageService = require('../services/messageService');
const db = require('../db');

// Mock the database module
jest.mock('../db');

describe('Message Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  test('saveMessage calls database with correct data', async () => {
    // Setup the mock
    db.saveMessage.mockResolvedValueOnce({ insertedId: '123' });
    
    // Call the service
    const message = { text: 'Test message', sender: 'user' };
    await messageService.saveMessage(message);
    
    // Verify the database was called correctly
    expect(db.saveMessage).toHaveBeenCalledWith(message);
    expect(db.saveMessage).toHaveBeenCalledTimes(1);
  });
  
  test('getMessagesBySession returns messages from database', async () => {
    // Setup mock data
    const mockMessages = [
      { text: 'Hello', sender: 'user' },
      { text: 'Hi there', sender: 'ai' }
    ];
    
    // Setup the mock
    db.getMessagesBySession.mockResolvedValueOnce(mockMessages);
    
    // Call the service
    const result = await messageService.getMessagesBySession('test-session');
    
    // Verify results
    expect(result).toEqual(mockMessages);
    expect(db.getMessagesBySession).toHaveBeenCalledWith('test-session');
  });
});
