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
// app.js

import 'dotenv/config'; 
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

const app = express();
const server = http.createServer(app); 
const io = new Server(server);

// API 키 확인 및 초기화
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다. 서버를 종료합니다.");
    process.exit(1); 
}
const ai = new GoogleGenAI({ apiKey: apiKey}); 
const GEMINI_MODEL = "gemini-2.5-flash"; 

// 🚩 방 정보 관리 객체: { [roomName]: { maxUsers: number, password?: string, currentUsers: { [socketId]: nickname } } }
const rooms = {};

// --- 헬퍼 함수 ---

/**
 * 방의 현재 상태를 클라이언트들에게 브로드캐스트합니다.
 */
function broadcastRoomList() {
    const roomList = Object.entries(rooms).map(([name, room]) => ({
        name: name,
        current: Object.keys(room.currentUsers).length,
        max: room.maxUsers,
        hasPassword: !!room.password 
    }));
    io.emit('update room list', roomList);
}

/**
 * 특정 방의 현재 접속자 수를 업데이트합니다.
 * @param {string} roomName 
 */
function updateRoomUserCount(roomName) {
    if (rooms[roomName]) {
        const count = Object.keys(rooms[roomName].currentUsers).length;
        io.to(roomName).emit('update room user count', `${count}/${rooms[roomName].maxUsers}`);
        broadcastRoomList(); // 방 목록의 인원수도 업데이트
    }
}

/**
 * 시스템 메시지를 특정 방에 전송합니다.
 * @param {string} roomName 
 * @param {string} message 
 */
function sendSystemMessage(roomName, message) {
    const systemMessageData = {
        nickname: '[시스템]', 
        text: message, 
        timestamp: Date.now() 
    };
    io.to(roomName).emit('chat message', systemMessageData);
}

// --- HTML 파일 제공 ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); 
});

// --- Socket.IO 연결 처리 ---
io.on('connection', (socket) => {
    console.log('A new socket connected.');
    
    // 초기 접속 시 방 목록을 전송
    broadcastRoomList();

    // 1. 방 생성 로직
    socket.on('create room', (roomData, callback) => {
        const { roomName, maxUsers, password } = roomData;

        if (rooms[roomName]) {
            return callback({ success: false, reason: "이미 존재하는 방 이름입니다." });
        }
        
        if (maxUsers < 2 || maxUsers > 4) {
             return callback({ success: false, reason: "정원은 2명에서 4명 사이여야 합니다." });
        }
        
        // 방 생성
        rooms[roomName] = {
            maxUsers: maxUsers,
            password: password || null, 
            currentUsers: {}
        };
        
        // 방 생성 성공을 클라이언트에 알림
        callback({ 
            success: true, 
            roomName: roomName,
        }); 
        
        broadcastRoomList(); // 방 목록 업데이트
    });
    
    // 2. 방 입장 비밀번호 및 정원 확인 로직 (일반 사용자)
    socket.on('check join room', (roomData, callback) => {
        const { roomName, password } = roomData;

        if (!rooms[roomName]) {
            return callback({ success: false, reason: "존재하지 않는 방입니다." });
        }
        
        const room = rooms[roomName];
        
        // 비밀번호 확인
        if (room.password && room.password !== password) {
            return callback({ success: false, reason: "비밀번호가 틀렸습니다." });
        }
        
        // 정원 확인
        if (Object.keys(room.currentUsers).length >= room.maxUsers) {
            return callback({ success: false, reason: "정원이 다 찼습니다." });
        }
        
        // 비밀번호 검증 통과 (닉네임만 남음)
        callback({ success: true, roomName: roomName });
    });
    
    // 3. 최종 방 진입 로직 (닉네임 검증 후)
    socket.on('enter room', (roomData, callback) => {
        const { roomName, nickname } = roomData;
        
        if (!rooms[roomName] || !nickname) {
            return callback({ success: false, reason: "유효하지 않은 요청입니다." });
        }
        
        const room = rooms[roomName];

        // 닉네임 중복 확인 (해당 방 내에서)
        if (Object.values(room.currentUsers).includes(nickname)) {
            return callback({ success: false, reason: "해당 방에서 이미 사용 중인 닉네임입니다." });
        }
        
        // 실제 방 입장 처리
        socket.join(roomName); 
        socket.currentRoom = roomName; 
        socket.nickname = nickname; 
        
        rooms[roomName].currentUsers[socket.id] = nickname; 
        
        sendSystemMessage(roomName, `${nickname}님이 접속했습니다.`);
        updateRoomUserCount(roomName);
        
        callback({ 
            success: true, 
            roomName: roomName, 
            maxUsers: rooms[roomName].maxUsers 
        });
    });

    // 4. 채팅 메시지 및 챗봇 처리 로직
    socket.on('chat message', async (msg) => {
        if (!socket.nickname || !socket.currentRoom) return;
        
        const roomName = socket.currentRoom;
        const now = Date.now();
        const messageData = { nickname: socket.nickname, text: msg, timestamp: now };
        
        // 해당 방에만 메시지 브로드캐스팅
        io.to(roomName).emit('chat message', messageData); 
        
        
        if (msg.startsWith('@챗봇 ')) {
            const query = msg.substring(4).trim();
            let botResponseText;
            
            if (query.length === 0) {
                botResponseText = "질문 내용을 입력해 주세요. (예: @챗봇 오늘 날씨)";
            } else {
                
                try {
                    const response = await ai.models.generateContent({ 
                        model: GEMINI_MODEL,
                        contents: [{ role: "user", parts: [{ text: query }] }]
                    });
                    
                    botResponseText = response.text || "답변을 생성하지 못했습니다.";
                    
                    // Markdown 기호 제거 로직
                    if (botResponseText) {
                        botResponseText = botResponseText.replace(/\*\*/g, '').replace(/\*/g, '');
                    }

                } catch (error) {
                     botResponseText = "죄송합니다. 챗봇 서비스 호출에 문제가 발생했습니다.";
                     console.error("Gemini API Error:", error);
                }
            }

            // 챗봇 메시지 데이터 전송 (해당 방에만)
            const botMessageData = { 
                nickname: 'Gemini 챗봇', 
                text: botResponseText, 
                timestamp: Date.now() 
            };
            io.to(roomName).emit('chat message', botMessageData);
        }
    });
  
    // 5. 연결 끊김 처리
    socket.on('disconnect', () => {
        const roomName = socket.currentRoom;
        const nickname = socket.nickname;
        
        if (roomName && rooms[roomName]) {
            
            // 1. 퇴장 알림 전송
            if (nickname) {
                sendSystemMessage(roomName, `${nickname}님이 퇴장했습니다.`);
            }
            
            // 2. 방 정보에서 사용자 삭제
            delete rooms[roomName].currentUsers[socket.id]; 
            
            const currentUsersCount = Object.keys(rooms[roomName].currentUsers).length;
            
            // 3. 접속 인원수 업데이트
            updateRoomUserCount(roomName); 
            
            // 4. 방에 아무도 없다면 방 삭제
            if (currentUsersCount === 0) {
                delete rooms[roomName];
                console.log(`방 "${roomName}"이(가) 비어서 삭제되었습니다.`);
                broadcastRoomList(); // 방 목록 업데이트
            }
            
            // 소켓 정보 정리
            delete socket.currentRoom;
            delete socket.nickname;
        }
        
        console.log('A socket disconnected.');
    });
});

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});