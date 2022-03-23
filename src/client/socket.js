import { io } from "socket.io-client";

export const initSocket = async () => {
  // const options = {
  //   "force new connection": true,
  //   reconnectionAttempt: "Infinity",
  //   timeout: 10000,
  //   transport: ["websocket"],
  //   withCredentials: true,
  //   extraHeaders: {
  //     "my-custom-header": "abcd",
  //   },
  // };
  const socket = io.connect(import.meta.env.VITE_APP_BACKEND_URL);
  return socket;
};
