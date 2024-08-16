const express = require('express');
const logger = require('../logger');
const router = express.Router();
const {createUser,getUserById,getAllUsers,deleteUser,updateUser} = require('../services/userService')

require('dotenv').config();

module.exports = () => {
  // Create a new user
  router.post('/users', async (req, res) => {
    try {
      logger.debug("insert new user")
      const user = req.body;
      const result= await createUser(user);
      res.status(201).json(result);
    } catch (error) {
      logger.debug(`Error creating user: ${error}`);
      res.status(400).json({ error: error.message });
    }
  });

  // Get all users
  router.get('/users', async (req, res) => {
    try {
      logger.debug("get all users")
      const users = await getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      logger.debug(`Error retrieving users: ${error}`);
      res.status(400).json({ error: error.message });
    }
  });

  // Get a single user by ID
  router.get('/users/:id', async (req, res) => {
    try {
      logger.debug("get user by id")
      const userID=req.params.id 
      const user = await getUserById(userID);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      logger.debug(`Error retrieving user: ${error}`);
      res.status(400).json({ error: error.message });
    }
  });

  // Update a user by ID
  router.put('/users/:id', async (req, res) => {
    try {
      logger.debug("update user by id")
      const user = req.body;
        const result = await updateUser(req.params.id ,user)
      if ((result.upsertedCount || result.modifiedCount) === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      logger.debug(`Error updating user: ${error}`);
      res.status(400).json({ error: error.message });
    }
  });

  // Delete a user by ID
  router.delete('/users/:id', async (req, res) => {
    try {
      logger.debug(`delete user by id ${req.params.id}`)
      // const result = await collection.deleteOne({ userId: req.params.id });
      const result = await deleteUser(req.params.id)
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      logger.debug(`Error deleting user: ${error}`);
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};