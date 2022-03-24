const express = require("express");
const app = express();
const http = require("http");

//nodeJs Server
const server = http.createServer(app);
//socket.io Server
const { Server } = require("socket.io");
const cors = require("cors");
const Actions = require("./ActionsServer");
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}
//socket.io logic

io.on("connection", (socket) => {
  console.log(`Socket connected ${socket.id}`);
  socket.on(Actions.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    console.log(clients);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(Actions.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  //Listening code change event
  socket.on(Actions.CODE_CHANGE, ({ roomId, code }) => {
    //sending the same named event to client with code value
    socket.in(roomId).emit(Actions.CODE_CHANGE, {
      code,
    });
  });

  socket.on(Actions.SYNC_CODE, ({ code, socketId }) => {
    io.to(socketId).emit(Actions.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(Actions.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
