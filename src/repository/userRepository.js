const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const ApplicationError = require("../errors/ApplicationError");
const Schema = mongoose.Schema;
const UserError = require("../errors/UserError");

/**
 * Manage database for users
 */
class UserRepository {
  /**
   * Inserts a user
   * @param {object} user : user data
   * @returns {object} user update with creation date and id
   */
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

  /**
   * Login, finds  a user and compare hashed password with the one in DB
   * @param {object} user : user data
   * @returns {object} user found if passwords match
   */
  static async login(user) {
    let foundUser;
    try {
      foundUser = await userDataModel.findOne({ username: user.username });
      if (!foundUser) {
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

  /**
   * Finds a user
   * @param {integer} id : user id
   * @returns {object} found user
   */
  static async findOne(id) {
    let foundUser;
    try {
      foundUser = await userDataModel.findOne({ _id: id });
      if (!foundUser) {
        throw new UserError("User not found");
      }
      return foundUser;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Finds a user by its username
   * @param {string} username : user username
   * @returns {object} found user
   */
  static async findOneByUsername(username) {
    let foundUser;
    try {
      foundUser = await userDataModel.findOne({ username: username });
      if (!foundUser) {
        throw new UserError("User not found");
      }
      return foundUser;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Deletes a user by id
   * @param {integer} id : user id
   */
  static async deleteOne(id) {
    try {
      return await userDataModel.deleteOne({ _id: id });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Updates a user
   * @param {object} user : user data
   * @returns {object} updated user
   */
  static async update(user) {
    try {
      console.log(user);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await userDataModel.updateOne(
        { _id: user._id },
        {
          $set: {
            email: user.email,
            password: user.password,
            username: user.username,
            alias: user.alias,
          },
        }
      );
      return await userDataModel.findOne({ _id: user._id });
    } catch (err) {
      console.log(err);
      throw new UserError("User already exists");
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
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Before saving an user hashes the password with bcrypt
userSchema.pre("save", function (next) {
  let user = this;
  bcrypt.genSalt(10).then((salt) => {
    bcrypt.hash(user.password, salt).then((encryptedPwd) => {
      user.password = encryptedPwd;
      next();
    });
  });
});

const userDataModel = mongoose.model("Users", userSchema);

module.exports = UserRepository;
