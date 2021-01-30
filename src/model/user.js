/**
 * Base class for User
 */
class User {
    constructor(username, alias, password, email) {
        this._id = "";
        this.username = username;
        this.alias = alias;
        this.password = password;
        this.email = email;
        this.createdAt = "";
        this.notBanned = true;
    }
}

module.exports = User;