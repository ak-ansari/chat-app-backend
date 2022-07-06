const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


// Socket
let chatters = {};
let first;
let second;
let third;
let allUsers={one:{},two:{},three:{}}
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    if(data.room==='one'){
      allUsers.one[socket.id]=data.user
      
    }
    if(data.room==='two'){
      allUsers.two[socket.id] = data.user;
    }
    if (data.room === "three") {
      allUsers.three[socket.id] = data.user;
    }
   

    chatters[socket.id] = data.user;
    socket.join(data.room);

    socket.broadcast.to(data.room).emit("join", chatters[socket.id]);
  });

  socket.on("message", (object) => {
    socket.broadcast.to(object.room).emit("message", object);
  });
  socket.on("disconnect", (obj) => {
    if(allUsers.one[socket.id]){
      socket.broadcast.to('one').emit('left',chatters[socket.id]);
    }
    if (allUsers.two[socket.id]) {
      socket.broadcast.to("two").emit("left", chatters[socket.id]);
    }
    if (allUsers.three[socket.id]) {
      socket.broadcast.to("three").emit("left", chatters[socket.id]);
    }
    
    delete chatters[socket.id];
    
    delete allUsers.one[socket.id];
    delete allUsers.two[socket.id];
    delete allUsers.three[socket.id];
    
  });
  socket.on("type", (value) => {
    socket.broadcast.to(value.room).emit("type", value);
  });
});
app.get("/", (req, res) => {
  res.json(allUsers);
});
