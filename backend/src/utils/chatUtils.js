const { getIo } = require("../socket");

const sendSystemMessage = (roomId, message) => {
  const io = getIo();

  io.to(roomId).emit("newMessage", message);
};

module.exports = { sendSystemMessage };
