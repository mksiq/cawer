const ApplicationError = require("../errors/ApplicationError");
const UserError = require("../errors/UserError");
const Message = require("../model/message");
const MessageRepository = require("../repository/messageRepository");
const ChatService = require("./chatService");
const UserService = require("./userService");

class MessageService {
  constructor() {
    this.MessageRepository = MessageRepository;
  }

  /**
   * Get messages by chat id, and validates that the user requesting it is part of that chat
   * @param {int} userId : user id in decoded token
   * @param {int} chatId : chat id requested
   * @return {array} messages : messages in a chat
   */
  static async findByChat(userId, chatId) {
    const chatUsersOwn = await ChatService.findByUser(userId);
    if (chatUsersOwn.some((chat) => chat._id == chatId)) {
      return await MessageRepository.findByChat(chatId);
    } else {
      console.log("\n\n\n\n Not found");
      throw new UserError("Not Authorized.");
    }
  }

  /**
   * Get messages in a chat between two users receiving username
   * @param {int} userId : user id in decoded token
   * @param {string} chatId : username for the other user
   * @return {array} messages : messages in a chat
   */
  static async findByChatWithUser(userId, username) {
    try {
      const user = await UserService.findOneByUsername(username);
      const users = [userId, user._id];
      const chat = await ChatService.findByUsers(users);
      return await MessageRepository.findByChat(chat._id);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Send message to a user
   * @param {int} sender : user id that is sending the message
   * @param {int} recipient : recipient id that receiving it
   * @param {string} content : text content inside a message
   * @return {object} message inserted
   */
  static async sendMessageToUserId(sender, recipient, content) {
    const users = [sender, recipient];
    const chat = await ChatService.findOrInsert(users);
    const message = new Message(content, sender, chat._id);
    return await MessageRepository.insert(message);
  }

  /**
   * Send message to a user
   * @param {int} sender : user id that is sending the message
   * @param {string} recipientUsername : recipient username that receiving it
   * @param {string} content : text content inside a message
   * @return {object} message inserted
   */
  static async sendMessageToUsername(sender, recipientUsername, content) {
    try {
      // looks for the user related to username
      const recipient = await UserService.findOneByUsername(recipientUsername);
      const users = [sender, recipient._id];
      const chat = await ChatService.findOrInsert(users);
      const message = new Message(content, sender, chat._id);
      return await MessageRepository.insert(message);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = MessageService;
