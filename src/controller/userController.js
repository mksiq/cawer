const express = require("express");
const User = require("../model/user");
const UserService = require("../service/userService");
const router = new express.Router();

// Sign up
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
    })()
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = new User(null, null, password, email);
    (async () => {
        try {
            const loggedUser = await UserService.login(user);
            res.status(200).send(loggedUser);
        } catch (error) {
            res.status(error.statusCode).send(error);
        }        
    })()
});

module.exports = router;