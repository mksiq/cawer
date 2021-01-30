const UserError = require("../errors/UserError");
const UserRepository = require("../repository/userRepository");
const jwt = require("jsonwebtoken");
const ApplicationError = require("../errors/ApplicationError");

class UserService {
  constructor() {
    this.userRepository = UserRepository;
  }

  /**
   * Inserts an user as long as the input data is valdi
   * @param {object} user : user data
   * @return {object} user : user data update with id and signup date
   */
  static async signUp(user) {
    try {
      validateFields(user);
      return await UserRepository.insert(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * User login
   * @param {object} user : user with username and password
   * @return {object} token with user information
   */
  static async login(user) {
    try {
      const loggedUser = await UserRepository.login(user);
      if (loggedUser) {
        const token = jwt.sign(
          { id: loggedUser._id },
          process.env.TOKEN_SECRET,
          {
            expiresIn: 86400, // expires in 24 hours
          }
        );
        return { auth: true, token: token, user: loggedUser };
      } else {
        throw new ApplicationError();
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Find user by id
   * @param {int} id : user id to look for
   * @return {object} user : found user
   */
  static async findOne(id) {
    try {
      const user = await UserRepository.findOne(id);
      if (user) {
        return user;
      }
      throw ApplicationError();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Find user by username
   * @param {string} username : username to look for
   * @return {object} user : user data
   */
  static async findOneByUsername(username) {
    try {
      const user = await UserRepository.findOneByUsername(username);
      if (user) {
        return user;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user data if has valid information
   * @param {user} user : user data
   * @return {json} user : updated user data
   */
  static async update(user) {
    try {
      validateFields(user);
      return await UserRepository.update(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Delete user by id
   * @param {string} id : user id to delete
   * @return {json} message : confirmation
   */
  static async delete(id) {
    try {
      return await UserRepository.deleteOne(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

/**
 * Validate user email
 * @param user : user data
 * @return validation : objection with validation result
 */
function validateFields(user) {
  const validation = {};
  validation.valid = true;
  if (!user.username || user.username.length < 3) {
    validation.username = "Username is invalid.";
    validation.valid = false;
  }
  if (!user.alias || user.alias.length < 3) {
    validation.alias = "Alias is invalid.";
    validation.valid = false;
  }
  if (!user.password || user.password.length < 8) {
    validation.password = "Password is invalid.";
    validation.valid = false;
  }
  validateEmail(user.email, validation);
  if (!validation.valid) {
    throw new UserError(validation);
  }
  return validation;
}

/**
 * Validate user email
 * @param email : user email
 * @param validation : objection with validation data
 */
function validateEmail(email, validation) {
  if (!email) {
    validation.email = "You must specify your e-mail.";
    valid = false;
    validation.valid = false;
  } else if (!email.match(/^.*@.*\..*$/)) {
    validation.email = "Invalid email.";
    validation.valid = false;
  }
}

module.exports = UserService;
