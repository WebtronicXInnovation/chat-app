const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

io.on("connection", socket => {
  console.log("a user connected");

  socket.on("user joined", username => {
    socket.username = username;
    io.emit("user joined", username);
  });

  socket.on("chat message", data => {
    io.emit("chat message", data);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("user left", socket.username);
    }
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
