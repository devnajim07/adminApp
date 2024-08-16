const { connectToDatabase } = require('../services/dbClient');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../services/userService');
const logger = require('../logger');

jest.mock('../services/dbClient');
jest.mock('../logger');

describe('User Service', () => {
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    mockDb = {
      collection: jest.fn(),
    };
    mockCollection = {
      insertOne: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };
    mockDb.collection.mockReturnValue(mockCollection);
    connectToDatabase.mockResolvedValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should insert user data and return the user', async () => {
      const user = { userId: '1', name: 'John Doe' };
      mockCollection.insertOne.mockResolvedValue({ insertedId: '1' });

      const result = await createUser(user);

      expect(connectToDatabase).toHaveBeenCalled();
      expect(mockCollection.insertOne).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should throw an error if insertion fails', async () => {
      const user = { userId: '1', name: 'John Doe' };
      mockCollection.insertOne.mockRejectedValue(new Error('Insert failed'));

      await expect(createUser(user)).rejects.toThrow('Insert failed');
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users = [{ userId: '1', name: 'John Doe' }, { userId: '2', name: 'Jane Doe' }];
      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(users),
      });

      const result = await getAllUsers();

      expect(connectToDatabase).toHaveBeenCalled();
      expect(mockCollection.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should throw an error if fetching users fails', async () => {
      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('Fetch failed')),
      });

      await expect(getAllUsers()).rejects.toThrow('Fetch failed');
    });
  });

  describe('getUserById', () => {
    it('should return the user with the specified id', async () => {
      const user = { userId: '1', name: 'John Doe' };
      mockCollection.findOne.mockResolvedValue(user);

      const result = await getUserById('1');

      expect(connectToDatabase).toHaveBeenCalled();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ userId: '1' });
      expect(result).toEqual(user);
    });

    it('should throw an error if fetching user by id fails', async () => {
      mockCollection.findOne.mockRejectedValue(new Error('Fetch failed'));

      await expect(getUserById('1')).rejects.toThrow('Fetch failed');
    });
  });

  describe('updateUser', () => {
    it('should update user data and return the result', async () => {
      const user = { userId: '1', name: 'John Doe' };
      const updateResult = { matchedCount: 1, modifiedCount: 1 };
      mockCollection.findOne.mockResolvedValue({ userId: '1' });
      mockCollection.updateOne.mockResolvedValue(updateResult);

      const result = await updateUser('1', user);

      expect(connectToDatabase).toHaveBeenCalled();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ userId: '1' });
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { userId: '1' },
        { $set: user },
        { upsert: true }
      );
      expect(result).toEqual(updateResult);
    });
    
    it('should handle error when updating user fails', async () => {
      const user = { userId: '1', name: 'John Doe' };
      mockCollection.findOne.mockResolvedValue({ userId: '1' });
      mockCollection.updateOne.mockRejectedValue(new Error('Update failed'));

      await expect(updateUser('1', user)).rejects.toThrow('Update failed');
    });
  });

  describe('deleteUser', () => {
    it('should delete the user with the specified id and return the result', async () => {
      const deleteResult = { deletedCount: 1 };
      mockCollection.deleteOne.mockResolvedValue(deleteResult);

      const result = await deleteUser('1');

      expect(connectToDatabase).toHaveBeenCalled();
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ userId: '1' });
      expect(result).toEqual(deleteResult);
      expect(logger.debug).toHaveBeenCalledWith('Deleted Count:', 1);
    });

    it('should throw an error if deletion fails', async () => {
      mockCollection.deleteOne.mockRejectedValue(new Error('Delete failed'));

      await expect(deleteUser('1')).rejects.toThrow('Delete failed');
    });
  });
});
