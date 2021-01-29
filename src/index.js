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
    console.log("Click here to open browser: http://localhost:8080");
  }
});

app.use("/", userController);

const authMiddleware = require("./middlewares/auth.middleware");

const tempToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IiIsImlhdCI6MTYxMTkyNzQzNywiZXhwIjoxNjEyMDEzODM3fQ.v5l80Oy8amjphXCcKIvNqIGlqiH-Gaz2cOq2gOW2fNI";

app.get("/", (req, res) => {
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IiIsImlhdCI6MTYxMTkyNzQzNywiZXhwIjoxNjEyMDEzODM3fQ.v5l80Oy8amjphXCcKIvNqIGlqiH-Gaz2cOq2gOW2fNI
  res.status(200).json({ message: "Welcome to CAW CAWER API!" });
});

app.use("*", cors());

Configuration.start();

const User = require("./model/user");

const jwt = require("jsonwebtoken");

console.log(process.env.TOKEN_SECRET)

app.post('/signup', (req, res) => {
  const user = new User();

  // user.name = "Maickel";
  // user.password = "ok";
  // (async () => {
  //   await user.salt();
  //   var token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
  //     expiresIn: 86400 // expires in 24 hours
  //   });
  //   console.log(token)
  //   console.log(await user.checkPassword("ok123123"));
  // })();



})

app.get('/me', function(req, res) {
  var token =  req.headers['x-access-token']; //tempToken;// ;
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    res.status(200).send(decoded);
  });
});


// const user = new User('tester', 'tester', 'tester@gmail.com', 'testertester');
// const theDate = `username=tester&password=testertester&email=tester@gmail.com&alias=tester`
// fetch('http://localhost:8080/register-user', {method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},body: 
//   theDate
// }).then((res) =>{
//   res.json().then( x => 
//     console.log(x)
//     )
// })