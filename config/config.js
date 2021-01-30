const mongoose = require("mongoose");

class Configuration {
  static start() {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }
}

module.exports = Configuration;
