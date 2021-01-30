const mongoose = require("mongoose");
const ApplicationError = require("../errors/ApplicationError");
const UserError = require("../errors/UserError");
const Schema = mongoose.Schema;

/**
 * Manage database for chats
 */
class ChatRepository {
  /**
   * Creates a chat
   * @param {array} users : array of users, must match both
   * @returns {object} chat: a single chat that contains both users
   */
  static async insert(users) {
    // make sure order of users id is always the same
    users.sort();
    try {
      // Makes sure there is only a single chat for two same users
      let foundChat;
      try {
        foundChat = await this.findByUsers(users);
      } catch (e) {
        // Just ignore this error if chat not found
      }
      if (!foundChat || foundChat.length == 0) {
        const chat = new chatDataModel({
          users: users,
        });
        return await chat.save();
      }
      return foundChat;
    } catch (err) {
      throw new ApplicationError();
    }
  }

  /**
   * Finds a chat receiving both users
   * @param {array} users : array of users, must match both
   * @returns {object} chat: a single chat that contains both users
   */
  static async findByUsers(users) {
    try {
      // make sure order of users id is always the same
      users.sort();
      // Avoids getting id as custom type instead of string
      users[0] = users[0] + "";
      users[1] = users[1] + "";
      const foundChat = await chatDataModel.findOne({ users: { $all: users } });
      if (!foundChat) {
        throw new UserError("Chat not found");
      }
      return foundChat;
    } catch (err) {
      throw new UserError("Invalid request");
    }
  }

  /**
   * Finds a chat receiving an user id
   * @param {integer} user id : a single user id
   * @returns {array} chat: a all chats that contains both users
   */
  static async findByUser(user) {
    try {
      console.log(user);
      const foundChat = await chatDataModel.find({ users: user });
      if (!foundChat) {
        throw new UserError("Chat not found");
      }
      return foundChat;
    } catch (err) {
      throw err;
    }
  }
}

const chatSchema = new Schema({
  users: {
    type: Array,
    required: true,
  },
});

const chatDataModel = mongoose.model("Chat", chatSchema);

module.exports = ChatRepository;
