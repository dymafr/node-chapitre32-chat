const { Namespace } = require("../database/models");

exports.getNamespaces = () => {
  return Namespace.find({}).exec();
};
