const express = require("express");
const router = new express.Router();
const authMiddleware = require("../middleware/auth");
const ChatService = require("../service/chatService");

/**
 * Get  logged user chats
 * @param {int} req.user.id : user data to update
 * @return {array} chats : chats that a user pertains
 */
router.get("/chats", authMiddleware, function (req, res) {
  (async () => {
    try {
      const chats = await ChatService.findByUser(req.user.id);
      res.status(200).send(chats);
    } catch (error) {
      res.status(error.statusCode).send(error);
    }
  })();
});

module.exports = router;