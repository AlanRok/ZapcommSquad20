import { io } from "socket.io-client";

// Substitua 'http://localhost:3000' pelo URL do seu servidor Socket.IO
const socket = io("http://localhost:3000", {
  transports: ["websocket"], // Define como o WebSocket deve ser usado
});

socket.on("connect", () => {
  console.log("Conectado ao servidor Socket.IO!");
});

socket.on("disconnect", () => {
  console.log("Desconectado do servidor Socket.IO!");
});

export default socket;
