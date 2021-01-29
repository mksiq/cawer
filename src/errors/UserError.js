const ApplicationError = require('./ApplicationError');

class UserError extends ApplicationError{
  constructor(message) {
    super(message, 400);
    this.error = UserError.name;
  }
}

module.exports = UserError;