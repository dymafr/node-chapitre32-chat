const mongoose = require("mongoose");
const schema = mongoose.Schema;

const namespaceSchema = schema({
  imgUrl: String,
});

const Namespace = mongoose.model("namespace", namespaceSchema);

module.exports = Namespace;
