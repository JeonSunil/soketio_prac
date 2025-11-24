const express = require('express');
const app = express();
// * app이라는 변수에 express 모듈을 할당함. 
// * 이는 express라고 길게 적기보다 app으로 간단히 적을 수도 있으면서 웹 애플리케이션에 더 어울리는 변수명이라 생각되어 변수 지정.
const http = require('http');
const server = http.createServer(app);
// * http 에서 서버를 생성, app을 인자로 사용해 express 애플리케이션을 서버에 연결.
const { Server } = require("socket.io");
// * 여기서 { Server }는 socket.io 모듈에 내장 되어있는 클래스이다. 
const io = new Server(server); 
// * io 변수에 Server 클래스를 할당하고, server를 인자로 전달하여 소켓 서버를 생성.
// ? 여기까지 사용할 모듈들을 정의하는 부분

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); 
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});