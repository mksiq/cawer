const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userController = require("./controller/userController");
const bodyParser = require('body-parser');
const Configuration = require('../config/config')

dotenv.config({ path: "./config/keys.env" });

const HTTP_PORT = process.env.HTTP_PORT;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(HTTP_PORT, () => {
  console.log(`Serving on ${HTTP_PORT}`);
  if (HTTP_PORT === "8080") {
    console.log("Click to open browser: http://localhost:8080");
  }
});

app.use("/", userController);

Configuration.start();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to CAW CAWER API!" });
});

app.use("*", cors());
