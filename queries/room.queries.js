const { Room } = require("../database/models");

exports.findRoomPerNamespaceId = (namespaceId) => {
  return Room.find({ namespace: namespaceId }).sort({ index: 1 }).exec();
};
