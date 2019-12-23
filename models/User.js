const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

function toLower(str) {
  return str.toLowerCase();
}

// mongo db user schema
const UserSchema = new mongoose.Schema({
  userHandle: { type: String, set: toLower, required: true, unique: true },
  email: { type: String, set: toLower, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now() }
});

module.exports = User = mongoose.model(
  "user",
  UserSchema.plugin(uniqueValidator)
);
