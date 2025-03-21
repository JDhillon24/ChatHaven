const { getIo, users } = require("../socket");

const sendNotification = (email, notification) => {
  // console.log(email);
  const io = getIo();
  const user = users.get(email);

  if (user?.socketId) {
    // console.log("id found!");
    io.to(user.socketId).emit("notification", notification);
  }
};

module.exports = { sendNotification };
