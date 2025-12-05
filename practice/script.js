const socket = io();

socket.on('connect', () => {
  console.log('클라이언트가 Socket.IO 서버에 성공적으로 연결되었습니다.');
});

