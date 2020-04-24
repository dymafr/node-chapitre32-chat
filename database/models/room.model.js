const mongoose = require("mongoose");
const schema = mongoose.Schema;

const roomSchema = schema({
  index: Number,
  namespace: { type: schema.Types.ObjectId, ref: "namespace" },
  title: String,
});

const Room = mongoose.model("room", roomSchema);

module.exports = Room;
