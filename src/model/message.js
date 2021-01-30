/**
 * Base class for Message
 */
class Message {
  constructor (content, sender, chat){
    this._id = "";
    this.content = content;
    this.sender = sender;
    this.chat = chat;
  }
}

module.exports = Message;