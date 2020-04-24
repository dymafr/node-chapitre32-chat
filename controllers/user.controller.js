const { createUser } = require("../queries/user.queries");

exports.userNew = (req, res, next) => {
  res.render("signup", { error: null });
};

exports.userCreate = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await createUser(body);
    req.login(user);
    res.redirect("/");
  } catch (e) {
    res.render("signup", { error: e.message });
  }
};
