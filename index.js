const app = require('./src/app');
const mongoose = require('mongoose');
require('dotenv').config();
const socket = require('socket.io');

// const { PORT, MONGO_URI } = process.env;
const MONGO_URI =
  'mongodb+srv://JonatanValdiviezo:43486277Mb@cluster0.n8469sx.mongodb.net/jonatan?retryWrites=true&w=majority';
const PUERTO = process.env.PORT || 4000;
const main = async () => {
  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const server = app.listen(PUERTO);
    const io = socket(server, {
      cors: {
        origin:
          'https://63690afa26363238445dac91--merry-caramel-4aa6e0.netlify.app/',
        credentials: true,
      },
    });
    global.onlineUsers = new Map();

    io.on('connection', (socket) => {
      global.chatSocket = socket;
      socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
      });
      socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit('msg-recieve', data.message);
        }
      });
    });

    console.log(`Server started on PORT ${PORT} DB connection successfull `);
  } catch (error) {
    return console.log(`ERROR db app.js ${error.message}`);
  }
};

main();
