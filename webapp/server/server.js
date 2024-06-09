require('dotenv').config()
const http = require('http');
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const { router } = require("./routes");

const socketIo = require('socket.io');
// express app
const app = express()
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Un client est connecté.');
  
  socket.on('sendNotification', (data) => {
    io.emit('receiveNotification', data); 
  });
});
app.use('/uploads', express.static('public/uploads'));
// middleware
app.use(express.json())
app.use("/", router);

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/user', userRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })