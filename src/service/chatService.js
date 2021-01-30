const ChatRepository = require("../repository/chatRepository");

class ChatService {
  constructor() {
    this.chatRepository = ChatRepository;
  }
  /**
   * Creates a chat if does not exist yet, else return one
   * @param {array} users : array of users
   * @returns {object} chat: a single chat that contains both users
   */
  static async findOrInsert(users) {
    try {
      return await ChatRepository.insert(users);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Finds a chat by user id
   * @param {integer} user : user id to look for
   * @returns {array} chats: all chats that a user has
   */
  static async findByUser(id) {
    try {
      const chats = await ChatRepository.findByUser(id);
      if (chats) {
        return chats;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Finds a chat by username
   * @param {string} username : username  to look for
   * @returns {array} chats: all chats that a user has
   */
  static async findByUsername(username) {
    try {
      const chats = await ChatRepository.findByUsername(username);
      if (chats) {
        return chats;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Finds a single chat by that both users are in
   * @param {array} users : two users
   * @returns {object} chat: the single chat found
   */
  static async findByUsers(users) {
    try {
      const chat = await ChatRepository.findByUsers(users);
      if (chat) {
        return chat;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChatService;
