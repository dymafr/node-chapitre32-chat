// Ce secret signe tous les jetons : qui le connaît peut en fabriquer un
// valide pour n'importe quel utilisateur. Il vient donc de l'environnement.
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const { findUserPerId } = require("../queries/user.queries");
const { app } = require("../app");

// Le cookie qui porte le jeton doit être posé avec ces trois options :
// httpOnly le rend invisible au JavaScript de la page, sameSite l"empêche de
// partir avec une requête venue d"un autre site, et secure lui interdit de
// circuler en clair en production.
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const createJwtToken = ({ user = null, id = null }) => {
  const jwtToken = jwt.sign(
    {
      sub: id || user._id.toString(),
      exp: Math.floor(Date.now() / 1000) + 60,
    },
    secret
  );
  return jwtToken;
};

exports.createJwtToken = createJwtToken;

const checkExpirationToken = (token, res) => {
  const tokenExp = token.exp;
  const nowInSec = Math.floor(Date.now() / 1000);
  if (nowInSec <= tokenExp) {
    return token;
  } else if (nowInSec > tokenExp && nowInSec - tokenExp < 60 * 60 * 24) {
    const refreshedToken = createJwtToken({ id: token.sub });
    res.cookie("jwt", refreshedToken, cookieOptions);
    return jwt.decode(refreshedToken);
  } else {
    throw new Error("token expired");
  }
};

const decodeJwtToken = (token) => {
  return jwt.verify(token, secret);
};

exports.decodeJwtToken = decodeJwtToken;

const extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      let decodedToken = jwt.verify(token, secret, {
        ignoreExpiration: true,
      });
      decodedToken = checkExpirationToken(decodedToken, res);
      const user = await findUserPerId(decodedToken.sub);
      if (user) {
        req.user = user;
        next();
      } else {
        res.clearCookie("jwt", cookieOptions);
        res.redirect("/");
      }
    } catch (e) {
      res.clearCookie("jwt", cookieOptions);
      res.redirect("/");
    }
  } else {
    next();
  }
};

const addJwtFeatures = (req, res, next) => {
  req.isAuthenticated = () => !!req.user;
  req.logout = () => res.clearCookie("jwt", cookieOptions);
  req.login = (user) => {
    const token = createJwtToken({ user });
    res.cookie("jwt", token, cookieOptions);
  };
  next();
};

app.use(extractUserFromToken);
app.use(addJwtFeatures);
