const mongoose = require("mongoose");
const ApplicationError = require("../errors/ApplicationError");
const Schema = mongoose.Schema;

/**
 * Manage database for messages
 */
class MessageRepository {
  /**
   * Creates a message
   * @param {object} message : message data
   * @returns {object} message update with date and id
   */
  static async insert(message) {
    try {
      const newMessage = new messageDataModel({
        content: message.content,
        sender: message.sender,
        chat: message.chat,
      });
      return await newMessage.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError();
    }
  }

  /**
   * Finds messages by chat id
   * @param {integer} chat : chat id
   * @returns {array} messages found
   */
  static async findByChat(chat) {
    console.log(chat);
    try {
      const foundMessages = await messageDataModel.find({
        chat: chat,
      });
      console.log(foundMessages);
      return foundMessages;
    } catch (err) {
      throw err;
    }
  }
  /**
   * Finds messages by the sender
   * @param {integer} user : user id
   * @returns {array} messages found
   */
  static async findBySender(user) {
    try {
      return await messageDataModel.find({ sender: user });
    } catch (err) {
      throw err;
    }
  }
}

const messageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    require: true,
    default: Date.now(),
  },
  chat: {
    type: String,
    required: true,
  },
});

const messageDataModel = mongoose.model("Message", messageSchema);

module.exports = MessageRepository;
