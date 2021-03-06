const express = require("express");
const User = require("../model/user");
const UserService = require("../service/userService");
const router = new express.Router();
const authMiddleware = require("../middleware/auth");

/**
 * Signup end-point
 * @param {json} request : user data
 * @return {json} user data with token
 */
router.post("/register-user", async (req, res) => {
  const { username, alias, email, password } = req.body;
  const user = new User(username, alias, password, email);
  try {
    const newUser = await UserService.signUp(user);
    res.status(201).send(newUser);
  } catch (error) {
    res.status(error.statusCode).send(error);
  }
});

/**
 * Login end-point
 * @param {json} req.body : username and password
 * @return {json}  : token
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = new User(username, null, password, null);
  try {
    const loggedUser = await UserService.login(user);
    res.status(200).send(loggedUser);
  } catch (error) {
    res.status(error.statusCode).send(error);
  }
});

/**
 * Get  logged own user information
 * @param {int} req.user.id : user id
 * @return {object} user : user data
 */
router.get("/self", authMiddleware, async function (req, res) {
  try {
    const loggedUser = await UserService.findOne(req.user.id);
    res.status(200).send(loggedUser);
  } catch (error) {
    res.status(error.statusCode).send(error);
  }
});

/**
 * Get another user information. Needs to have a valid token
 * @param {int} req.user.id : user id
 * @return {json} user : user data
 */
router.get("/user/:id", authMiddleware, async function (req, res) {
  try {
    console.log(req.params.id);
    const loggedUser = await UserService.findOne(req.params.id);
    res.status(200).send(loggedUser);
  } catch (error) {
    res.status(error.statusCode).send(error);
  }
});

/**
 * Update logged user information
 * @param {string} token : token
 * @return {json} user : user data
 */
router.post("/update-user", authMiddleware, async function (req, res) {
  const { username, alias, email, password } = req.body;

  const user = new User(username, alias, password, email);
  user._id = req.user.id;
  console.log(user);

  try {
    const newUser = await UserService.update(user);
    res.status(201).send(newUser);
  } catch (error) {
    res.status(error.statusCode).send(error);
  }
});

/**
 * Delete logged user
 * @param {string} token : token
 * @return {json} message : confirmation
 */
router.delete("/delete-user", authMiddleware, async function (req, res) {
  const id = req.user.id;

  try {
    await UserService.delete(id);
    res.status(204).send({ message: "User deleted" });
  } catch (error) {
    res.status(error.statusCode).send(error);
  }
});

module.exports = router;
