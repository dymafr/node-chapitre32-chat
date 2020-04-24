const { Message } = require("../database/models");

exports.findMessagesPerRoomId = (roomId) => {
  return Message.find({ room: roomId }).sort({ createdAt: 1 }).exec();
};

exports.createMessage = (message) => {
  const newMessage = new Message(message);
  return newMessage.save();
};
