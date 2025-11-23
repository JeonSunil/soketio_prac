// const express = require('express');
// // ? express 애플리케이션 사용하겠다 선언
// const app = express();
// // ? app이라는 변수에 express 애플리케이션을 할당
// const http = require('http');
// // ? http 모듈을 사용하겠다 선언
// const server = http.createServer(app);
// // ? http 서버를 생성하고, express 애플리케이션을 전달
// const { Server } = require('socket.io');
// // HTTP 서버에 Socket.IO를 연결합니다.
// const io = new Server(server); 

// // 클라이언트에게 제공할 정적 HTML 파일을 설정합니다.
// // 이 부분은 3단계에서 사용할 파일 경로입니다.
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html'); 
// });

// // Socket.IO 연결 처리
// // ! 이전 코드
// // io.on('connection', (socket) => {
// //   console.log('A user connected');

// //   // 연결이 끊어졌을 때
// //   socket.on('disconnect', () => {
// //     console.log('User disconnected');
// //   });
// // });

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // 클라이언트로부터 'chat message' 이벤트 수신
//   socket.on('chat message', (msg) => {
//     console.log('Message received: ' + msg);
//     // 수신한 메시지를 모든 연결된 클라이언트에게 전송 (나를 포함)
//     io.emit('chat message', msg); 
//   });
  
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// // 서버를 3000번 포트로 열어줍니다.
// server.listen(3000, () => {
//   console.log('Listening on http://localhost:3000');
// });

// index.js (서버 파일)

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); 
});

// Socket.IO 연결 처리
io.on('connection', (socket) => {
  // 'userNickname' 변수는 소켓에 닉네임이 저장되기 전의 기본값을 제공합니다.
  let userNickname = '익명'; 

  // 1. 클라이언트로부터 닉네임 수신 ('new user' 이벤트 리스너)
  socket.on('new user', (nickname) => {
    // 해당 소켓 객체에 닉네임 저장
    socket.nickname = nickname; 
    userNickname = nickname; // 임시 변수 업데이트

    console.log(`User connected: ${socket.nickname}`);
    // 모든 클라이언트에게 접속 알림 전파
    io.emit('user notification', `${socket.nickname}님이 접속했습니다.`); 
  });

  // 2. 클라이언트로부터 메시지 수신 ('chat message' 이벤트 리스너)
  socket.on('chat message', (msg) => {
    // 저장된 닉네임을 메시지 앞에 붙입니다.
    const messageWithNickname = `${socket.nickname || '익명'}: ${msg}`;
    
    console.log('Message received: ' + messageWithNickname);
    
    // 모든 클라이언트에게 닉네임을 붙여서 전파
    io.emit('chat message', messageWithNickname); 
  });
  
  // 3. 연결이 끊어졌을 때
  socket.on('disconnect', () => {
    // 닉네임이 설정된 경우에만 퇴장 메시지 전송
    if (socket.nickname) {
        console.log(`User disconnected: ${socket.nickname}`);
        io.emit('user notification', `${socket.nickname}님이 퇴장했습니다.`);
    } else {
        console.log('User disconnected (no nickname)');
    }
  });
});

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});