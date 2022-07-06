const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

let chatters = {};

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


// Socket
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (user) => {
    chatters[socket.id] = user;
    let value = Object.values(chatters);
    socket.broadcast.emit("join", chatters[socket.id]);
  });

  socket.on("message", (object) => {
    socket.broadcast.emit("message", object);
  });
  socket.on("disconnect", (obj) => {
    socket.broadcast.emit("left", chatters[socket.id]);
    delete chatters[socket.id];
  });
  socket.on("type", (value) => {
    socket.broadcast.emit("type", value);
  });
});
app.get("/", (req, res) => {
  res.add;
  res.json(chatters);
});
