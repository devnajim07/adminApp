const { MongoClient } = require('mongodb');
const config = require('../config/config');
require('dotenv').config();
const logger = require('../logger');

let client;
let db;

/**
 * @function createMongoClient
 * @description Creates a new MongoClient instance.
 * @param {string} uri - The MongoDB URI.
 * @param {object} options - Options for MongoClient.
 * @returns {MongoClient} - The MongoClient instance.
 */
function createMongoClient(uri, options) {
  return new MongoClient(uri, options);
}

/**
 * @function connectToDatabase
 * @description This function will create the connection and return the db connection object.
 * @param {function} [clientFactory=createMongoClient] - Factory function to create MongoClient, for testing purposes.
 * @returns {Promise<Db>} - The MongoDB database instance.
 */
async function connectToDatabase(clientFactory = createMongoClient) {
  if (db) {
    return db;
  }
  try {
    client = clientFactory(config.mongoURI);
    await client.connect();
    db = client.db(process.env.dbName);
    logger.debug('MongoDB connected!');
    return db;
  } catch (error) {
    logger.debug('MongoDB connection error:', error);
    throw new Error('Connection failed');
  }
}

module.exports = { connectToDatabase };
