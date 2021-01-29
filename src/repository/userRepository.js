const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserError = require("../errors/UserError");

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

userSchema.pre("save", function (next) {
  let user = this;
  // Generate a unique salt and hash the password.
  bcrypt
    .genSalt(10)
    .then((salt) => {
      bcrypt
        .hash(user.password, salt)
        .then((encryptedPwd) => {
          // Password was hashed, update the user password.
          // The new hashed password will be saved to the database.
          user.password = encryptedPwd;
          next();
        })
        .catch((err) => {
          console.log(`Error occurred when hashing. ${err}`);
        });
    })
    .catch((err) => {
      console.log(`Error occurred when salting. ${err}`);
    });
});

const userDataModel = mongoose.model("Users", userSchema);

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
    try {
      foundUser = await userDataModel.findOne({ email: user.email });
    } catch (err) {
      throw new UserError("User not found");
    }
    const matches = await bcrypt.compare(user.password, foundUser.password);
    if (matches) {
      return foundUser;
    } else {
      throw new UserError("Password does not match");
    }
  }
}

module.exports = UserRepository;

// isValidPassword(){}

// async salt() {
//     const salt = await bcrypt.genSalt();
//     const hash = await bcrypt.hash(this.password, salt);
//     this.password = hash;
// }

// async checkPassword(password) {
//     // add throw error
//     const result = await bcrypt.compare(password, this.password);
//     return result;

// }
