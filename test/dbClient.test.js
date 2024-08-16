const { MongoClient } = require('mongodb');
const { connectToDatabase } = require('../services/dbClient');
const logger = require('../logger');
const config = require('../config/config');
require('dotenv').config();

jest.mock('mongodb');
jest.mock('../logger');

describe('connectToDatabase', () => {
  let mockClient;
  let mockDb;

  beforeEach(() => {
    mockDb = {};
    mockClient = {
      connect: jest.fn().mockResolvedValue(),
      db: jest.fn().mockReturnValue(mockDb),
    };
    MongoClient.mockImplementation(() => mockClient);
    process.env.dbName = 'testDB';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
 
  it('should connect to MongoDB and return the db instance', async () => {
    const db = await connectToDatabase();
    
    expect(mockClient.connect).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalledWith('testDB');
    expect(logger.debug).toHaveBeenCalledWith('MongoDB connected!');
  });

  it('should return the existing db instance if already connected', async () => {
    const firstDbInstance = await connectToDatabase();
    const secondDbInstance = await connectToDatabase();
     
    // Assert: The first and second db instances should be the same
    expect(firstDbInstance).toBe(secondDbInstance);
  
 
  });

  beforeEach(() => {
    mockClient = {
      connect: jest.fn(),
      db: jest.fn(),
    };
    MongoClient.mockImplementation(() => mockClient);
    process.env.dbName = 'testDB';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log and throw an error if connection fails', async () => {
    const errorMessage = 'Connection error';
    mockClient.connect.mockRejectedValueOnce(new Error(errorMessage));

    // Expect the connectToDatabase function to throw an error
    await expect(connectToDatabase()).rejects.toThrow('Connection failed');

    // Expect the logger to have been called with the correct arguments
    expect(logger.debug).toHaveBeenCalledWith('MongoDB connection error:', expect.any(Error));
  });
  
});
