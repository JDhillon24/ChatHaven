const { getIo, users } = require("../socket");

const sendSystemMessage = (roomId, participants, message) => {
  const io = getIo();

  io.to(roomId).emit("newMessage", message);

  for (const participant of participants) {
    const socketId = [...users.entries()].find(
      ([_, id]) => id === participant.email
    )?.[0];

    if (socketId) {
      io.to(socketId).emit("newMessageNotification", message);
    }
  }
};

module.exports = { sendSystemMessage };
