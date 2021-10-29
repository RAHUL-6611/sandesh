import { Server } from "socket.io";

const io = new Server({
  // cors : "*", "http://localhost",
  cors: {
    origin: "http://localhost:3000"
  },
});

let onlineUsers = [];
const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
  onlineUsers.push({ username, socketId });
};

console.log(onlineUsers);

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

// js find method recheck
const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });

  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });

  socket.on("sendText", ({ senderName, receiverName, text }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getText", {
      senderName,
      text,
    });
  });

  // remove user on disconnection
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(443);

// port 500 failed
// port 80 failed
// port 443 passed