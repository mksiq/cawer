const express = require("express");
const router = new express.Router();
const authMiddleware = require("../middleware/auth");
const ChatService = require("../service/chatService");

/**
 * Get  logged user chats
 * @param {int} req.user.id : user id in decoded token
 * @return {array} chats : chats that a user pertains
 */
router.get("/chats", authMiddleware, async function (req, res) {
    try {
      const chats = await ChatService.findByUser(req.user.id);
      res.status(200).send(chats);
    } catch (error) {
      if (error) {
        res.status(error.statusCode).send(error);
      } else {
        res.status(500).send(error);
      }
    }
});

/**
 * Get logged user chats with another user
 * @param {int} req.user.id : user id in decoded token
 * @param {int} id : another user
 * @return {object} chat : chats that a user pertains
 */
router.get("/chats/:id", authMiddleware, async function (req, res) {
    try {
      const users = [req.user.id, req.params.id];
      const chat = await ChatService.findByUsers(users);
      res.status(200).send(chat);
    } catch (error) {
      if (error && error.statusCode) {
        res.status(error.statusCode).send(error);
      } else {
        res.status(500).send(error);
      }
    }
});

module.exports = router;
