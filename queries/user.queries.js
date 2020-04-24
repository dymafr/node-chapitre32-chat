const { User } = require("../database/models");

exports.createUser = async (body) => {
  try {
    const hashedPassword = await User.hashPassword(body.password);
    const user = new User({
      username: body.username,
      local: {
        email: body.email,
        password: hashedPassword,
      },
    });
    return user.save();
  } catch (e) {
    throw e;
  }
};

exports.findUserPerEmail = (email) => {
  return User.findOne({ "local.email": email }).exec();
};

exports.findUserPerId = (id) => {
  return User.findOne({ _id: id }).exec();
};
