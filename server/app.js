// server/app.js
const express = require('express');
const http = require('http');
const initializeSocketServer = require('./socketServer');

const cors = require('cors');
const app = express();

// Utilisation du middleware CORS
app.use(cors());
const server = http.createServer(app);

// Initialisation du serveur WebSocket
const io = initializeSocketServer(server);

// Autres configurations et middlewares ici...

// Démarrage du serveur
const PORT = process.env.PORT || 8443;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
