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

// ! 여기까지 기존 코드

// // index.js (서버 파일)

// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server); 

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html'); 
// });

// // Socket.IO 연결 처리
// io.on('connection', (socket) => {
//   // 'userNickname' 변수는 소켓에 닉네임이 저장되기 전의 기본값을 제공합니다.
//   let userNickname = '익명'; 

//   // 1. 클라이언트로부터 닉네임 수신 ('new user' 이벤트 리스너)
//   socket.on('new user', (nickname) => {
//     // 해당 소켓 객체에 닉네임 저장
//     socket.nickname = nickname; 
//     userNickname = nickname; // 임시 변수 업데이트

//     console.log(`User connected: ${socket.nickname}`);
//     // 모든 클라이언트에게 접속 알림 전파
//     io.emit('user notification', `${socket.nickname}님이 접속했습니다.`); 
//   });

//   // 2. 클라이언트로부터 메시지 수신 ('chat message' 이벤트 리스너)
//   socket.on('chat message', (msg) => {
//     // 저장된 닉네임을 메시지 앞에 붙입니다.
//     const messageWithNickname = `${socket.nickname || '익명'}: ${msg}`;
    
//     console.log('Message received: ' + messageWithNickname);
    
//     // 모든 클라이언트에게 닉네임을 붙여서 전파
//     io.emit('chat message', messageWithNickname); 
//   });
  
//   // 3. 연결이 끊어졌을 때
//   socket.on('disconnect', () => {
//     // 닉네임이 설정된 경우에만 퇴장 메시지 전송
//     if (socket.nickname) {
//         console.log(`User disconnected: ${socket.nickname}`);
//         io.emit('user notification', `${socket.nickname}님이 퇴장했습니다.`);
//     } else {
//         console.log('User disconnected (no nickname)');
//     }
//   });
// });

// server.listen(3000, () => {
//   console.log('Listening on http://localhost:3000');
// });

// ! 여기까지 2차 코드 (닉네임 설정)

// index.js (서버 파일)

// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// // 🚨 최대 접속 인원 설정
// const MAX_USERS = 2; 

// // 현재 닉네임을 설정하고 채팅방에 입장한 인원을 세어 모든 클라이언트에 브로드캐스트하는 함수
// function broadcastUserCount() {
//     let connectedUsers = 0;
    
//     // 현재 연결된 모든 소켓을 순회하며 nickname 속성이 있는 소켓(채팅방 입장 사용자)만 카운트
//     io.sockets.sockets.forEach(socket => {
//         if (socket.nickname) {
//             connectedUsers++;
//         }
//     });
    
//     // 'update user count' 이벤트로 현재 인원/최대 인원 정보 전파
//     io.emit('update user count', `${connectedUsers}/${MAX_USERS}`);
// }

// // HTML 파일 제공 (이전과 동일)
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html'); 
// });

// // Socket.IO 연결 처리
// io.on('connection', (socket) => {
//     console.log('A new socket connected.');
    
//     // 1. 소켓 연결 시 현재 인원 상태 전송 (닉네임 설정 전 상태)
//     broadcastUserCount();

//     // 2. 닉네임 수신 및 접속 허용/거부 로직 (콜백 함수 사용)
//     socket.on('new user', (nickname, callback) => {
//         // 이미 닉네임이 설정된 사용자라면 무시
//         if (socket.nickname) {
//             return callback({ success: false, reason: "이미 등록된 사용자입니다." });
//         }
        
//         // 현재 채팅방 입장 인원 카운트
//         let currentInChatUsers = 0;
//         io.sockets.sockets.forEach(s => {
//             if (s.nickname) {
//                 currentInChatUsers++;
//             }
//         });
        
//         // 정원 초과 검사
//         if (currentInChatUsers >= MAX_USERS) {
//             // 🚨 정원 초과 시 클라이언트에 실패 응답 전송
//             console.log(`Connection refused: ${nickname} (Capacity full)`);
//             return callback({ success: false, reason: "정원이 다 찼습니다." });
//         }

//         // ✅ 접속 허용 및 닉네임 설정
//         socket.nickname = nickname;
        
//         console.log(`User accepted: ${socket.nickname}`);
        
//         // 1. 모든 클라이언트에게 접속 알림 전파
//         io.emit('user notification', `${socket.nickname}님이 접속했습니다.`);
//         // 2. 접속자 수 업데이트 브로드캐스트
//         broadcastUserCount();
//         // 3. 클라이언트에게 성공 응답 전송
//         callback({ success: true });
//     });

//     // 3. 채팅 메시지 처리 (이전과 동일)
//     // socket.on('chat message', (msg) => {
//     //     if (!socket.nickname) return;
        
//     //     const messageWithNickname = `${socket.nickname}: ${msg}`;
//     //     io.emit('chat message', messageWithNickname);
//     // });
//     socket.on('chat message', (msg) => {
//     if (!socket.nickname) return;
    
//     // 🚨 현재 서버 시간을 가져옵니다.
//     const now = new Date();
    
//     // 시간 정보를 포함한 메시지 객체 생성
//     const messageData = {
//         nickname: socket.nickname,
//         text: msg,
//         timestamp: now.toISOString() // ISO 형식으로 시간을 문자열로 변환하여 전송
//     };
    
//     console.log('Message received:', messageData);
    
//     // 모든 클라이언트에게 메시지 객체 전송
//     io.emit('chat message', messageData); 
// });
  
//     // 4. 연결 끊김 처리
//     socket.on('disconnect', () => {
//         if (socket.nickname) {
//             console.log(`User disconnected: ${socket.nickname}`);
//             // 1. 모든 클라이언트에게 퇴장 알림 전파
//             io.emit('user notification', `${socket.nickname}님이 퇴장했습니다.`);
//             // 2. 접속자 수 업데이트 브로드캐스트
//             broadcastUserCount();
//         } else {
//             console.log('A user disconnected (pre-registered).');
//         }
//     });
// });

// server.listen(3000, () => {
//   console.log('Listening on http://localhost:3000');
// });

// ! 여기까지 3차 코드 (최대 접속 인원 제한 및 접속 거부 기능)

// app.js

// 1. 필수 모듈 로드 및 초기화
// require('dotenv').config(); 
// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// // Gemini SDK는 환경 변수(GEMINI_API_KEY)를 자동으로 인식하도록 초기화
// const { GoogleGenAI } = require('@google/genai');
// const ai = new GoogleGenAI({}); 

// // 모델 이름 상수 정의
// const GEMINI_MODEL = "gemini-2.5-flash";

// // 🚨 접속 인원 설정
// const MAX_USERS = 2; 

// // 현재 채팅방 입장 인원을 계산하여 모든 클라이언트에게 전파
// function broadcastUserCount() {
//     let connectedUsers = 0;
//     io.sockets.sockets.forEach(socket => {
//         if (socket.nickname) {
//             connectedUsers++;
//         }
//     });
//     io.emit('update user count', `${connectedUsers}/${MAX_USERS}`);
// }

// // HTML 파일 제공
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html'); 
// });

// // Socket.IO 연결 처리
// io.on('connection', (socket) => {
//     console.log('A new socket connected.');
    
//     broadcastUserCount();

//     // 2. 닉네임 수신 및 접속 허용/거부 로직
//     socket.on('new user', (nickname, callback) => {
//         if (socket.nickname) {
//             return callback({ success: false, reason: "이미 등록된 사용자입니다." });
//         }
        
//         let currentInChatUsers = 0;
//         io.sockets.sockets.forEach(s => {
//             if (s.nickname) { currentInChatUsers++; }
//         });
        
//         // 정원 초과 검사
//         if (currentInChatUsers >= MAX_USERS) {
//             console.log(`Connection refused: ${nickname} (Capacity full)`);
//             return callback({ success: false, reason: "정원이 다 찼습니다." });
//         }

//         // 접속 허용 및 닉네임 설정
//         socket.nickname = nickname;
//         console.log(`User accepted: ${socket.nickname}`);
        
//         io.emit('user notification', `${socket.nickname}님이 접속했습니다.`);
//         broadcastUserCount();
//         callback({ success: true });
//     });

//     // 3. 채팅 메시지 및 챗봇 처리
//     socket.on('chat message', async (msg) => {
//         if (!socket.nickname) return;
        
//         // 일반 채팅 메시지 처리 (시간 포함)
//         const now = new Date();
//         const messageData = {
//             nickname: socket.nickname,
//             text: msg,
//             timestamp: now.toISOString()
//         };
//         io.emit('chat message', messageData); 
        
        
//         // 🚨 챗봇 호출 감지 및 Gemini API 사용
//         if (msg.startsWith('@챗봇 ')) {
//             const query = msg.substring(5).trim();
//             console.log(`[Gemini Query] from ${socket.nickname}: ${query}`);
            
//             let botResponseText;
//             try {
//                 // Gemini API 호출 (ai.generateContent 사용)
//                 const response = await ai.generateContent({ 
//                     model: GEMINI_MODEL,
//                     contents: [
//                         { role: "user", parts: [{ text: query }] }
//                     ]
//                 });

//                 botResponseText = response.text || "죄송합니다. 답변을 생성하지 못했습니다.";
                
//             } catch (error) {
//                  botResponseText = "죄송합니다. 챗봇 서비스 호출에 문제가 발생했습니다.";
//                  console.error("Gemini API Error:", error);
//             }

//             // 챗봇 메시지 데이터 전송
//             const botMessageData = {
//                 nickname: 'Gemini 챗봇',
//                 text: botResponseText,
//                 timestamp: new Date().toISOString()
//             };
//             io.emit('chat message', botMessageData);
//         }
//     });
  
//     // 4. 연결 끊김 처리
//     socket.on('disconnect', () => {
//         if (socket.nickname) {
//             console.log(`User disconnected: ${socket.nickname}`);
//             io.emit('user notification', `${socket.nickname}님이 퇴장했습니다.`);
//             broadcastUserCount();
//         } else {
//             console.log('A user disconnected (pre-registered).');
//         }
//     });
// });

// server.listen(3000, () => {
//   console.log('Listening on http://localhost:3000');
// });

// ! 여기까지 4차 코드 (Gemini 챗봇 연동)  

// // app.js (최종 ESM 및 모듈 로딩 우회 방식)

// // 1. 필수 모듈 로드 및 초기화 (ESM 방식)
// import 'dotenv/config'; 
// import express from 'express';
// import http from 'http';
// import { Server } from "socket.io";
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { GoogleGenAI } from "@google/genai";
// // 🚩 @google/genai 로딩 방식 수정 (모듈 로딩 충돌 우회)
// // import * as GoogleAILibrary from "@google/genai";
// // const GoogleGenAI = GoogleAILibrary.GoogleGenAI;


// const app = express();
// // 🚩 수정 완료: http.createServer(app)으로 수정되었는지 확인
// const server = http.createServer(app); 
// const io = new Server(server);

// // 🚨 API 키 확인
// const apiKey = process.env.GEMINI_API_KEY;

// if (!apiKey) {
//     console.error("FATAL ERROR: GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다. 서버를 종료합니다.");
//     process.exit(1); 
// }

// // 🚩 ai 객체 초기화 
// const ai = new GoogleGenAI({ apiKey: apiKey}); 
// const GEMINI_MODEL = "gemini-2.5-flash"; 

// // 🚨 접속 인원 설정
// const MAX_USERS = 2; 

// // 현재 채팅방 입장 인원을 계산하여 전파
// function broadcastUserCount() {
//     let connectedUsers = 0;
//     io.sockets.sockets.forEach(socket => {
//         if (socket.nickname) { connectedUsers++; }
//     });
//     io.emit('update user count', `${connectedUsers}/${MAX_USERS}`);
// }

// // HTML 파일 제공 (ESM 경로 설정)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html')); 
// });

// // Socket.IO 연결 처리
// io.on('connection', (socket) => {
//     console.log('A new socket connected.');
    
//     broadcastUserCount();

//     // 2. 닉네임 수신 및 정원 초과 확인 로직
//     socket.on('new user', (nickname, callback) => {
//         if (socket.nickname) return callback({ success: false, reason: "이미 등록된 사용자입니다." });
        
//         let currentInChatUsers = 0;
//         io.sockets.sockets.forEach(s => { if (s.nickname) { currentInChatUsers++; } });
        
//         if (currentInChatUsers >= MAX_USERS) {
//             return callback({ success: false, reason: "정원이 다 찼습니다." });
//         }

//         socket.nickname = nickname;
//         io.emit('user notification', `${socket.nickname}님이 접속했습니다.`);
//         broadcastUserCount();
//         callback({ success: true });
//     });

//     // 3. 채팅 메시지 및 챗봇 처리 로직
//     socket.on('chat message', async (msg) => {
//         if (!socket.nickname) return;
        
//         // 일반 채팅 메시지 처리 (시간 포함)
//         const now = new Date();
//         const messageData = { nickname: socket.nickname, text: msg, timestamp: now.toISOString() };
//         io.emit('chat message', messageData); 
        
        
//         // 🚨 챗봇 호출 감지 및 Gemini API 사용
//         if (msg.startsWith('@챗봇 ')) {
//             const query = msg.substring(4).trim();
//             let botResponseText;
            
//             // 쿼리 내용 없음 방지
//             if (query.length === 0) {
//                 botResponseText = "질문 내용을 입력해 주세요. (예: @챗봇 오늘 날씨)";
//             } else {
//                 try {
//                     // 🚩 핵심: ai.generateContent를 사용하여 모델을 직접 호출
//                     const response = await ai.models.generateContent({ 
//                         model: GEMINI_MODEL,
//                         // 쿼리는 객체 형태로 전달해야 함
//                         contents: [{ role: "user", parts: [{ text: query }] }]
//                     });
                    
//                     // 응답 텍스트 추출
//                     botResponseText = response.text || "답변을 생성하지 못했습니다.";
//                 } catch (error) {
//                      botResponseText = "죄송합니다. 챗봇 서비스 호출에 문제가 발생했습니다.";
//                      console.error("Gemini API Error:", error);
//                 }
//             }

//             // 챗봇 메시지 데이터 전송
//             const botMessageData = { nickname: 'Gemini 챗봇', text: botResponseText, timestamp: new Date().toISOString() };
//             io.emit('chat message', botMessageData);
//         }
//     });
  
//     // 4. 연결 끊김 처리
//     socket.on('disconnect', () => {
//         if (socket.nickname) {
//             io.emit('user notification', `${socket.nickname}님이 퇴장했습니다.`);
//             broadcastUserCount();
//         }
//     });
// });

// server.listen(3000, () => {
//   console.log('Listening on http://localhost:3000');
// });

// ! 여기까지 최종 5차 코드 (ESM 방식 및 모듈 로딩 우회)

// // app.js

// import 'dotenv/config'; 
// import express from 'express';
// import http from 'http';
// import { Server } from "socket.io";
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { GoogleGenAI } from "@google/genai";

// const app = express();
// const server = http.createServer(app); 
// const io = new Server(server);

// // API 키 확인 및 초기화 (생략)
// const apiKey = process.env.GEMINI_API_KEY;
// if (!apiKey) {
//     console.error("FATAL ERROR: GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다. 서버를 종료합니다.");
//     process.exit(1); 
// }
// const ai = new GoogleGenAI({ apiKey: apiKey}); 
// const GEMINI_MODEL = "gemini-2.5-flash"; 
// const MAX_USERS = 2; 

// // 🚩 챗봇 응답 무시 플래그 (접속자 0명 시 사용)
// // 이 플래그는 챗봇 호출 시작 시에만 'false'로 재설정되어야 합니다.
// let shouldIgnoreChatbotResponse = false; 

// function broadcastUserCount() {
//     let connectedUsers = 0;
//     io.sockets.sockets.forEach(socket => {
//         if (socket.nickname) { connectedUsers++; }
//     });
//     io.emit('update user count', `${connectedUsers}/${MAX_USERS}`);
//     return connectedUsers; 
// }

// // HTML 파일 제공 (생략)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html')); 
// });

// // Socket.IO 연결 처리
// io.on('connection', (socket) => {
//     console.log('A new socket connected.');
//     broadcastUserCount();

//     // 2. 닉네임 수신 및 정원 초과 확인 로직
//     socket.on('new user', (nickname, callback) => {
//         if (socket.nickname) return callback({ success: false, reason: "이미 등록된 사용자입니다." });
        
//         let currentInChatUsers = broadcastUserCount();
        
//         if (currentInChatUsers >= MAX_USERS) {
//             return callback({ success: false, reason: "정원이 다 찼습니다." });
//         }

//         socket.nickname = nickname;
//         io.emit('user notification', `${socket.nickname}님이 접속했습니다.`);
//         broadcastUserCount();
//         callback({ success: true });
        
//         // ❌ 이전 코드: 새로운 사용자 접속 시 플래그를 초기화하는 코드를 제거했습니다.
//         // shouldIgnoreChatbotResponse = false; 
//     });

//     // 3. 채팅 메시지 및 챗봇 처리 로직
//     socket.on('chat message', async (msg) => {
//         if (!socket.nickname) return;
        
//         const now = Date.now();
//         const messageData = { nickname: socket.nickname, text: msg, timestamp: now };
//         io.emit('chat message', messageData); 
        
        
//         if (msg.startsWith('@챗봇 ')) {
//             const query = msg.substring(4).trim();
//             let botResponseText;
            
//             // 🚀 핵심 수정: 챗봇 호출 시작 시에만 플래그를 'false'로 재설정합니다.
//             shouldIgnoreChatbotResponse = false; 
            
//             if (query.length === 0) {
//                 botResponseText = "질문 내용을 입력해 주세요. (예: @챗봇 오늘 날씨)";
//             } else {
//                 try {
//                     const response = await ai.models.generateContent({ 
//                         model: GEMINI_MODEL,
//                         contents: [{ role: "user", parts: [{ text: query }] }]
//                     });
                    
//                     botResponseText = response.text || "답변을 생성하지 못했습니다.";
                    
//                     // 🚀 Markdown 기호 제거 로직
//                     if (botResponseText) {
//                         botResponseText = botResponseText.replace(/\*\*/g, ''); 
//                         botResponseText = botResponseText.replace(/\*/g, '');
//                     }

//                 } catch (error) {
//                      botResponseText = "죄송합니다. 챗봇 서비스 호출에 문제가 발생했습니다.";
//                      console.error("Gemini API Error:", error);
//                 }
//             }

//             // 🚨 응답 전송 직전 플래그 확인 (접속자 0명일 때 응답 전송 차단)
//             if (shouldIgnoreChatbotResponse) {
//                 console.log("모든 사용자가 퇴장하여 챗봇 응답 전송을 취소합니다.");
//                 return; // 응답 전송 중단
//             }

//             // 챗봇 메시지 데이터 전송
//             const botMessageData = { 
//                 nickname: 'Gemini 챗봇', 
//                 text: botResponseText, 
//                 timestamp: Date.now() 
//             };
//             io.emit('chat message', botMessageData);
//         }
//     });
  
//     // 4. 연결 끊김 처리
//     socket.on('disconnect', () => {
//         if (socket.nickname) {
//             io.emit('user notification', `${socket.nickname}님이 퇴장했습니다.`);
            
//             // 접속 인원수 카운트 전 닉네임 삭제 (정확한 인원 계산)
//             delete socket.nickname; 
            
//             const currentInChatUsers = broadcastUserCount();
            
//             // 🚨 접속 인원이 0이면 플래그 설정
//             if (currentInChatUsers === 0) {
//                 console.log("모든 사용자가 퇴장했습니다. 챗봇 응답 무시 플래그 설정.");
//                 shouldIgnoreChatbotResponse = true;
//             }
//         }
//     });
// });

// server.listen(3000, () => {
//   console.log('Listening on http://localhost:3000');
// });
// ! 여기까지 6차 코드 (챗봇 응답 무시 플래그 추가)
// // app.js

// import 'dotenv/config'; 
// import express from 'express';
// import http from 'http';
// import { Server } from "socket.io";
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { GoogleGenAI } from "@google/genai";

// const app = express();
// const server = http.createServer(app); 
// const io = new Server(server);

// // API 키 확인 및 초기화
// const apiKey = process.env.GEMINI_API_KEY;
// if (!apiKey) {
//     console.error("FATAL ERROR: GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다. 서버를 종료합니다.");
//     process.exit(1); 
// }
// const ai = new GoogleGenAI({ apiKey: apiKey}); 
// const GEMINI_MODEL = "gemini-2.5-flash"; 

// // 🚩 방 정보 관리 객체: { [roomName]: { maxUsers: number, password?: string, currentUsers: { [socketId]: nickname } } }
// const rooms = {};

// // --- 헬퍼 함수 ---

// /**
//  * 방의 현재 상태를 클라이언트들에게 브로드캐스트합니다.
//  */
// function broadcastRoomList() {
//     const roomList = Object.entries(rooms).map(([name, room]) => ({
//         name: name,
//         current: Object.keys(room.currentUsers).length,
//         max: room.maxUsers,
//         hasPassword: !!room.password 
//     }));
//     io.emit('update room list', roomList);
// }

// /**
//  * 특정 방의 현재 접속자 수를 업데이트합니다.
//  * @param {string} roomName 
//  */
// function updateRoomUserCount(roomName) {
//     if (rooms[roomName]) {
//         const count = Object.keys(rooms[roomName].currentUsers).length;
//         io.to(roomName).emit('update room user count', `${count}/${rooms[roomName].maxUsers}`);
//         broadcastRoomList(); // 방 목록의 인원수도 업데이트
//     }
// }

// /**
//  * 시스템 메시지를 특정 방에 전송합니다.
//  * @param {string} roomName 
//  * @param {string} message 
//  */
// function sendSystemMessage(roomName, message) {
//     const systemMessageData = {
//         nickname: '[시스템]', 
//         text: message, 
//         timestamp: Date.now() 
//     };
//     io.to(roomName).emit('chat message', systemMessageData);
// }

// // --- HTML 파일 제공 ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html')); 
// });

// // --- Socket.IO 연결 처리 ---
// io.on('connection', (socket) => {
//     console.log('A new socket connected.');
    
//     // 초기 접속 시 방 목록을 전송
//     broadcastRoomList();

//     // 1. 방 생성 로직
//     socket.on('create room', (roomData, callback) => {
//         const { roomName, maxUsers, password } = roomData;

//         if (rooms[roomName]) {
//             return callback({ success: false, reason: "이미 존재하는 방 이름입니다." });
//         }
        
//         if (maxUsers < 2 || maxUsers > 4) {
//              return callback({ success: false, reason: "정원은 2명에서 4명 사이여야 합니다." });
//         }
        
//         // 방 생성
//         rooms[roomName] = {
//             maxUsers: maxUsers,
//             password: password || null, 
//             currentUsers: {}
//         };
        
//         // 방 생성 성공을 클라이언트에 알림
//         callback({ 
//             success: true, 
//             roomName: roomName,
//         }); 
        
//         broadcastRoomList(); // 방 목록 업데이트
//     });
    
//     // 2. 방 입장 비밀번호 및 정원 확인 로직 (일반 사용자)
//     socket.on('check join room', (roomData, callback) => {
//         const { roomName, password } = roomData;

//         if (!rooms[roomName]) {
//             return callback({ success: false, reason: "존재하지 않는 방입니다." });
//         }
        
//         const room = rooms[roomName];
        
//         // 비밀번호 확인
//         if (room.password && room.password !== password) {
//             return callback({ success: false, reason: "비밀번호가 틀렸습니다." });
//         }
        
//         // 정원 확인
//         if (Object.keys(room.currentUsers).length >= room.maxUsers) {
//             return callback({ success: false, reason: "정원이 다 찼습니다." });
//         }
        
//         // 비밀번호 검증 통과 (닉네임만 남음)
//         callback({ success: true, roomName: roomName });
//     });
    
//     // 3. 최종 방 진입 로직 (닉네임 검증 후)
//     socket.on('enter room', (roomData, callback) => {
//         const { roomName, nickname } = roomData;
        
//         if (!rooms[roomName] || !nickname) {
//             return callback({ success: false, reason: "유효하지 않은 요청입니다." });
//         }
        
//         const room = rooms[roomName];

//         // 닉네임 중복 확인 (해당 방 내에서)
//         if (Object.values(room.currentUsers).includes(nickname)) {
//             return callback({ success: false, reason: "해당 방에서 이미 사용 중인 닉네임입니다." });
//         }
        
//         // 실제 방 입장 처리
//         socket.join(roomName); 
//         socket.currentRoom = roomName; 
//         socket.nickname = nickname; 
        
//         rooms[roomName].currentUsers[socket.id] = nickname; 
        
//         sendSystemMessage(roomName, `${nickname}님이 접속했습니다.`);
//         updateRoomUserCount(roomName);
        
//         callback({ 
//             success: true, 
//             roomName: roomName, 
//             maxUsers: rooms[roomName].maxUsers 
//         });
//     });

//     // 4. 채팅 메시지 및 챗봇 처리 로직
//     socket.on('chat message', async (msg) => {
//         if (!socket.nickname || !socket.currentRoom) return;
        
//         const roomName = socket.currentRoom;
//         const now = Date.now();
//         const messageData = { nickname: socket.nickname, text: msg, timestamp: now };
        
//         // 해당 방에만 메시지 브로드캐스팅
//         io.to(roomName).emit('chat message', messageData); 
        
        
//         if (msg.startsWith('@챗봇 ')) {
//             const query = msg.substring(4).trim();
//             let botResponseText;
            
//             if (query.length === 0) {
//                 botResponseText = "질문 내용을 입력해 주세요. (예: @챗봇 오늘 날씨)";
//             } else {
                
//                 try {
//                     const response = await ai.models.generateContent({ 
//                         model: GEMINI_MODEL,
//                         contents: [{ role: "user", parts: [{ text: query }] }]
//                     });
                    
//                     botResponseText = response.text || "답변을 생성하지 못했습니다.";
                    
//                     // Markdown 기호 제거 로직
//                     if (botResponseText) {
//                         botResponseText = botResponseText.replace(/\*\*/g, '').replace(/\*/g, '');
//                     }

//                 } catch (error) {
//                      botResponseText = "죄송합니다. 챗봇 서비스 호출에 문제가 발생했습니다.";
//                      console.error("Gemini API Error:", error);
//                 }
//             }

//             // 챗봇 메시지 데이터 전송 (해당 방에만)
//             const botMessageData = { 
//                 nickname: 'Gemini 챗봇', 
//                 text: botResponseText, 
//                 timestamp: Date.now() 
//             };
//             io.to(roomName).emit('chat message', botMessageData);
//         }
//     });
  
//     // 5. 연결 끊김 처리
//     socket.on('disconnect', () => {
//         const roomName = socket.currentRoom;
//         const nickname = socket.nickname;
        
//         if (roomName && rooms[roomName]) {
            
//             // 1. 퇴장 알림 전송
//             if (nickname) {
//                 sendSystemMessage(roomName, `${nickname}님이 퇴장했습니다.`);
//             }
            
//             // 2. 방 정보에서 사용자 삭제
//             delete rooms[roomName].currentUsers[socket.id]; 
            
//             const currentUsersCount = Object.keys(rooms[roomName].currentUsers).length;
            
//             // 3. 접속 인원수 업데이트
//             updateRoomUserCount(roomName); 
            
//             // 4. 방에 아무도 없다면 방 삭제
//             if (currentUsersCount === 0) {
//                 delete rooms[roomName];
//                 console.log(`방 "${roomName}"이(가) 비어서 삭제되었습니다.`);
//                 broadcastRoomList(); // 방 목록 업데이트
//             }
            
//             // 소켓 정보 정리
//             delete socket.currentRoom;
//             delete socket.nickname;
//         }
        
//         console.log('A socket disconnected.');
//     });
// });

// server.listen(3000, () => {
//   console.log('Listening on http://localhost:3000');
// });

// ! 여기까지 7차 코드 (방만들기 기능 추가)

// // app.js

// import 'dotenv/config'; 
// import express from 'express';
// import http from 'http';
// import { Server } from "socket.io";
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { GoogleGenAI } from "@google/genai";

// const app = express();
// const server = http.createServer(app); 
// const io = new Server(server);

// // API 키 확인 및 초기화
// const apiKey = process.env.GEMINI_API_KEY;
// if (!apiKey) {
//     console.error("FATAL ERROR: GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다. 서버를 종료합니다.");
//     process.exit(1); 
// }
// const ai = new GoogleGenAI({ apiKey: apiKey}); 
// const GEMINI_MODEL = "gemini-2.5-flash"; 

// // 🚩 방 정보 관리 객체: 
// // { [roomName]: { maxUsers: number, password?: string, hostId: string, 
// //   currentUsers: { [socketId]: { nickname: string, isReady: boolean } } } } 
// const rooms = {};

// // --- 헬퍼 함수 ---

// /**
//  * 방의 현재 상태를 클라이언트들에게 브로드캐스트합니다.
//  */
// function broadcastRoomList() {
//     const roomList = Object.entries(rooms).map(([name, room]) => ({
//         name: name,
//         current: Object.keys(room.currentUsers).length,
//         max: room.maxUsers,
//         hasPassword: !!room.password 
//     }));
//     io.emit('update room list', roomList);
// }

// /**
//  * 특정 방의 현재 접속자 수를 업데이트합니다.
//  * @param {string} roomName 
//  */
// function updateRoomUserCount(roomName) {
//     if (rooms[roomName]) {
//         const count = Object.keys(rooms[roomName].currentUsers).length;
//         io.to(roomName).emit('update room user count', `${count}/${rooms[roomName].maxUsers}`);
//         broadcastRoomList(); // 방 목록의 인원수도 업데이트
//     }
// }

// /**
//  * 시스템 메시지를 특정 방에 전송합니다.
//  * @param {string} roomName 
//  * @param {string} message 
//  */
// function sendSystemMessage(roomName, message) {
//     const systemMessageData = {
//         nickname: '[시스템]', 
//         text: message, 
//         timestamp: Date.now() 
//     };
//     io.to(roomName).emit('chat message', systemMessageData);
// }

// // --- HTML 파일 제공 ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html')); 
// });

// // --- Socket.IO 연결 처리 ---
// io.on('connection', (socket) => {
//     console.log('A new socket connected.');
    
//     broadcastRoomList();

//     // 1. 방 생성 로직
//     socket.on('create room', (roomData, callback) => {
//         const { roomName, maxUsers, password } = roomData;

//         if (rooms[roomName]) {
//             return callback({ success: false, reason: "이미 존재하는 방 이름입니다." });
//         }
        
//         if (maxUsers < 2 || maxUsers > 4) {
//              return callback({ success: false, reason: "정원은 2명에서 4명 사이여야 합니다." });
//         }
        
//         // 방 생성 및 방장(Host) ID 저장
//         rooms[roomName] = {
//             maxUsers: maxUsers,
//             password: password || null, 
//             currentUsers: {},
//             hostId: socket.id, 
//         };
        
//         callback({ 
//             success: true, 
//             roomName: roomName,
//         }); 
        
//         broadcastRoomList();
//     });
    
//     // 2. 방 입장 비밀번호 및 정원 확인 로직 (변동 없음)
//     socket.on('check join room', (roomData, callback) => {
//         const { roomName, password } = roomData;

//         if (!rooms[roomName]) {
//             return callback({ success: false, reason: "존재하지 않는 방입니다." });
//         }
        
//         const room = rooms[roomName];
        
//         // 비밀번호 확인
//         if (room.password && room.password !== password) {
//             return callback({ success: false, reason: "비밀번호가 틀렸습니다." });
//         }
        
//         // 정원 확인
//         if (Object.keys(room.currentUsers).length >= room.maxUsers) {
//             return callback({ success: false, reason: "정원이 다 찼습니다." });
//         }
        
//         callback({ success: true, roomName: roomName });
//     });
    
//     // 3. 최종 방 진입 로직 (수정: isReady 상태 초기화)
//     socket.on('enter room', (roomData, callback) => {
//         const { roomName, nickname } = roomData;
        
//         if (!rooms[roomName] || !nickname) {
//             return callback({ success: false, reason: "유효하지 않은 요청입니다." });
//         }
        
//         const room = rooms[roomName];

//         // 닉네임 중복 확인 (해당 방 내에서)
//         if (Object.values(room.currentUsers).map(u => u.nickname).includes(nickname)) {
//             return callback({ success: false, reason: "해당 방에서 이미 사용 중인 닉네임입니다." });
//         }
        
//         // 실제 방 입장 처리
//         socket.join(roomName); 
//         socket.currentRoom = roomName; 
//         socket.nickname = nickname; 
        
//         // 🚩 유저 정보에 닉네임과 준비 상태 저장
//         rooms[roomName].currentUsers[socket.id] = { 
//             nickname: nickname, 
//             isReady: false 
//         }; 
        
//         sendSystemMessage(roomName, `${nickname}님이 접속했습니다.`);
//         updateRoomUserCount(roomName);
        
//         const isHost = room.hostId === socket.id;
        
//         // 🚩 방 전체에 새로운 유저의 준비 상태를 알림
//         io.to(roomName).emit('user ready update', { 
//             nickname: nickname, 
//             isReady: false,
//             socketId: socket.id
//         });
        
//         callback({ 
//             success: true, 
//             roomName: roomName, 
//             maxUsers: rooms[roomName].maxUsers,
//             isHost: isHost, 
//         });
//     });

//     // 4. 채팅 메시지 및 챗봇 처리 로직 (변동 없음)
//     socket.on('chat message', async (msg) => {
//         if (!socket.nickname || !socket.currentRoom) return;
        
//         const roomName = socket.currentRoom;
//         const now = Date.now();
//         const messageData = { nickname: socket.nickname, text: msg, timestamp: now };
        
//         io.to(roomName).emit('chat message', messageData); 
        
//         if (msg.startsWith('@챗봇 ')) {
//             const query = msg.substring(4).trim();
//             let botResponseText;
            
//             if (query.length === 0) {
//                 botResponseText = "질문 내용을 입력해 주세요. (예: @챗봇 오늘 날씨)";
//             } else {
//                 try {
//                     const response = await ai.models.generateContent({ 
//                         model: GEMINI_MODEL,
//                         contents: [{ role: "user", parts: [{ text: query }] }]
//                     });
                    
//                     botResponseText = response.text || "답변을 생성하지 못했습니다.";
                    
//                     if (botResponseText) {
//                         botResponseText = botResponseText.replace(/\*\*/g, '').replace(/\*/g, '');
//                     }

//                 } catch (error) {
//                      botResponseText = "죄송합니다. 챗봇 서비스 호출에 문제가 발생했습니다.";
//                      console.error("Gemini API Error:", error);
//                 }
//             }

//             const botMessageData = { 
//                 nickname: 'Gemini 챗봇', 
//                 text: botResponseText, 
//                 timestamp: Date.now() 
//             };
//             io.to(roomName).emit('chat message', botMessageData);
//         }
//     });
    
//     // 5. 유저 준비 상태 토글 (추가)
//     socket.on('toggle ready', () => {
//         const roomName = socket.currentRoom;
//         if (!roomName || !rooms[roomName] || rooms[roomName].hostId === socket.id) return; // 방장 제외

//         const user = rooms[roomName].currentUsers[socket.id];
//         if (user) {
//             user.isReady = !user.isReady;
            
//             // 🚩 준비 상태 변경 알림 전송
//             io.to(roomName).emit('user ready update', { 
//                 nickname: user.nickname, 
//                 isReady: user.isReady,
//                 socketId: socket.id
//             });
            
//             const status = user.isReady ? '준비했습니다' : '준비를 취소했습니다';
//             sendSystemMessage(roomName, `${user.nickname}님이 ${status}.`);
//         }
//     });
  
//     // 6. 연결 끊김 처리
//     socket.on('disconnect', () => {
//         const roomName = socket.currentRoom;
//         const nickname = socket.nickname;
        
//         if (roomName && rooms[roomName]) {
            
//             if (nickname) {
//                 sendSystemMessage(roomName, `${nickname}님이 퇴장했습니다.`);
//             }
            
//             // 2. 방 정보에서 사용자 삭제
//             delete rooms[roomName].currentUsers[socket.id]; 
            
//             const currentUsersCount = Object.keys(rooms[roomName].currentUsers).length;
            
//             // 3. 접속 인원수 업데이트
//             updateRoomUserCount(roomName); 
            
//             // 4. 방에 아무도 없다면 방 삭제
//             if (currentUsersCount === 0) {
//                 delete rooms[roomName];
//                 console.log(`방 "${roomName}"이(가) 비어서 삭제되었습니다.`);
//                 broadcastRoomList(); 
//             } else if (rooms[roomName].hostId === socket.id) {
//                 // 🚩 방장이 나갔을 경우 처리 (첫 번째 남은 유저에게 방장 권한 위임)
//                 const remainingUserIds = Object.keys(rooms[roomName].currentUsers);
//                 if (remainingUserIds.length > 0) {
//                     const newHostId = remainingUserIds[0];
//                     rooms[roomName].hostId = newHostId;
//                     const newHostNickname = rooms[roomName].currentUsers[newHostId].nickname;
                    
//                     sendSystemMessage(roomName, `👑 ${newHostNickname}님에게 방장 권한이 위임되었습니다.`);
                    
//                     // 새로운 방장에게 권한 변경 알림
//                     io.to(newHostId).emit('host change', true);
//                     // 나머지 유저들에게도 권한 변경 알림 (준비 버튼으로 변경)
//                     remainingUserIds.filter(id => id !== newHostId).forEach(id => {
//                         io.to(id).emit('host change', false); 
//                     });
//                 }
//             }
            
//             // 소켓 정보 정리
//             delete socket.currentRoom;
//             delete socket.nickname;
//         }
        
//         console.log('A socket disconnected.');
//     });

//     // 7. 게임 시작 요청 핸들러
//     socket.on('start game', () => {
//         const roomName = socket.currentRoom;
//         const room = rooms[roomName];
        
//         if (!roomName || !room) return;
        
//         // 방장인지 확인
//         if (room.hostId === socket.id) {
//             const users = Object.values(room.currentUsers);
//             const readyUsers = users.filter(u => u.isReady);
            
//             const totalUsers = users.length;
            
//             if (totalUsers < 2) {
//                 sendSystemMessage(roomName, "게임 시작을 위해서는 최소 2명이 필요합니다.");
//                 return;
//             }
            
//             // 방장 제외한 모두가 준비했는지 확인
//             const notHostUsers = users.filter(u => io.sockets.sockets.get(u.socketId)?.id !== room.hostId);
//             const allReady = notHostUsers.length === readyUsers.length; 

//             if (!allReady) {
//                  sendSystemMessage(roomName, "게임 시작을 위해서는 방장을 제외한 모든 유저가 준비해야 합니다.");
//                  return;
//             }
            
//             io.to(roomName).emit('game started', `${socket.nickname}님이 게임을 시작했습니다!`);
//             sendSystemMessage(roomName, "✨ 게임이 시작되었습니다! ✨");
//         } else {
//             sendSystemMessage(roomName, "게임 시작 권한은 방장에게만 있습니다.");
//         }
//     });
// });

// server.listen(3000, () => {
//   console.log('Listening on http://localhost:3000');
// });

// ! 여기까지 8차 코드 (방장 권한 및 준비 상태 기능 추가)

// // app.js

// import 'dotenv/config'; 
// import express from 'express';
// import http from 'http';
// import { Server } from "socket.io";
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { GoogleGenAI } from "@google/genai";

// const app = express();
// const server = http.createServer(app); 
// const io = new Server(server);

// // API 키 확인 및 초기화
// const apiKey = process.env.GEMINI_API_KEY;
// if (!apiKey) {
//     console.error("FATAL ERROR: GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다. 서버를 종료합니다.");
//     process.exit(1); 
// }
// const ai = new GoogleGenAI({ apiKey: apiKey}); 
// const GEMINI_MODEL = "gemini-2.5-flash"; 

// // 🚩 방 정보 관리 객체 구조
// // { [roomName]: { maxUsers: number, password?: string, hostId: string, 
// //   currentUsers: { [socketId]: { nickname: string, isReady: boolean, socketId: string } } } } 
// const rooms = {};

// // --- 헬퍼 함수 ---

// /**
//  * 방의 현재 상태를 클라이언트들에게 브로드캐스트합니다.
//  */
// function broadcastRoomList() {
//     const roomList = Object.entries(rooms).map(([name, room]) => ({
//         name: name,
//         current: Object.keys(room.currentUsers).length,
//         max: room.maxUsers,
//         hasPassword: !!room.password 
//     }));
//     io.emit('update room list', roomList);
// }

// /**
//  * 특정 방의 현재 접속자 수를 업데이트합니다.
//  * @param {string} roomName 
//  */
// function updateRoomUserCount(roomName) {
//     if (rooms[roomName]) {
//         const count = Object.keys(rooms[roomName].currentUsers).length;
//         io.to(roomName).emit('update room user count', `${count}/${rooms[roomName].maxUsers}`);
//         broadcastRoomList(); 
//     }
// }

// /**
//  * 시스템 메시지를 특정 방에 전송합니다.
//  * @param {string} roomName 
//  * @param {string} message 
//  */
// function sendSystemMessage(roomName, message) {
//     const systemMessageData = {
//         nickname: '[시스템]', 
//         text: message, 
//         timestamp: Date.now() 
//     };
//     io.to(roomName).emit('chat message', systemMessageData);
// }

// /**
//  * 특정 방의 유저 목록과 방장 정보를 해당 방 유저들에게 브로드캐스트합니다.
//  * @param {string} roomName 
//  */
// function broadcastUserList(roomName) {
//     if (!rooms[roomName]) return;

//     const room = rooms[roomName];
//     // currentUsers가 객체가 아닌 배열 형태로 클라이언트에 전송
//     const userList = Object.values(room.currentUsers).map(user => ({
//         id: user.socketId,
//         nickname: user.nickname,
//         isHost: user.socketId === room.hostId,
//         isReady: user.isReady
//     }));
    
//     io.to(roomName).emit('update user list', userList);
// }


// // --- HTML 파일 제공 ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html')); 
// });

// // --- Socket.IO 연결 처리 ---
// io.on('connection', (socket) => {
//     console.log('A new socket connected.');
    
//     broadcastRoomList();

//     // 1. 방 생성 로직
//     socket.on('create room', (roomData, callback) => {
//         const { roomName, maxUsers, password } = roomData;

//         if (rooms[roomName]) {
//             return callback({ success: false, reason: "이미 존재하는 방 이름입니다." });
//         }
        
//         if (maxUsers < 2 || maxUsers > 4) {
//              return callback({ success: false, reason: "정원은 2명에서 4명 사이여야 합니다." });
//         }
        
//         rooms[roomName] = {
//             maxUsers: maxUsers,
//             password: password || null, 
//             currentUsers: {},
//             hostId: socket.id, 
//         };
        
//         callback({ 
//             success: true, 
//             roomName: roomName,
//         }); 
        
//         broadcastRoomList();
//     });
    
//     // 2. 방 입장 비밀번호 및 정원 확인 로직 (변동 없음)
//     socket.on('check join room', (roomData, callback) => {
//         const { roomName, password } = roomData;

//         if (!rooms[roomName]) {
//             return callback({ success: false, reason: "존재하지 않는 방입니다." });
//         }
        
//         const room = rooms[roomName];
        
//         if (room.password && room.password !== password) {
//             return callback({ success: false, reason: "비밀번호가 틀렸습니다." });
//         }
        
//         if (Object.keys(room.currentUsers).length >= room.maxUsers) {
//             return callback({ success: false, reason: "정원이 다 찼습니다." });
//         }
        
//         callback({ success: true, roomName: roomName });
//     });
    
//     // 3. 최종 방 진입 로직
//     socket.on('enter room', (roomData, callback) => {
//         const { roomName, nickname } = roomData;
        
//         if (!rooms[roomName] || !nickname) {
//             return callback({ success: false, reason: "유효하지 않은 요청입니다." });
//         }
        
//         const room = rooms[roomName];

//         if (Object.values(room.currentUsers).map(u => u.nickname).includes(nickname)) {
//             return callback({ success: false, reason: "해당 방에서 이미 사용 중인 닉네임입니다." });
//         }
        
//         socket.join(roomName); 
//         socket.currentRoom = roomName; 
//         socket.nickname = nickname; 
        
//         rooms[roomName].currentUsers[socket.id] = { 
//             nickname: nickname, 
//             isReady: false,
//             socketId: socket.id 
//         }; 
        
//         sendSystemMessage(roomName, `${nickname}님이 접속했습니다.`);
//         updateRoomUserCount(roomName);
        
//         const isHost = room.hostId === socket.id;
        
//         broadcastUserList(roomName);

//         callback({ 
//             success: true, 
//             roomName: roomName, 
//             maxUsers: rooms[roomName].maxUsers,
//             isHost: isHost, 
//         });
//     });

//     // 4. 채팅 메시지 및 챗봇 처리 로직 (변동 없음)
//     socket.on('chat message', async (msg) => {
//         if (!socket.nickname || !socket.currentRoom) return;
        
//         const roomName = socket.currentRoom;
//         const now = Date.now();
//         const messageData = { nickname: socket.nickname, text: msg, timestamp: now };
        
//         io.to(roomName).emit('chat message', messageData); 
        
//         if (msg.startsWith('@챗봇 ')) {
//             const query = msg.substring(4).trim();
//             let botResponseText;
            
//             if (query.length === 0) {
//                 botResponseText = "질문 내용을 입력해 주세요. (예: @챗봇 오늘 날씨)";
//             } else {
//                 try {
//                     const response = await ai.models.generateContent({ 
//                         model: GEMINI_MODEL,
//                         contents: [{ role: "user", parts: [{ text: query }] }]
//                     });
                    
//                     botResponseText = response.text || "답변을 생성하지 못했습니다.";
                    
//                     if (botResponseText) {
//                         botResponseText = botResponseText.replace(/\*\*/g, '').replace(/\*/g, '');
//                     }

//                 } catch (error) {
//                      botResponseText = "죄송합니다. 챗봇 서비스 호출에 문제가 발생했습니다.";
//                      console.error("Gemini API Error:", error);
//                 }
//             }

//             const botMessageData = { 
//                 nickname: 'Gemini 챗봇', 
//                 text: botResponseText, 
//                 timestamp: Date.now() 
//             };
//             io.to(roomName).emit('chat message', botMessageData);
//         }
//     });
    
//     // 5. 유저 준비 상태 토글
//     socket.on('toggle ready', () => {
//         const roomName = socket.currentRoom;
//         if (!roomName || !rooms[roomName] || rooms[roomName].hostId === socket.id) return; // 방장 제외

//         const user = rooms[roomName].currentUsers[socket.id];
//         if (user) {
//             // 게임이 이미 시작되었는지 확인하는 로직은 추가하지 않았습니다. 필요 시 추가 가능.
//             user.isReady = !user.isReady;
            
//             const status = user.isReady ? '준비했습니다' : '준비를 취소했습니다';
//             sendSystemMessage(roomName, `${user.nickname}님이 ${status}.`);
            
//             broadcastUserList(roomName); // 유저 목록 업데이트를 통해 클라이언트 준비 상태 갱신
//         }
//     });
    
//     // 6. 방장 위임 요청 핸들러
//     socket.on('delegate host', (targetId) => {
//         const roomName = socket.currentRoom;
//         const room = rooms[roomName];
        
//         if (!roomName || !room || room.hostId !== socket.id) {
//             return sendSystemMessage(roomName, "방장 위임 권한이 없습니다.");
//         }

//         if (!room.currentUsers[targetId]) {
//             return sendSystemMessage(roomName, "해당 유저가 방에 존재하지 않습니다.");
//         }
        
//         const oldHostNickname = socket.nickname;
//         const newHostNickname = room.currentUsers[targetId].nickname;

//         room.hostId = targetId;
        
//         sendSystemMessage(roomName, `👑 ${oldHostNickname}님이 ${newHostNickname}님에게 방장 권한을 위임했습니다.`);
        
//         io.to(targetId).emit('host change', true); 
//         socket.emit('host change', false);         
        
//         broadcastUserList(roomName);
//     });
  
//     // 7. 연결 끊김 처리
//     socket.on('disconnect', () => {
//         const roomName = socket.currentRoom;
//         const nickname = socket.nickname;
        
//         if (roomName && rooms[roomName]) {
            
//             if (nickname) {
//                 sendSystemMessage(roomName, `${nickname}님이 퇴장했습니다.`);
//             }
            
//             delete rooms[roomName].currentUsers[socket.id]; 
            
//             const currentUsersCount = Object.keys(rooms[roomName].currentUsers).length;
            
//             updateRoomUserCount(roomName); 
            
//             if (currentUsersCount === 0) {
//                 delete rooms[roomName];
//                 console.log(`방 "${roomName}"이(가) 비어서 삭제되었습니다.`);
//                 broadcastRoomList(); 
//             } else if (rooms[roomName].hostId === socket.id) {
//                 // 방장이 나갔을 경우 처리 (첫 번째 남은 유저에게 방장 권한 위임)
//                 const remainingUserIds = Object.keys(rooms[roomName].currentUsers);
//                 if (remainingUserIds.length > 0) {
//                     const newHostId = remainingUserIds[0];
//                     rooms[roomName].hostId = newHostId;
//                     const newHostNickname = rooms[roomName].currentUsers[newHostId].nickname;
                    
//                     sendSystemMessage(roomName, `👑 ${newHostNickname}님에게 방장 권한이 위임되었습니다.`);
                    
//                     io.to(newHostId).emit('host change', true);
                    
//                     broadcastUserList(roomName);
//                 }
//             }
            
//             if (currentUsersCount > 0) {
//                 broadcastUserList(roomName); 
//             }
            
//             delete socket.currentRoom;
//             delete socket.nickname;
//         }
        
//         console.log('A socket disconnected.');
//     });

//     // 8. 게임 시작 요청 핸들러 (수정: 준비 조건 확인)
//     socket.on('start game', () => {
//         const roomName = socket.currentRoom;
//         const room = rooms[roomName];
        
//         if (!roomName || !room) return;
        
//         if (room.hostId === socket.id) {
//             const users = Object.values(room.currentUsers);
//             const totalUsers = users.length;
            
//             if (totalUsers < 2) {
//                 sendSystemMessage(roomName, "게임 시작을 위해서는 최소 2명이 필요합니다.");
//                 return;
//             }
            
//             // 방장 제외한 유저 필터링
//             const otherUsers = users.filter(u => u.socketId !== room.hostId);
            
//             // 방장 제외 모두 준비했는지 확인
//             const allReady = otherUsers.every(u => u.isReady); 

//             if (!allReady) {
//                  sendSystemMessage(roomName, "게임 시작을 위해서는 방장을 제외한 모든 유저가 준비해야 합니다.");
//                  return;
//             }
            
//             sendSystemMessage(roomName, "✨ 게임이 시작됩니다. 채팅창이 전환됩니다! ✨");
//             // 클라이언트에게 게임 시작 및 화면 전환 이벤트 전송
//             io.to(roomName).emit('game phase start', { message: '게임이 시작되었습니다.' });
//         } else {
//             sendSystemMessage(roomName, "게임 시작 권한은 방장에게만 있습니다.");
//         }
//     });
// });

// server.listen(3000, () => {
//   console.log('Listening on http://localhost:3000');
// });

// ! 여기까지 9차 코드 (유저 목록 브로드캐스트 기능 추가)

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

const port = 3000;

// 💡 전역 상태: 방 목록 및 유저 정보 저장
const rooms = {};
const users = {};

// ----------------------------------------------------
// 헬퍼 함수
// ----------------------------------------------------

/** 현재 방 목록을 모든 클라이언트에 업데이트 */
function emitRoomListUpdate() {
    const roomList = Object.values(rooms)
        .filter(room => Object.keys(room.users).length > 0)
        .map(room => ({
            name: room.name,
            current: Object.keys(room.users).length,
            max: room.maxUsers,
            hasPassword: !!room.password
        }));
    io.emit('update room list', roomList);
}

/** 특정 방의 유저 목록 및 상태를 방 유저들에게 업데이트 */
function emitUserListUpdate(roomName) {
    const room = rooms[roomName];
    if (!room) return;

    const userList = Object.values(room.users).map(user => ({
        id: user.id,
        nickname: user.nickname,
        isHost: user.isHost,
        isReady: user.isReady,
        stats: user.stats // 능력치 설정 여부 포함
    }));

    const countString = `${Object.keys(room.users).length}/${room.maxUsers}`;

    io.to(roomName).emit('update user list', userList);
    io.to(roomName).emit('update room user count', countString);
}

/** 시스템 메시지 전송 */
function sendSystemMessage(roomName, message) {
    io.to(roomName).emit('chat message', {
        nickname: '[시스템]',
        text: message,
        timestamp: Date.now()
    });
}

/** 🚩 [NEW] 턴 시작 로직 */
function startNextTurn(roomName) {
    const room = rooms[roomName];
    if (!room || room.gamePhase !== 'ACTIVE' || room.turnOrder.length === 0) return;

    // 턴 인덱스 업데이트
    room.currentTurnIndex = (room.currentTurnIndex + 1) % room.turnOrder.length;
    const nextTurnSocketId = room.turnOrder[room.currentTurnIndex];
    const nextUser = room.users[nextTurnSocketId];

    if (!nextUser) {
        // 유저가 나간 경우 재귀적으로 다음 턴 시도
        console.log(`User ${nextTurnSocketId} not found. Skipping turn.`);
        return startNextTurn(roomName);
    }
    
    // 다음 턴 유저에게 알림
    io.to(nextTurnSocketId).emit('turn start', {
        message: `🔥 ${nextUser.nickname}님의 턴이 시작되었습니다.`,
        isMyTurn: true
    });

    // 다른 유저들에게 알림
    io.to(roomName).except(nextTurnSocketId).emit('turn start', {
        message: `⚡️ ${nextUser.nickname}님의 턴입니다.`,
        isMyTurn: false
    });

    sendSystemMessage(roomName, `${nextUser.nickname}님의 차례입니다. (${room.currentTurnIndex + 1}/${room.turnOrder.length})`);
}

// ----------------------------------------------------
// Express 라우팅 및 파일 제공
// ----------------------------------------------------

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ----------------------------------------------------
// Socket.IO 이벤트 핸들러
// ----------------------------------------------------

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 유저 접속 시 방 목록 업데이트 전송
    emitRoomListUpdate();

    // ----------------------------------------------------
    // 1. 방 생성
    // ----------------------------------------------------
    socket.on('create room', ({ roomName, maxUsers, password }, callback) => {
        if (rooms[roomName]) {
            return callback({ success: false, reason: '이미 존재하는 방 이름입니다.' });
        }
        if (Object.keys(rooms).length >= 10) {
            return callback({ success: false, reason: '최대 방 개수에 도달했습니다.' });
        }
        if (maxUsers < 2 || maxUsers > 4) {
             return callback({ success: false, reason: '정원은 2명에서 4명 사이여야 합니다.' });
        }

        rooms[roomName] = {
            name: roomName,
            maxUsers: maxUsers,
            password: password,
            users: {},
            gamePhase: 'LOBBY', // 🚩 게임 상태 추가
            setupCompleteCount: 0,
            turnOrder: [],
            currentTurnIndex: -1
        };

        callback({ success: true, roomName: roomName });
        emitRoomListUpdate();
    });

    // ----------------------------------------------------
    // 2. 방 비밀번호 확인
    // ----------------------------------------------------
    socket.on('check join room', ({ roomName, password }, callback) => {
        const room = rooms[roomName];
        if (!room) {
            return callback({ success: false, reason: '존재하지 않는 방입니다.' });
        }
        if (room.password && room.password !== password) {
            return callback({ success: false, reason: '비밀번호가 틀렸습니다.' });
        }
        callback({ success: true });
    });

    // ----------------------------------------------------
    // 3. 방 입장
    // ----------------------------------------------------
    socket.on('enter room', ({ roomName, nickname }, callback) => {
        const room = rooms[roomName];
        if (!room) {
            return callback({ success: false, reason: '존재하지 않는 방입니다.' });
        }
        if (Object.keys(room.users).length >= room.maxUsers) {
            return callback({ success: false, reason: '방이 가득 찼습니다.' });
        }
        const nicknameUsed = Object.values(room.users).some(user => user.nickname === nickname);
        if (nicknameUsed) {
            return callback({ success: false, reason: '이미 사용 중인 닉네임입니다.' });
        }
        
        // 이전 방에서 나가기
        if (users[socket.id] && users[socket.id].room) {
            // 퇴장 로직은 disconnect에 통합
        }
        
        socket.join(roomName);
        
        const isHost = Object.keys(room.users).length === 0;

        // 유저 정보 저장
        const user = { 
            id: socket.id, 
            nickname: nickname, 
            room: roomName, 
            isHost: isHost, 
            isReady: false,
            stats: null // 🚩 [NEW] 능력치 초기화
        };
        room.users[socket.id] = user;
        users[socket.id] = user;

        sendSystemMessage(roomName, `${nickname}님이 입장했습니다.`);
        emitUserListUpdate(roomName);
        emitRoomListUpdate();

        callback({ success: true, roomName: roomName, isHost: isHost });
    });

    // ----------------------------------------------------
    // 4. 채팅 메시지 전송 (턴 기반 로직 포함)
    // ----------------------------------------------------
    socket.on('chat message', (msg) => {
        const user = users[socket.id];
        if (!user) return;
        const room = rooms[user.room];
        if (!room) return;

        // 턴제 게임 활성화 상태 확인
        if (room.gamePhase === 'ACTIVE') {
            const currentTurnSocketId = room.turnOrder[room.currentTurnIndex];
            
            // 턴 유저인지 확인
            if (socket.id !== currentTurnSocketId) {
                // 내 턴이 아니면 시스템 메시지 전송 (클라이언트에서 차단하지만 서버에서도 확인)
                io.to(socket.id).emit('chat message', {
                    nickname: '[시스템]',
                    text: `현재는 ${room.users[currentTurnSocketId].nickname}님의 턴입니다. 잠시 기다려주세요.`,
                    timestamp: Date.now()
                });
                return;
            }
            
            // 메시지 전송
            io.to(user.room).emit('chat message', {
                nickname: user.nickname,
                text: msg,
                timestamp: Date.now()
            });

            // 챗봇 호출이 아닐 경우 턴을 넘김
            if (!msg.startsWith('@챗봇')) {
                // 🚩 다음 턴 시작
                startNextTurn(user.room);
            } else {
                // 챗봇 응답 로직 (간단한 더미 응답)
                setTimeout(() => {
                    io.to(user.room).emit('chat message', {
                        nickname: 'Gemini 챗봇',
                        text: `[챗봇 응답]: ${user.nickname}님의 질문을 받았습니다. 다음 턴에 답변하겠습니다.`,
                        timestamp: Date.now()
                    });
                     // 챗봇 응답 후에도 턴은 유지
                }, 1000);
            }

        } else {
            // 로비 채팅 메시지 전송
             io.to(user.room).emit('chat message', {
                nickname: user.nickname,
                text: msg,
                timestamp: Date.now()
            });
        }
    });

    // ----------------------------------------------------
    // 5. 게임 준비 상태 토글
    // ----------------------------------------------------
    socket.on('toggle ready', () => {
        const user = users[socket.id];
        if (!user || user.isHost) return;
        const room = rooms[user.room];
        if (!room || room.gamePhase !== 'LOBBY') return; // 로비 상태에서만 준비 가능

        user.isReady = !user.isReady;
        sendSystemMessage(user.room, `${user.nickname}님이 ${user.isReady ? '준비 완료' : '준비 취소'}했습니다.`);
        emitUserListUpdate(user.room);
    });

    // ----------------------------------------------------
    // 6. 게임 시작 (방장만)
    // ----------------------------------------------------
    socket.on('start game', () => {
        const user = users[socket.id];
        if (!user || !user.isHost) return;
        const room = rooms[user.room];
        if (!room || Object.keys(room.users).length < 2) {
            sendSystemMessage(user.room, '게임을 시작하려면 최소 2명 이상이 필요합니다.');
            return;
        }

        const allReady = Object.values(room.users).every(u => u.isHost || u.isReady);
        if (!allReady) {
            sendSystemMessage(user.room, '모든 유저가 준비 상태여야 게임을 시작할 수 있습니다.');
            return;
        }
        
        // 🚩 게임 시작 -> 능력치 설정 페이즈로 전환
        room.gamePhase = 'SETUP'; 
        room.setupCompleteCount = 0;

        io.to(user.room).emit('game phase start', {
            message: '게임이 시작됩니다! 캐릭터 능력치를 설정해주세요.'
        });
        sendSystemMessage(user.room, '게임이 시작됩니다. 각 유저는 캐릭터 능력치를 설정해주세요.');
    });
    
    // ----------------------------------------------------
    // 7. 🚩 [NEW] 능력치 설정 완료 및 턴 기반 게임 시작
    // ----------------------------------------------------
    socket.on('set stats and finish setup', (stats, callback) => {
        const user = users[socket.id];
        if (!user) return callback({ success: false, reason: '유저 정보를 찾을 수 없습니다.' });
        const room = rooms[user.room];
        if (!room || room.gamePhase !== 'SETUP' || user.stats) {
            return callback({ success: false, reason: '능력치 설정 단계가 아니거나 이미 설정했습니다.' });
        }
        
        // 능력치 유효성 검사 (클라이언트에서 했지만 서버에서도 확인)
        if (stats.hp < 10 || stats.hp > 100 || stats.attack < 1 || stats.attack > 20) {
            return callback({ success: false, reason: '유효하지 않은 능력치 값입니다.' });
        }

        user.stats = stats;
        room.setupCompleteCount++;
        
        sendSystemMessage(user.room, `${user.nickname}님이 캐릭터 **${stats.name}** 설정을 완료했습니다.`);
        emitUserListUpdate(user.room);
        callback({ success: true });

        // 모든 유저가 설정을 완료했는지 확인
        if (room.setupCompleteCount === Object.keys(room.users).length) {
            room.gamePhase = 'ACTIVE';
            
            // 🚩 턴 순서 결정: 방장(Host)을 먼저, 나머지는 접속 순서대로 (현재 users 객체는 접속 순서를 반영)
            const sortedUsers = Object.values(room.users).sort((a, b) => {
                if (a.isHost) return -1; // 호스트를 맨 앞으로
                if (b.isHost) return 1;
                return 0; // 호스트가 아닌 유저들은 접속 순서 유지
            });
            
            room.turnOrder = sortedUsers.map(u => u.id);
            room.currentTurnIndex = -1; // startNextTurn에서 0으로 시작하도록 -1로 설정
            
            sendSystemMessage(room.name, '모든 유저의 캐릭터 설정이 완료되어 게임이 시작됩니다!');
            
            // 첫 번째 턴 시작
            startNextTurn(room.name);
        }
    });


    // ----------------------------------------------------
    // 8. 방장 권한 위임
    // ----------------------------------------------------
    socket.on('delegate host', (targetSocketId) => {
        const user = users[socket.id];
        if (!user || !user.isHost) return;
        const room = rooms[user.room];
        if (!room) return;

        const targetUser = room.users[targetSocketId];
        if (!targetUser) return;

        // 권한 변경
        user.isHost = false;
        targetUser.isHost = true;
        
        // 준비 상태 초기화
        user.isReady = false;
        targetUser.isReady = false;

        io.to(socket.id).emit('host change', false);
        io.to(targetSocketId).emit('host change', true);

        sendSystemMessage(user.room, `${user.nickname}님이 ${targetUser.nickname}님에게 방장 권한을 위임했습니다.`);
        emitUserListUpdate(user.room);
    });

    // ----------------------------------------------------
    // 9. 연결 해제
    // ----------------------------------------------------
    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (!user) return;

        const roomName = user.room;
        const room = rooms[roomName];
        
        if (room && room.users[socket.id]) {
            const wasHost = room.users[socket.id].isHost;
            
            // 방 유저 목록에서 제거
            delete room.users[socket.id];
            delete users[socket.id];
            
            sendSystemMessage(roomName, `${user.nickname}님이 퇴장했습니다.`);
            
            const remainingUsers = Object.values(room.users);
            
            if (remainingUsers.length === 0) {
                // 방에 남은 유저가 없으면 방 제거
                delete rooms[roomName];
                emitRoomListUpdate();
                return;
            }
            
            // 호스트 이탈 시 새로운 호스트 지정
            if (wasHost) {
                const newHost = remainingUsers[0];
                if (newHost) {
                    newHost.isHost = true;
                    io.to(newHost.id).emit('host change', true);
                    sendSystemMessage(roomName, `${newHost.nickname}님이 새로운 방장이 되었습니다.`);
                }
            }
            
            // 🚩 게임 중 이탈 시 턴 순서 재조정
            if (room.gamePhase !== 'LOBBY') {
                room.setupCompleteCount = 0; // 재정비를 위해 카운트 리셋
                room.turnOrder = remainingUsers.map(u => u.id); // 새로운 턴 순서
                room.currentTurnIndex = -1;
                
                // 턴 유저가 나갔다면 다음 턴 시작
                if (room.turnOrder.length > 0) {
                     sendSystemMessage(roomName, '유저 이탈로 턴 순서가 재조정됩니다.');
                     startNextTurn(roomName); 
                }
            }

            emitUserListUpdate(roomName);
            emitRoomListUpdate();
        }
        
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});