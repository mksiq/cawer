const UserError = require("../errors/UserError");
const UserRepository = require("../repository/userRepository");

class UserService {
  constructor() {
    this.userRepository = userRepository;
  }

  static async signUp(user) {
    try {
      validateFields(user);
      return await UserRepository.insert(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async login(user) {
    try {
      return await UserRepository.login(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

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

// Validations functions
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
