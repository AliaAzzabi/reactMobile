require('dotenv').config()
const http = require('http');
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const { router } = require("./routes")
const socketIo = require('socket.io');

const app = express()
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Un client est connecté.');

  socket.on('sendNotification', (data) => {
      io.emit('receiveNotification', data); 
  });
});


// Middleware
app.use(express.json())
app.use("/", router)

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// Routes
app.use('/api/user', userRoutes)

// Set Mongoose `strictQuery` option to handle deprecation warning
mongoose.set('strictQuery', false) // Set this based on your preference

// Connect to the database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`connected to db & listening on port ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.error('Database connection error:', error)
  })

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
