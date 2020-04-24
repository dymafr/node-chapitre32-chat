const mongoose = require("mongoose");
const schema = mongoose.Schema;

const messageSchema = schema(
  {
    type: { type: String, enum: ["text", "image", "file"], default: "text" },
    data: String,
    author: { type: schema.Types.ObjectId, ref: "user" },
    authorName: String,
    room: { type: schema.Types.ObjectId, ref: "room" },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

module.exports = Message;
