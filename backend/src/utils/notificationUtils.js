const { getIo, users } = require("../socket");

const sendNotification = (email, notification) => {
  const io = getIo();
  const socketId = [...users.entries()].find(([_, id]) => id === email)?.[0];

  if (socketId) {
    io.to(socketId).emit("notification", notification);
  }
};

module.exports = { sendNotification };
