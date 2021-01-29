const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserError = require("../errors/UserError");

//Manage DataBase
class UserRepository {
  static async insert(user) {
    try {
      const newUser = new userDataModel({
        username: user.username,
        email: user.email,
        alias: user.alias,
        password: user.password,
      });
      return await newUser.save();
    } catch (err) {
      throw new UserError("User already exists");
    }
  }

  static async login(user) {
    let foundUser;
    console.log(user)
    try {
      foundUser = await userDataModel.findOne({ username: user.username });
      if(!foundUser) {
        throw new UserError("User not found");
      }
    } catch (err) {
      throw err;
    }
    const matches = await bcrypt.compare(user.password, foundUser.password);
    if (matches) {
      return foundUser;
    } else {
      throw new UserError("Password does not match");
    }
  }
}

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  alias: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  notBanned: {
    type: Boolean,
    required: true,
    default: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Before saving an user hashes the password with bcrypt
userSchema.pre("save", function (next) {
  let user = this;
  bcrypt
    .genSalt(10)
    .then((salt) => {
      bcrypt
        .hash(user.password, salt)
        .then((encryptedPwd) => {
          user.password = encryptedPwd;
          next();
        });
    });
});

const userDataModel = mongoose.model("Users", userSchema);



module.exports = UserRepository;