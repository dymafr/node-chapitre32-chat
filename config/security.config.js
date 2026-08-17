const cookieParser = require("cookie");
const { decodeJwtToken } = require("./jwt.config");
const { findUserPerId } = require("../queries/user.queries");

// Le premier argument de la fonction de rappel n'est pas un code HTTP mais un
// code d'erreur du protocole. 4 signifie « interdit » et fait répondre 403 ;
// n'importe quelle autre valeur fait répondre 400 avec un message vide.
const INTERDIT = 4;
const REQUETE_INVALIDE = 3;

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/signin/form");
  }
};

exports.ensureAuthenticatedOnSocketHandshake = async (request, success) => {
  try {
    const cookies = cookieParser.parse(request.headers.cookie || "");
    if (cookies && cookies.jwt) {
      const decodedToken = decodeJwtToken(cookies.jwt);
      const user = await findUserPerId(decodedToken.sub);
      if (user) {
        request.user = user;
        success(null, true);
      } else {
        success(REQUETE_INVALIDE, false);
      }
    } else {
      success(INTERDIT, false);
    }
  } catch (e) {
    success(INTERDIT, false);
  }
};
