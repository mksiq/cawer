const ChatRepository = require("../repository/chatRepository");

class ChatService {
  constructor() {
    this.chatRepository = ChatRepository;
  }
  
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
  
}

module.exports = ChatService;