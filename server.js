const express = require("express");
const app = express();
const http = require("http");
const Actions = require("./src/constants/actions/Actions");
//nodeJs Server
const server = http.createServer(app);
//socket.io Server
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log(`Socket connected ${socket.id}`);

  socket.on(Actions.JOIN, ({ roomId, username }) => {
    console.log("username", username);
    userSocketMap[roomId] = username;
    socket.join(roomId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
