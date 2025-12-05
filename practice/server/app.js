const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/../'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../index.html');
});


server.listen(3000, () => {
  console.log('http://localhost:3000 실행 중');
});

io.on('connection', (socket) => {
  console.log('사용자 접속');

io.on('disconnect', () => {
  console.log('접속 해제');
})

})