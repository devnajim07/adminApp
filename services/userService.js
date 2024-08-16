
const logger = require('../logger');
const { connectToDatabase } = require('./dbClient');
const DateTimeUtils = require('../utils/dateTimeUtils');
const dateTimeUtils = new DateTimeUtils();
/**
 * @function createUser
 * @description This function will insert user data into user collection.
 * @param {Object} user user contains user data fields.
 */
async function createUser(user) {
  try {
    const db = await connectToDatabase();
    user['createdOn']=dateTimeUtils.getCurrentTimestamp();
    await db.collection('userAccounts').insertOne(user);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @function getAllUsers
 * @description This function will fetch and  return  user data from user collection.
 */
async function getAllUsers() {
  try {
    const db = await connectToDatabase();
    return await db.collection('userAccounts').find().toArray();
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @function getUserById
 * @description This function will fetch and  return  user data based on userId from user collection.
 *  @param {id} id  user id.
 */
async function getUserById(id) {
  try {
    const db = await connectToDatabase();
    const user = await db.collection('userAccounts').findOne({ userId: "1" });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @function updateUser
 * @description This function will update user data based on id and  return  user updated data from user collection.
 *  @param {id} id  user id.
*/
async function updateUser(id, user) {
  try {
    const db = await connectToDatabase();
    // Check if the document exists
    const existingUser = await db.collection('userAccounts').findOne({ userId: id });

    if (existingUser) {
      // Remove _id from the user object if it exists
      if (user._id) {
        delete user._id;
      }
    }

    const result = await db.collection('userAccounts').updateOne(
      { userId: id },
      { $set: user },
      { upsert: true }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @function deleteUser
 * @description This function will delete user data based on id and  return delete result.
 *  @param {id} id  user id.
 */
async function deleteUser(id) {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('userAccounts').deleteOne({ userId: id })
    logger.debug('Deleted Count:', result.deletedCount);
    return result;
  } catch (error) {
    logger
    throw new Error(error.message);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
