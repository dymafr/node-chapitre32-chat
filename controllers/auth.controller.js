const { findUserPerEmail } = require("../queries/user.queries");

exports.signinForm = (req, res, next) => {
  res.render("signin", { error: null });
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserPerEmail(email);
    if (user) {
      const match = await user.comparePassword(password);
      if (match) {
        req.login(user);
        res.redirect("/");
      } else {
        res.render("signin", { error: "Wrong password" });
      }
    } else {
      res.render("signin", { error: "User not found" });
    }
  } catch (e) {
    next(e);
  }
};

exports.signout = (req, res, next) => {
  req.logout();
  res.redirect("/");
};
