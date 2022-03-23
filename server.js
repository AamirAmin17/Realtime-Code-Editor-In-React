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
  console.log(io.sockets.adapter.rooms.get(roomId));
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[roomId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log(`Socket connected ${socket.id}`);
  socket.on(Actions.JOIN, ({ roomId, username }) => {
    userSocketMap[roomId] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    console.log("clients", clients);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
