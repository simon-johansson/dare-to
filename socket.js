
const fs = require('fs');
const socketio = require('socket.io');
const idgen = require('idgen');
const db = require('./db');
// const questions = require('./questions');
const isDeveloping = process.env.NODE_ENV !== 'production';
let io;

const onConnection = socket => {
  // io.emit('clients', {
  //   clients: Object.keys(io.clients().sockets).length
  // });

  socket.on('contribution', (data, callback) => {
    callback();

    // db.insert({
    //   name: data.team.name,
    //   img: data.team.image ? id + '.jpg' : null,
    //   score: score,
    //   punchout: data.punchout
    // });

    io.emit('new contribution', data);
  });

  // socket.on('clean', (data, callback) => {
  //   db.remove(() => {
  //     callback();
  //   });
  // });
};

const init = server => {
  io = socketio(server);
  io.on('connection', onConnection);
  return io;
};

module.exports = {init};
