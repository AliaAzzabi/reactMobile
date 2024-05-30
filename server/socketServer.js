const { Server } = require("socket.io");

function initializeSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Un client est connecté.");

    socket.on("sendNotification", (data) => {
        console.log('Reçu une demande de notification :', data);
      io.emit("receiveNotification", data);
    });
  });

  return io;
}

module.exports = initializeSocketServer;
