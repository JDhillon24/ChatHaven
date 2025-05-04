const { getIo, users } = require("../socket");

// function to send a notification to a specific user within the map
const sendNotification = (email, notification) => {
  const io = getIo();
  const user = users.get(email);

  if (user?.socketId) {
    io.to(user.socketId).emit("notification", notification);
  }
};

module.exports = { sendNotification };
