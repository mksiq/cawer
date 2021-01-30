const express = require("express");
const User = require("../model/user");
const UserService = require("../service/userService");
const router = new express.Router();
const authMiddleware = require("../middleware/auth");

/**
 * Signup end-point
 * @param request : user data
 * @return json : user data with token
 */
router.post("/register-user", (req, res) => {
  const { username, alias, email, password } = req.body;
  const user = new User(username, alias, password, email);

  (async () => {
    try {
      const newUser = await UserService.signUp(user);
      res.status(201).send(newUser);
    } catch (error) {
      res.status(error.statusCode).send(error);
    }
  })();
});

/**
 * Login end-point
 * @param request : username and password
 * @return json : token
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = new User(username, null, password, null);
  (async () => {
    try {
      const loggedUser = await UserService.login(user);
      res.status(200).send(loggedUser);
    } catch (error) {
      res.status(error.statusCode).send(error);
    }
  })();
});

/**
 * Get  logged own user information
 * @param request : user data to update
 * @return json : user data after update
 */
router.get("/self", authMiddleware, function (req, res) {
  (async () => {
    try {
      const loggedUser = await UserService.findOne(req.user.id);
      res.status(200).send(loggedUser);
    } catch (error) {
      res.status(error.statusCode).send(error);
    }
  })();
});

/**
 * Update logged user information
 * @param request : token
 * @return json : user data 
 */
router.post("/update-user", authMiddleware, function (req, res) {
  const { username, alias, email, password } = req.body;

  const user = new User(username, alias, password, email);
  user._id = req.user.id;
  console.log(user);
  (async () => {
    try {
      const newUser = await UserService.update(user);
      res.status(201).send(newUser);
    } catch (error) {
      res.status(error.statusCode).send(error);
    }
  })();
});

/**
 * Delete logged user
 * @param request : token
 * @return json : message
 */
router.delete("/delete-user", authMiddleware, function (req, res) {
  const id = req.user.id;
  (async () => {
    try {
      await UserService.delete(id);
      res.status(204).send({message: 'User deleted'});
    } catch (error) {
      res.status(error.statusCode).send(error);
    }
  })();
});

module.exports = router;
