const mongoose = require("mongoose");
const ApplicationError = require("../errors/ApplicationError");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  users: {
    type: Array,
    required: true,
  },
});

const chatDataModel = mongoose.model("Chat", chatSchema);

/**
   * 
   * @param {array} users : array of users, must match both
   * @returns {object} chat: a single chat that contains both users
   */
class ChatRepository {
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
      if (foundChat.length == 0) {
        console.error(" \n\n\nINserting it")
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
   * 
   * @param {array} users : array of users, must match both
   * @returns {object} chat: a single chat that contains both users
   */
  static async findByUsers(users) {
    try {
      // make sure order of users id is always the same
      users.sort();
      const foundChat = await chatDataModel.find({ users: { $all: users } });
      if (!foundChat) {
        throw new UserError("Chat not found");
      }
      return foundChat;
    } catch (err) {
      throw err;
    }
  }
  
   /**
   * 
   * @param {integer} user id : a single user id
   * @returns {array} chat: a all chats that contains both users
   */
  static async findByUser(user) {
    try {
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

module.exports = ChatRepository;
