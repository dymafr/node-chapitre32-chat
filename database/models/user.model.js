const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongoose.Schema;

const userSchema = schema({
  local: {
    email: { type: String, required: true, unique: true },
    password: { type: String },
  },
  username: String,
});

userSchema.statics.hashPassword = async (password) => {
  try {
    return bcrypt.hash(password, 12);
  } catch (e) {
    throw e;
  }
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.local.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
