const express = require("express");
const router = new express.Router();
const authMiddleware = require("../middleware/auth");
const MessageService = require("../service/messageService");

/**
 * Get messages by chat id, it passes user id forward to make sure that a user may
 * only get messages to that belong to a chat he is part of
 * @param {int} req.query.id : chat id in decoded token
 * @return {array} messages : messages in a chat
 */
router.get("/messages/by-id", authMiddleware, async function (req, res) {
  try {
    const { id } = req.query;
    const messages = await MessageService.findByChat(req.user.id, id);
    res.status(200).send(messages);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).send(error);
    } else {
      res.status(500).send(error);
    }
  }
});

/**
 * Get logged user messages with another user giving his username
 * @param {int} req.user.id : user id in decoded token
 * @param {int} id : another user
 * @return {object} message : messages that a user pertains
 */
router.get("/messages/by-user/", authMiddleware, async function (req, res) {
  try {
    const { username } = req.query;
    const messages = await MessageService.findByChatWithUser(
      req.user.id,
      username
    );
    res.status(200).send(messages);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).send(error);
    } else {
      res.status(500).send(error);
    }
  }
});

/**
 * Send a message to another user passing his id
 * @param {int} req.user.id : user id in decoded token
 * @param {int} id : another user
 * @return {object} message : message saved
 */
router.post("/messages/send", authMiddleware, async function (req, res) {
  try {
    const { content } = req.body;
    const { id: sender } = req.user;
    const { recipient } = req.query;
    const message = await MessageService.sendMessageToUserId(
      sender,
      recipient,
      content
    );
    res.status(200).send(message);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).send(error);
    } else {
      res.status(500).send(error);
    }
  }
});

/**
 * Send a message to another user passing his user name
 * @param {int} req.user.id : user id in decoded token
 * @param {int} id : another user
 * @return {object} message : message saved
 */
router.post("/messages/user/send", authMiddleware, async function (req, res) {
  try {
    const { content } = req.body;
    const { id: sender } = req.user;
    const { recipient } = req.query;
    const message = await MessageService.sendMessageToUsername(
      sender,
      recipient,
      content
    );
    res.status(200).send(message);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).send(error);
    } else {
      res.status(500).send(error);
    }
  }
});

module.exports = router;
