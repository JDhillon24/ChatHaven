const { getIo, users } = require("../socket");

const sendNotification = (email, notification) => {
  // console.log(email);
  const io = getIo();
  const socketId = [...users.entries()].find(([_, id]) => id === email)?.[0];

  if (socketId) {
    // console.log("id found!");
    io.to(socketId).emit("notification", notification);
  }
};

module.exports = { sendNotification };
