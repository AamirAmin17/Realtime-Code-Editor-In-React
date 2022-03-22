const express = require("express");
const app = express();
const http = require("http");
//nodeJs Server
const server = http.createServer(app);

//socket.io Server
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`Socket connect ${socket.id}`);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
