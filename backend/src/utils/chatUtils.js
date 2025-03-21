const { getIo, users } = require("../socket");

const sendSystemMessage = (roomId, participants, message) => {
  const io = getIo();

  io.to(roomId).emit("newMessage", message);

  for (const participant of participants) {
    const user = users.get(participant.email);

    if (user?.socketId) {
      io.to(user.socketId).emit("newMessageNotification", message);
    }
  }
};

module.exports = { sendSystemMessage };
