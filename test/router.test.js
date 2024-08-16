const request = require('supertest');
const express = require('express');
const logger = require('../logger');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../services/userService');
const userRoutes = require('../routes/router');

jest.mock('../services/userService');
jest.mock('../logger');

const app = express();
app.use(express.json());
app.use(userRoutes());

describe('User Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    it('should create a new user and return the user data', async () => {
      const newUser = { userId: '1', name: 'John Doe' };
      createUser.mockResolvedValue(newUser);

      const response = await request(app)
        .post('/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newUser);
      expect(logger.debug).toHaveBeenCalledWith("insert new user");
    });

    it('should return an error if user creation fails', async () => {
      const errorMessage = 'Creation failed';
      createUser.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .post('/users')
        .send({ name: 'John Doe' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
      expect(logger.debug).toHaveBeenCalledWith(`Error creating user: Error: ${errorMessage}`);
    });
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const users = [{ userId: '1', name: 'John Doe' }];
      getAllUsers.mockResolvedValue(users);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(users);
      expect(logger.debug).toHaveBeenCalledWith("get all users");
    });

    it('should return an error if fetching users fails', async () => {
      const errorMessage = 'Fetch failed';
      getAllUsers.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).get('/users');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
      expect(logger.debug).toHaveBeenCalledWith(`Error retrieving users: Error: ${errorMessage}`);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by ID', async () => {
      const user = { userId: '1', name: 'John Doe' };
      getUserById.mockResolvedValue(user);

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
      expect(logger.debug).toHaveBeenCalledWith("get user by id");
    });

    it('should return 404 if user is not found', async () => {
      getUserById.mockResolvedValue(null);

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
      expect(logger.debug).toHaveBeenCalledWith("get user by id");
    });

    it('should return an error if fetching user by ID fails', async () => {
      const errorMessage = 'Fetch failed';
      getUserById.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
      expect(logger.debug).toHaveBeenCalledWith(`Error retrieving user: Error: ${errorMessage}`);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user by ID and return the updated user data', async () => {
      const updatedUser = { userId: '1', name: 'John Doe Updated' };
      updateUser.mockResolvedValue({ upsertedCount: 1, modifiedCount: 1 });

      const response = await request(app)
        .put('/users/1')
        .send(updatedUser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
      expect(logger.debug).toHaveBeenCalledWith("update user by id");
    });

    it('should return 404 if user to update is not found', async () => {
      updateUser.mockResolvedValue({ upsertedCount: 0, modifiedCount: 0 });

      const response = await request(app).put('/users/1').send({ name: 'John Doe Updated' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
      expect(logger.debug).toHaveBeenCalledWith("update user by id");
    });

    it('should return an error if updating user fails', async () => {
      const errorMessage = 'Update failed';
      updateUser.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .put('/users/1')
        .send({ name: 'John Doe Updated' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
      expect(logger.debug).toHaveBeenCalledWith(`Error updating user: Error: ${errorMessage}`);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user by ID and return success message', async () => {
      deleteUser.mockResolvedValue({ deletedCount: 1 });

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User deleted successfully' });
      expect(logger.debug).toHaveBeenCalledWith("delete user by id 1");
    });

    it('should return 404 if user to delete is not found', async () => {
      deleteUser.mockResolvedValue({ deletedCount: 0 });

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
      expect(logger.debug).toHaveBeenCalledWith("delete user by id 1");
    });

    it('should return an error if deleting user fails', async () => {
      const errorMessage = 'Delete failed';
      deleteUser.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
      expect(logger.debug).toHaveBeenCalledWith(`Error deleting user: Error: ${errorMessage}`);
    });
  });
});
